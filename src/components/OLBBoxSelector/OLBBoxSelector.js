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
import { Circle, Fill, Text, Stroke, Style, RegularShape } from 'ol/style';

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
      this.source = new VectorSource();
      this.layer = this.addBBoxLayer(map);
      this.select = new Select({
        style: (feature, resolution) => {
          return [
            new Style({
              /*image: new Circle({
                fill: new Fill({ color: '#FF0000' }),
                stroke: new Stroke({ color: '#000000' }),
                radius: 5
              }),*/
              stroke: new Stroke({color: [0, 153, 255, 1], width: 3}),
              // stroke: new Stroke({ color: 'rgba(245,0,87,0.8)' }),
              fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
              // fill: new Fill({ color: 'rgba(245,0,87,0.5)' }),
              text: new Text({
                font: '24px Verdana',
                text: `${feature.get('name')}\n${feature.get('description')}`
              })
            }),
            new Style()];
        }
      });
      // Activate hand cursor when underlying event
      map.on('pointermove', function(e) {
        if (e.dragging) return;
        let hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
        map.getViewport().style.cursor = hit ? 'pointer' : '';
      });

      map.addInteraction(this.select);
      this.select.on('select', (evt) => {
        if (evt.selected.length) {
          console.log(evt.selected[0]);
          this.props.visualizeActions.setCurrentSelectedDrawnFeature(evt.selected[0]);
        }
      });

      // Create a modify interaction and add it to the map:
      this.modify = new Modify({
        features: this.select.getFeatures(),
        insertVertexCondition: (event) => {
          // Only existing edge could be selected and dragged
          return false;
        }
      });
      map.addInteraction(this.modify);

      // set listener on "modifyend":
      this.modify.on('modifyend', (evt) => {
        console.log('modify ended');
      });
    }else if(nextProps.visualize.drawnCustomFeatures !== this.props.visualize.drawnCustomFeatures){
      if (nextProps.visualize.drawnCustomFeatures.length === 0){
        // Clear all drawn features
        // TODO: Open Confirmation Modal if more than one
        this.select.getFeatures().clear();
        this.source.clear();
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
        /*image: new Circle({
          fill: new Fill({ color: '#0000FF' }),
          stroke: new Stroke({ color: '#000000' }),
          radius: 5
        }),*/
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
        style: new Style({
          // this overwrites hover circle
          stroke: new Stroke({ color: 'rgba(255,255,255,0.7)' }),
          fill: new Fill({ color: 'rgba(255,255,255,0.3)' }),
          /*image: new RegularShape({
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
      if (visualize.currentDrawingTool !== VISUALIZE_DRAW_MODES.POLYGON.value) {
        this.snap = new Snap({source: this.source});
        map.addInteraction(this.snap); // The snap interaction must be added last, as it needs to be the first to handle the pointermove event.
      }

      // Listener on drawend
      this.draw.on('drawend', (e) => {
        console.log('draw ended');
        const feature = e.feature;
        feature.name = 'yolo123';
        feature.setProperties({'name':'yoloXYZ', 'description':'xyz'});
        map.removeInteraction(this.draw);
        map.removeInteraction(this.snap);

        // Only one selected feature at a time
        this.select.getFeatures().clear();
        this.select.getFeatures().push(feature);
        this.props.visualizeActions.setDrawnCustomFeatures(this.props.visualize.drawnCustomFeatures.concat([feature]));
      });
    }
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
