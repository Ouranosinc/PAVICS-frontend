import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { VISUALIZE_DRAW_MODES } from './../../constants';
import Map from 'ol/Map';
import { DragBox, Draw, Modify, Select, Snap } from 'ol/interaction';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { createRegularPolygon, createBox } from 'ol/interaction/Draw';
import { platformModifierKeyOnly, shiftKeyOnly, singleClick, doubleClick } from 'ol/events/condition';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle, Fill, Text, Stroke, Style } from 'ol/style';

const INDEX_BOUNDING_BOX = 101;
const LAYER_BOUNDING_BOX = 'LAYER_BOUNDING_BOX';
const styles = theme => ({
  OLBBoxSelector: {

  }
});


export class OLBBoxSelector extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired,
    map: PropTypes.object,
    layers: PropTypes.array, //deprecated
    queryGeoserverFeatures: PropTypes.func.isRequired,
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
    const { map, visualize } = nextProps;
    if (nextProps.map !== this.props.map) {
      // Map has been initialised
      this.source = new VectorSource({wrapX: false});
      this.layer = this.addBBoxLayer(map);
      this.modify = new Modify({
        source: this.source,
        insertVertexCondition: (event) => {
          if(visualize.currentDrawingTool === VISUALIZE_DRAW_MODES.POLYGON.value) return true;
          // Only existing edge could be selected and dragged
          return false;
        }
      });
      map.addInteraction(this.modify);
      // set listener on "modifyend":
      this.modify.on('modifyend', (evt)=> {
        console.log('modify ended');
        this.props.visualizeActions.setDrawnCustomFeatures(this.source.getFeatures());
      });
    }else if(nextProps.visualize.drawnCustomFeatures !== this.props.visualize.drawnCustomFeatures){
      if (nextProps.visualize.drawnCustomFeatures.length === 0){
        // TODO CLEAN FEATURES
        let yolo = "";
        // this.layer.getFeatures().clear();
      }
    }
    else if(nextProps !== this.props){
      if (map) {
        // this.initBBoxRegionSelector(nextProps);
        this.initBBoxSelector(nextProps); // initBBoxSelectorPrototype
      }
    }
  }

  addBBoxLayer(map) {
    // Or FeatureOverlay, see http://blog.awesomemap.tools/demo-draw-and-modify-openlayers-3/
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

  initBBoxSelector(nextProps) {
    const { map, visualize } = nextProps;
    if (this.draw || this.snap) {
      map.removeInteraction(this.draw);
      map.removeInteraction(this.snap);
    }

    if (visualize.currentDrawingTool.length){
      var geometryFunction, drawType, condition;
      switch(visualize.currentDrawingTool) {
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
        // Not working as expected
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
        condition: condition,
        geometryFunction: geometryFunction,
        type: drawType
      });
      map.addInteraction(this.draw);

      // Listener on drawend
      this.draw.on('drawend', (e) => {
        console.log('draw ended');
        const feature = e.feature;
        this.props.visualizeActions.setDrawnCustomFeatures(this.props.visualize.drawnCustomFeatures.concat([feature]));
      });

      // A MUST: Snapping help limiting multiple features overlapping
      // Snap is not a friend of polygonal freehand drawing somehow
      if (visualize.currentDrawingTool !== VISUALIZE_DRAW_MODES.POLYGON.value) {
        this.snap = new Snap({source: this.source});
        map.addInteraction(this.snap); // The snap interaction must be added last, as it needs to be the first to handle the pointermove event.
      }
    }
  }

  initBBoxSelectorPrototype(nextProps) {
    const { map } = nextProps;
    // Might interfere with region selection !!
    const source = new VectorSource({wrapX: false});
    this.addBBoxLayer(map, source); // in this.layer
    let drawInteraction = new Draw({
      source: this.source,
      style: new Style({
        // this overwrites hover circle
        stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
        fill: new Fill({ color: 'rgba(255,255,255,0.3)' })
      }),
      type: 'Circle',
      condition: shiftKeyOnly,
      geometryFunction: createRegularPolygon(4)
    });

    map.addInteraction(drawInteraction);

    drawInteraction.on('drawend', (e) => {
      let feature = e.feature;
      console.log('vector feature %o', feature);

      // remove draw interaction:
      map.removeInteraction(drawInteraction);

      // Create a select interaction and add it to the map:
      let selectInteraction = new Select(); // FIXME: Select only the defined edges
      map.addInteraction(selectInteraction);

      // select feature:
      selectInteraction.getFeatures().push(feature);

      // clone feature:
      let featureClone = feature.clone();
      // transform cloned feature to WGS84:
      featureClone.getGeometry().transform('EPSG:3857', 'EPSG:4326');
      featureClone.getGeometry().on('change', function(e) { // https://github.com/openlayers/openlayers/issues/5095
        if (e.target.getRevision() % 2) return;
        var coordinates = e.target.getCoordinates();
        // do something with the coordinates
        e.target.setCoordinates(coordinates);
        featureClone.changed()
      });
      // get GeoJSON of feature:
      let geojson = new GeoJSON().writeFeature(featureClone);
      // save or do whatever...
      console.log(geojson);

      // Create a modify interaction and add to the map:
      let modifyInteraction = new Modify({
        features: selectInteraction.getFeatures(),
        wrapX: false,
        /*deleteCondition: (event) => {
          // alt-click normally deletes point
          return false;
        },*/
        insertVertexCondition: (event) => {
          // Only existing edge could be selected and dragged
          return false;
        }
      });

      console.log('modify features %o', selectInteraction.getFeatures());
      map.addInteraction(modifyInteraction);

      // set listener on "modifyend":
      modifyInteraction.on('modifyend', function(evt) {
        // get features:
        var collection = evt.features;

        console.log('new features %o', evt.features);
        // There's only one feature, so get the first and only one:
        var featureClone = collection.item(0).clone();
        // transform cloned feature to WGS84:
        featureClone.getGeometry().transform('EPSG:3857', 'EPSG:4326');
        // get GeoJSON of feature:
        var geojson = new GeoJSON().writeFeature(featureClone);
        // save or do whatever...
        console.log(geojson);
      });
    });
  }

  initBBoxRegionSelector (nextProps) {
    const { map } = nextProps;
    // a DragBox interaction used to select features by drawing boxes
    let dragBox = new DragBox({
      condition: platformModifierKeyOnly,
      style: new Style({
        stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
        fill: new Fill({ color: 'rgba(255,255,255,0.3)' })
      })
    });
    map.addInteraction(dragBox);
    dragBox.on('boxend', () => this.onDragBoxEnd(dragBox));
    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', () => {}/*selectedFeatures.clear()*/);
  }

  onDragBoxEnd(dragBox) {
    let extent = dragBox.getGeometry().getExtent();
    this.props.queryGeoserverFeatures(extent);
  };


  render () {
    return null;
  }
}

OLBBoxSelector['contextTypes'] = {
  map: PropTypes.instanceOf(Map)
};

export default OLBBoxSelector;
