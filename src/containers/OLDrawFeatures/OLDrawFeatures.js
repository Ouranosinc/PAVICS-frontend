import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { VISUALIZE_DRAW_MODES } from './../../constants';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import Map from 'ol/Map';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { createRegularPolygon, createBox } from 'ol/interaction/Draw';
import { platformModifierKeyOnly, altKeyOnly, altShiftKeysOnly, shiftKeyOnly, singleClick, doubleClick } from 'ol/events/condition';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle, Fill, Text, Stroke, Style, RegularShape } from 'ol/style';
import { actions as layerCustomFeatureActions } from '../../redux/modules/LayerCustomFeature';

// Interesting try/catch to avoid main thread error (on Polygon/LineString drawing with Select/Modify interactions)
// https://github.com/openlayers/openlayers/issues/6310
import RBush from 'ol/structs/RBush';
const RBushUpdateOrig = RBush.prototype.update;
RBush.prototype.update = function () {
  try {
    RBushUpdateOrig.apply(this, arguments);
  } catch (e) {
    console.warn('RBushUpdateOrig', e);
  }
};

class OLDrawFeatures extends React.Component {
  static propTypes = {
    layerCustomFeature: PropTypes.object.isRequired,
    layerCustomFeatureActions: PropTypes.object.isRequired,
    layerName: PropTypes.string.isRequired,
    layerZIndex: PropTypes.number.isRequired,
    map: PropTypes.instanceOf(Map)
  };

  state = {
    drawnCustomFeatures: []
  };

  constructor(props) {
    super(props);
    this.layer = null;
    this.source = null;
    this.modify = null;
    this.select = null;
    this.draw = null;
    this.snap = null;
  }

  componentDidMount () {

  }

  componentWillUnmount () {
    // TODO: Remove layers/interactions/etc
  }

  componentWillReceiveProps (nextProps) {
    const { map, currentDrawingTool, layerCustomFeature } = nextProps;
    if (nextProps.map !== this.props.map) {
      this.init(nextProps); // Once, when map has been initialised
      this.initDraw(nextProps);
    }else if(this.props.layerCustomFeature.geoJSONDrawnFeatures !== layerCustomFeature.geoJSONDrawnFeatures){
      if (layerCustomFeature.geoJSONDrawnFeatures.features.length === 0){
        // Triggered when Reset button is clicked in WidgetDrawFeatures
        this.select.getFeatures().clear();
        this.source.clear();
      }
    } else if (layerCustomFeature.currentSelectedDrawnFeatureProperties !== this.props.layerCustomFeature.currentSelectedDrawnFeatureProperties) {
      // Triggered when text inputs are modified in WidgetDrawFeatures
      let features = this.select.getFeatures();
      if(features.item(0)) {
        features.item(0).setProperties({
          name: layerCustomFeature.currentSelectedDrawnFeatureProperties.name,
          description: layerCustomFeature.currentSelectedDrawnFeatureProperties.description
        })
      }
    }
    else if(currentDrawingTool !== this.props.layerCustomFeature.currentDrawingTool){
      // Reset Draw instance with the right draw tool
      // Triggered when currentDrawingTool Select field has changed in WidgetDrawFeatures
      if (map) {
        this.initDraw(nextProps);
      }
    }
  }

  createDrawnFeaturesLayer(map) {
    // A layer that will store all drawn features
    const layer = new VectorLayer({
      source: this.source,
      title: this.props.layerName,
      style: new Style({
        stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
        fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
      })
    });
    map.getLayers().insertAt(this.props.layerZIndex, layer);
    return layer;
  }

