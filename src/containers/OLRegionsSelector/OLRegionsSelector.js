import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { VISUALIZE_MODE_REGION_SELECTION } from './../../constants';
import myHttp from '../../util/http';
import { actions as regionActions } from './../../redux/modules/Region';
import Map from 'ol/Map';
import View from 'ol/View';
import MousePosition from 'ol/control/MousePosition';
import { defaults as ControlDefaults, ScaleLine, ZoomSlider } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { Fill, Text, Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import { add, createStringXY } from 'ol/coordinate';
import { transform } from 'ol/proj';

const POLYGON_CONFIG = {
  text: 'normal',
  align: 'center',
  baseline: 'middle',
  rotation: 0,
  font: 'inherit',
  weight: 'bold',
  size: '10px',
  offsetX: 0,
  offsetY: 0,
  color: 'blue',
  outline: 'white',
  outlineWidth: 3,
  maxreso: 1200
};

// FIXME
function getMaxPoly (polys) {
  const polyObj = [];
  for (let b = 0; b < polys.length; b++) {
    polyObj.push({ poly: polys[b], area: polys[b].getArea() });
  }
  polyObj.sort(function (a, b) { return a.area - b.area });
  return polyObj[polyObj.length - 1].poly;
}

export class OLRegionsSelector extends React.Component {
  static propTypes = {
    layerIndex: PropTypes.number.isRequired,
    layerName: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired, // FIXME: Type ol/Map
    region: PropTypes.object.isRequired,
    regionActions: PropTypes.object.isRequired,
    visualize: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    // FIXME
    this.createPolygonStyleFunction = this.createPolygonStyleFunction.bind(this);
    this.createTextStyle = this.createTextStyle.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const {map} = nextProps;
    if (map !== this.props.map) {
      this.init(map); // Once, when map has been initialised
    }
  }

  init(map) {
    map.addEventListener('click', this.handleMapClick);
    this.source = new VectorSource({
      format: new GeoJSON()
    });
    this.layer = this.createSelectedRegionLayer(this.layerName);
    map.getLayers().insertAt(this.props.layerIndex, this.layer);
  }

  createSelectedRegionLayer (nameId) {
    let layer = new VectorLayer({
      source: this.source,
      style: this.createPolygonStyleFunction(),
      opacity: 1
    });
    layer.set('nameId', nameId);
    return layer;
  }

  createPolygonStyleFunction () {
    return (feature, resolution) => {
      // first style is the actual filling of the region
      // second is the label with added hack to work around multi polygons having multiple labels
      return [
        new Style({
          stroke: new Stroke({ color: 'rgba(255,255,255,0.5)' }),
          fill: new Fill({ color: 'rgba(0,255,255,0.5)' })
        }),
        new Style({
          text: this.createTextStyle(feature, resolution, POLYGON_CONFIG),
          geometry: feature => {
            if (feature.getGeometry().getType() === 'MultiPolygon') {
              return getMaxPoly(feature.getGeometry().getPolygons()).getInteriorPoint();
            }
            return feature.getGeometry().getInteriorPoint();
          }
        })
      ];
    };
  }

  createTextStyle (feature, resolution, dom) {
    let align = dom.align;
    let baseline = dom.baseline;
    let size = dom.size;
    let offsetX = parseInt(dom.offsetX, 10);
    let offsetY = parseInt(dom.offsetY, 10);
    let weight = dom.weight;
    let rotation = parseFloat(dom.rotation);
    let font = weight + ' ' + size + ' ' + dom.font;
    let fillColor = dom.color;
    let outlineColor = dom.outline;
    let outlineWidth = parseInt(dom.outlineWidth, 10);
    return new Text({
      textAlign: align,
      textBaseline: baseline,
      font: font,
      text: this.getText(feature, resolution, dom),
      fill: new Fill({color: fillColor}),
      stroke: new Stroke({color: outlineColor, width: outlineWidth}),
      offsetX: offsetX,
      offsetY: offsetY,
      rotation: rotation
    });
  }

  getText (feature, resolution, dom) {
    let type = dom.text.value;
    let maxResolution = dom.maxreso.value;
    let text = feature.id_;

    if (resolution > maxResolution) {
      text = '';
    } else if (type === 'hide') {
      text = '';
    } else if (type === 'shorten') {
      text = text.trunc(12);
    } else if (type === 'wrap') {
      text = this.stringDivider(text, 16, '\n');
    }
    return text;
  }

  handleSelectRegionClick (event) {
    let extent = this.calculateClickPositionExtent(event.pixel);
    this.queryGeoserverFeatures(extent);
  }

  handleMapClick (event) {
    // FIXME: INTERFACTION API
    console.log('handling map click:', event);
    if(this.props.visualize.mapManipulationMode === VISUALIZE_MODE_REGION_SELECTION) {
      if (this.props.region.selectedShapefile.title) {
        console.log('selected shapefile:', this.props.region.selectedShapefile);
        return this.handleSelectRegionClick(event);
      }
      console.log('choose a shapefile first');
      return;
    }else {
      // FIXME: NOT MY RESPONSABILITY
      /*if (this.props.visualize.currentDisplayedDataset['dataset_id']) {
        console.log('selected dataset:', this.props.visualize.currentDisplayedDataset);
        return this.getScalarValue(event);
      }
      console.log('choose a dataset first');
      return;*/
    }
  }

  calculateClickPositionExtent(pixel) {
    let coordinates = this.props.map.getCoordinateFromPixel(pixel);
    let tl = add(coordinates, [-10e-6, -10e-6]);
    let br = add(coordinates, [10e-6, 10e-6]);
    let minX;
    let maxX;
    if (tl[0] < br[0]) {
      minX = tl[0];
      maxX = br[0];
    } else {
      minX = br[0];
      maxX = tl[0];
    }
    let minY;
    let maxY;
    if (tl[1] < br[1]) {
      minY = tl[1];
      maxY = br[1];
    } else {
      minY = br[1];
      maxY = tl[1];
    }
    return [minX, minY, maxX, maxY];
  }

  queryGeoserverFeatures = (extent, projection = 'EPSG:3857')  => {
    if(this.props.region.selectedShapefile && this.props.region.selectedShapefile.wmsParams) {
      const url = `${__PAVICS_GEOSERVER_PATH__}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${this.props.region.selectedShapefile.wmsParams.LAYERS}&outputFormat=application/json&srsname=${projection}&bbox=${extent},${projection}`;
      // FIXME: Move call to redux region Duck
      myHttp.get(url)
        .then(
          response => response.json(),
          err => console.log(err))
        .then(
          response => this.selectFeaturesCallback(response),
          err => console.log(err)
        )
    }
  };

  selectFeaturesCallback(response) {
    response.features.forEach((feature) => {
      const id = feature.id;
      if (this.props.region.selectedRegions.indexOf(id) !== -1) {
        // WPS form list to visualize.selectedRegions value
        this.props.regionActions.unselectRegion(id);
        let feature = this.source.getFeatures().find(elem => elem.id_ === id);
        this.source.removeFeature(feature);
      } else {
        this.props.regionActions.selectRegion(id);
        let format = new GeoJSON();
        let features = format.readFeatures(response, {featureProjection: 'EPSG:3857'});
        this.source.addFeatures(features);
      }
    });
  }

  render () {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    region: state.region,
    visualize: state.visualize
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    regionActions: bindActionCreators({...regionActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLRegionsSelector)
