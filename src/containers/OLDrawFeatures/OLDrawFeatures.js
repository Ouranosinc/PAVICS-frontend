import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { VISUALIZE_DRAW_MODES } from './../../constants';
import { Draw, Modify, Select, Snap } from 'ol/interaction';
import Map from 'ol/Map';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { createRegularPolygon, createBox } from 'ol/interaction/Draw';
import { platformModifierKeyOnly, altKeyOnly, shiftKeyOnly, singleClick, doubleClick } from 'ol/events/condition';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle, Fill, Text, Stroke, Style, RegularShape } from 'ol/style';
import { actions as layerCustomFeatureActions } from '../../redux/modules/LayerCustomFeature';

const INDEX_BOUNDING_BOX = 101;
const LAYER_BOUNDING_BOX = 'LAYER_BOUNDING_BOX';

// Interesting try/catch to avoid main thread error (on Polygon/LineString drawing with Select/Modify interactions)
// https://github.com/openlayers/openlayers/issues/6310
import RBush from 'ol/structs/RBush';
const RBushUpdateOrig = RBush.prototype.update;
RBush.prototype.update = function () {
  try {
    RBushUpdateOrig.apply(this, arguments);
  } catch (e) {
    // console.warn('RBushUpdateOrig', e);
  }
};

const styles = theme => ({
  OLDrawFeatures: {

  }
});

class OLDrawFeatures extends React.Component {
  static propTypes = {
    layerCustomFeature: PropTypes.object.isRequired,
    layerCustomFeatureActions: PropTypes.object.isRequired,
    map: PropTypes.instanceOf(Map)
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
    }else if(layerCustomFeature.drawnCustomFeatures !== this.props.layerCustomFeature.drawnCustomFeatures){
      if (layerCustomFeature.drawnCustomFeatures.length === 0){
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
      style: new Style({
        stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
        fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
      })
    });
    map.getLayers().insertAt(INDEX_BOUNDING_BOX, layer);
    return layer;
  }

  init (nextProps) {
    // Init stuff that need to be initialized only once
    const { map } = nextProps;
    this.source = new VectorSource();
    this.layer = this.createDrawnFeaturesLayer(map);
    this.select = new Select({
      features: this.source.getFeatures(), // Prevent public regions from being selected and edited
      condition: function(mapBrowserEvent) {
        // Alt + clikc is now required to select a region
        return singleClick(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
      },
      style: (feature, resolution) => {
        return [
          new Style({
            stroke: new Stroke({color: [0, 153, 255, 1], width: 3}),
            fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
            text: new Text({
              font: '24px Verdana',
              text: `${feature.get('name')}\n${feature.get('description')}`
            })
          })
        ];
      }
    });

    // Activate hand cursor when underlying event
    // FIXME: Interfer with public regions layer selections
    map.on('pointermove', function(e) {
      if (e.dragging) return;
      let hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
      map.getViewport().style.cursor = hit ? 'pointer' : '';
    });

    map.addInteraction(this.select);
    this.select.on('select', (e) => {
      //TODO: Valide current layer is the good one
      if (e.selected.length) {
        // If name and description haven't been set it's because feature is being drawn at the moment.
        // So if feature is being drawn, ignore selection
        const properties = e.selected[0].getProperties();
        if(properties.name && properties.name.length) {
          this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(properties);
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
        case VISUALIZE_DRAW_MODES.CIRCLE.value:
          geometryFunction = null;
          drawType = VISUALIZE_DRAW_MODES.CIRCLE.value;
          condition = shiftKeyOnly;
          break;
        case VISUALIZE_DRAW_MODES.HEXAGON.value:
          geometryFunction = createRegularPolygon(5);
          drawType = 'Circle';
          condition = shiftKeyOnly;
          break;
        case VISUALIZE_DRAW_MODES.LINE_STRING.value:
          geometryFunction = null;
          drawType = VISUALIZE_DRAW_MODES.LINE_STRING.value;
          break;
        case VISUALIZE_DRAW_MODES.SQUARE.value:
          geometryFunction = createRegularPolygon(4);
          drawType = 'Circle';
          condition = shiftKeyOnly;
          break;
        // FIXME: Not working as expected, but should be fixed eventually
        /*case VISUALIZE_DRAW_MODES.POINT.value:
         geometryFunction = null;
         drawType = VISUALIZE_DRAW_MODES.POINT.value;
         condition = doubleClick;
         break;*/
        case VISUALIZE_DRAW_MODES.POLYGON.value:
          geometryFunction = null;
          drawType = VISUALIZE_DRAW_MODES.POLYGON.value;
          // condition = platformModifierKeyOnly;
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
        feature.setProperties({
          name: `feature_${layerCustomFeature.drawnCustomFeatures.length + 1}`,
          description: '',
          type: layerCustomFeature.currentDrawingTool
        });
        map.removeInteraction(this.draw);
        map.removeInteraction(this.snap);

        // Only one selected feature at a time
        this.select.getFeatures().clear();
        this.select.getFeatures().push(feature);
        this.props.layerCustomFeatureActions.setCurrentSelectedDrawnFeature(feature.getProperties());

        // The action isn't super useful ATM, essentially used to notify when the array becomes empty
        this.props.layerCustomFeatureActions.setDrawnCustomFeatures(layerCustomFeature.drawnCustomFeatures.concat([feature]));
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