  init (nextProps) {
    // Init stuff that need to be initialized only once
    const { map } = nextProps;
    this.source = new VectorSource();
    this.layer = this.createDrawnFeaturesLayer(map);
    this.select = new Select({
      features: this.source.getFeatures(),
      layers: [this.layer], // This limit current layer to be selectable
      /*condition: function(mapBrowserEvent) {
        return singleClick(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
      },*/
      style: (feature, resolution) => {
        return [
          new Style({
            stroke: new Stroke({color: [0, 153, 255, 1], width: 3}),
            fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
            // DEPRECATED: Name and description, introduces some lag
            /*text: new Text({
              font: '24px Verdana',
              text: `${feature.get('name')}\n${feature.get('description')}`
            })*/
          })
        ];
      }
    });

    // Activate hand cursor when underlying event
    map.on('pointermove', function(e) {
      if (e.dragging) return;
      let hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    map.addInteraction(this.select);
    this.select.on('select', (e) => {
      if (e.selected.length) {
        // If properties.drawn exist it's because feature is part of out layer
        const properties = e.selected[0].getProperties();
        if (properties.drawn) {
          this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(properties);
        } else {
          e.stopPropagation();
          e.selected = [];
        }
      }else {
        // No feature selected mean no properties to be edited in the widget
        this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(null);
      }
    });

    // Create a modify interaction and add it to the map
    this.modify = new Modify({
      features: this.select.getFeatures(),
      insertVertexCondition: (event) => {
        // Only existing edge can now be selected and dragged, otherwise a new point will be created anywhere
        // Note that using freehand (with shift key) will create a lot of points
        return false;
      }
    });
    map.addInteraction(this.modify);

    this.modify.on('modifyend', (evt) => {
      // console.log('modify ended');
    });
  }

  /*
    At the moment, user can blend multiple region types together (polygon, polyline, points)
   */
  initDraw(nextProps) {
    const { map, layerCustomFeature } = nextProps;
    if (this.draw || this.snap) {
      map.removeInteraction(this.draw);
      map.removeInteraction(this.snap);
    }

    if (layerCustomFeature.currentDrawingTool.length){
      var geometryFunction, drawType, condition;
      switch(layerCustomFeature.currentDrawingTool) {
        case VISUALIZE_DRAW_MODES.BBOX.value:
          geometryFunction = createBox();
          drawType = 'Circle';
          condition = shiftKeyOnly;
          break;
        /*case VISUALIZE_DRAW_MODES.CIRCLE.value:
          geometryFunction = null;
          drawType = VISUALIZE_DRAW_MODES.CIRCLE.value;
         condition = shiftKeyOnly;
          break;*/
        case VISUALIZE_DRAW_MODES.HEXAGON.value:
          geometryFunction = createRegularPolygon(5);
          drawType = 'Circle';
          condition = shiftKeyOnly;
          break;
        case VISUALIZE_DRAW_MODES.LINE_STRING.value:
          geometryFunction = null;
          drawType = VISUALIZE_DRAW_MODES.LINE_STRING.value;
          condition = altKeyOnly;
          break;
        case VISUALIZE_DRAW_MODES.SQUARE.value:
          geometryFunction = createRegularPolygon(4);
          drawType = 'Circle';
          condition = shiftKeyOnly;
          break;
        // TODO: Not working as expected, but should be fixed eventually
        /*case VISUALIZE_DRAW_MODES.POINT.value:
         geometryFunction = null;
         drawType = VISUALIZE_DRAW_MODES.POINT.value;
         condition = doubleClick;
         break;*/
        case VISUALIZE_DRAW_MODES.POLYGON.value:
          geometryFunction = null;
          drawType = VISUALIZE_DRAW_MODES.POLYGON.value;
          condition = altKeyOnly;
          break;
        default:
          // None(empty) already managed by if
          throw new Error('Unsupported draw mode selected');
      }

      this.draw = new Draw({
        source: this.source,
        style: new Style({
          stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
          fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
          /*
           // This should overwrites hover circle...
           // But couldn't make it work, so we will keep the default light blue for now
           image: new RegularShape({
           fill: new Fill({
           color: 'red'
           }),
           points: 4,
           radius1: 15,
           radius2: 1
           }),*/
        }),
        condition: condition,
        freehandCondition: altShiftKeysOnly,
        geometryFunction: geometryFunction,
        type: drawType
      });
      map.addInteraction(this.draw);

      // A MUST: Snapping help limiting multiple features overlapping
      // Snap is not a friend of polygonal freehand drawing somehow
      if (layerCustomFeature.currentDrawingTool !== VISUALIZE_DRAW_MODES.POLYGON.value) {
        this.snap = new Snap({source: this.source});
        map.addInteraction(this.snap); // The snap interaction must be added last, as it needs to be the first to handle the pointermove event.
      }

      // Listener on drawend
      this.draw.on('drawend', (e) => {
        let feature = e.feature;
        console.log( 'drawended');
        // Clear features or get a corrupted file and upload won't actually work for now
        feature.setProperties({
          drawn: true, // Flag to make sure feature is part of our layer
          name: `feature_${this.state.drawnCustomFeatures.length + 1}`, // Could be editable by the user
          description: '',  // Could be editable by the user
          type: layerCustomFeature.currentDrawingTool
        });
        // map.removeInteraction(this.draw);
        // map.removeInteraction(this.snap);

        // Only one selected feature at a time
        this.select.getFeatures().clear();
        this.select.getFeatures().push(feature);
        // Not useful anymore, can't edit properties in Customize Regions widget
        this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(feature.getProperties());

        // The action isn't super useful ATM, essentially used to notify when the array becomes empty
        // Objects are way to large to be in Redux without performance impact
        // this.props.layerCustomFeatureActions.setDrawnCustomFeatures(this.state.drawnCustomFeatures.concat([feature]));
        const drawnCustomFeatures = this.state.drawnCustomFeatures.concat([feature]);
        this.setState({
          drawnCustomFeatures: drawnCustomFeatures
        });

        const geoJSONWriter = new GeoJSON();
        const geoJSONString = geoJSONWriter.writeFeatures(drawnCustomFeatures);
        this.props.layerCustomFeatureActions.setGeoJSONDrawnFeatures(JSON.parse(geoJSONString));
        console.log(JSON.parse(geoJSONString))
      });
    }
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    layerCustomFeature: state.layerCustomFeature
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerCustomFeatureActions: bindActionCreators({...layerCustomFeatureActions}, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OLDrawFeatures);
