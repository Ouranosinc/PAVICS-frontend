import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import myHttp from '../../util/http';
import { actions as layerRegionActions } from '../../redux/modules/LayerRegion';
import OLRegionsClickSelector from './../OLRegionsClickSelector';
import OLRegionsBBoxSelector from './../OLRegionsBBoxSelector';
import Map from 'ol/Map';
import { GeoJSON } from 'ol/format';
import { Fill, Text, Stroke, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

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

export class OLRegionsSelector extends React.Component {
  static propTypes = {
    layerIndex: PropTypes.number.isRequired,
    layerName: PropTypes.string.isRequired,
    map: PropTypes.instanceOf(Map),
    layerRegion: PropTypes.object.isRequired,
    layerRegionActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    const {map} = nextProps;
    if (map !== this.props.map) {
      this.init(map); // Once, when map has been initialised
    }
    if (nextProps.layerRegion.selectedShapefile !== this.props.layerRegion.selectedShapefile) {
      this.source.clear();
    }
  }

  init(map) {
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

  createPolygonStyleFunction = () => {
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
              const polygons = feature.getGeometry().getPolygons();
              const polyObj = [];
              for (let b = 0; b < polygons.length; b++) {
                polyObj.push({ poly: polygons[b], area: polygons[b].getArea() });
              }
              polyObj.sort(function (a, b) { return a.area - b.area });
              return polyObj[polyObj.length - 1].poly.getInteriorPoint();
            }
            return feature.getGeometry().getInteriorPoint();
          }
        })
      ];
    };
  };

  createTextStyle = (feature, resolution, dom) => {
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
  };

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

  queryGeoserverFeatures = (extent, projection = 'EPSG:3857')  => {
    if(this.props.layerRegion.selectedShapefile && this.props.layerRegion.selectedShapefile.wmsParams) {
      const url = `${__PAVICS_GEOSERVER_PATH__}/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=${this.props.layerRegion.selectedShapefile.wmsParams.LAYERS}&outputFormat=application/json&srsname=${projection}&bbox=${extent},${projection}`;
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
      if (this.props.layerRegion.selectedRegions.indexOf(id) !== -1) {
        // WPS form list to visualize.selectedRegions value
        this.props.layerRegionActions.unselectRegion(id);
        let feature = this.source.getFeatures().find(elem => elem.id_ === id);
        this.source.removeFeature(feature);
      } else {
        this.props.layerRegionActions.selectRegion(id);
        let format = new GeoJSON();
        let features = format.readFeatures(response, {featureProjection: 'EPSG:3857'});
        this.source.addFeatures(features);
      }
    });
  }

  render () {
    return (
      <React.Fragment>
        <OLRegionsClickSelector map={this.props.map} queryGeoserverFeatures={this.queryGeoserverFeatures}/>
        <OLRegionsBBoxSelector map={this.props.map} queryGeoserverFeatures={this.queryGeoserverFeatures} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layerRegion: state.layerRegion,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    layerRegionActions: bindActionCreators({...layerRegionActions}, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OLRegionsSelector)
