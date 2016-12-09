import React from 'react';
import ol from 'openlayers';
import classes from './Map.scss';
let makeWMSlayer = (title, url, time, styles, layerName) => {
  return new ol.layer.Tile({
    visible: true,
    opacity: 0.7,
    title: title,
    source: new ol.source.TileWMS({
      url: url,
      params: {
        TIME: time,
        FORMAT: 'image/png',
        TILED: true,
        STYLES: styles,
        LAYERS: layerName,
        TRANSPARENT: 'TRUE',
        VERSION: '1.3.0',
        EPSG: '4326',
        COLORSCALERANGE: '0.0000004000,0.00006000',
        NUMCOLORBANDS: '10',
        LOGSCALE: false,
        crossOrigin: 'anonymous'
      }
    })
  });
};
class Map extends React.Component {
  constructor (props) {
    super(props);
    this.map = null;
  }

  initMap = () => {
    let url = 'http://outarde.crim.ca:8083/thredds/wms/birdhouse/flyingpigeon/' +
      'ncout-d149d317-b67f-11e6-acaf-fa163ee00329.nc?service=WMS&version=1.3.0&request=GetCapabilities';
    let layer = makeWMSlayer('my title', url, '2005-12-07T12:00:00.000Z', 'boxfill/occam', 'pr');
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        layer
      ],
      view: new ol.View({
        center: [949282, 6002552],
        zoom: 4
      })
    });
  };

  componentDidMount () {
    this.initMap();
  }

  render () {
    return (
      <div className={classes.Map}>
        <div className={classes.MapContainer} id="map"></div>
      </div>
    );
  }
}
export default Map;
