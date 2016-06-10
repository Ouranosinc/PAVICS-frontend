import React from 'react'
//import classes from './CesiumComponent.scss'
import ol from 'openlayers';
import $ from 'jquery';

require("openlayers/css/ol.css");
require("./OLComponent.css");

var me; //Do never trust this in javascript.

class OLComponent extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this.map = null;
    this.layers = [];
    this.BackgroundLayer = null;
    this.WMSLayer = null;
    this.WCSLayer = null;
    this.WFSLayer = null;
    this.vectorSource = null;
    this.popup = null;

    me = this;
  }

  setBackgroundLayer(){
    this.BackgroundLayer = new ol.layer.Tile({
      //source: new ol.source.OSM()
      source: new ol.source.MapQuest({layer: 'sat'})
    });
  }

  setWMSLayer(){
    this.WMSLayer = new ol.layer.Tile({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.TileWMS({
        url: 'http://demo.boundlessgeo.com/geoserver/wms',
        params: {'LAYERS': 'topp:states', 'TILED': true},
        serverType: 'geoserver'
      })
    });
  }

  setWCSLayer(){
    //http://gis.stackexchange.com/questions/166868/does-openlayers-3-support-wcs
    this.WCSLayer = new ol.layer.Image({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.ImageWMS({
        url: 'http://demo.boundlessgeo.com/geoserver/wms',
        params: {'LAYERS': 'topp:states'},
        serverType: 'geoserver'
      })
    });
  }

  setWFSVector(){
    this.vectorSource = new ol.source.Vector({
      loader: function(extent, resolution, projection) {
        var url = 'http://demo.boundlessgeo.com/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
          'outputFormat=text/javascript&format_options=callback:loadFeatures' +
          '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
        $.ajax({
          url: url,
          dataType: 'jsonp',
          jsonp: false});
      },
      strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        maxZoom: 19
      }))
    });
    this.WFSLayer = new ol.layer.Vector({
      source: this.vectorSource,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 255, 1.0)',
          width: 2
        })
      })
    });
  }

  initMap(){
    /**
     * JSONP WFS callback function.
     * @param {Object} response The response object.
     */
    window.loadFeatures = function(response) {
      me.vectorSource.addFeatures(new ol.format.GeoJSON().readFeatures(response));
    };

    this.setBackgroundLayer();
    this.setWMSLayer();
    this.setWCSLayer();
    this.setWFSVector();

    this.layers = [
      this.BackgroundLayer,
      this.WMSLayer,
      this.WFSLayer
    ];
    this.map = new ol.Map({
      layers: this.layers,
      target: 'map',
      view: new ol.View({
        center: [-10997148, 4569099],
        zoom: 4
      }),
      controls: ol.control.defaults().extend([
        new ol.control.ZoomSlider(),
        new ol.control.Rotate(),
        new ol.control.OverviewMap(),
        new ol.control.ScaleLine(),
        new ol.control.FullScreen(),
        new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.createStringXY(4),
          projection: 'EPSG:4326'
        })
      ]),
      interactions: ol.interaction.defaults().extend([
        new ol.interaction.DragRotateAndZoom(),
        new ol.interaction.Select({
          condition: ol.events.condition.mouseMove
        })
      ])
    });

    this.map.on('pointermove', function (e) {
      var data = {
        pixel: me.map.getEventPixel(e.originalEvent),
        last: e.map.last_tile_overlay
      };
      console.log('pointermove event');
    });

    this.map.on('moveend', function (e) {
      var data = {
        center: me.map.getView().getCenter(),
        resolution: me.map.getView().getResolution()
      };
      console.log('moveend event');
      //me.initMap();
    });

    var popupElement = document.getElementById('popup');
    this.popup = new ol.Overlay({
      element: popupElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.map.addOverlay(this.popup);
  }

  componentDidMount(){
    this.initMap();
  }


  render () {
    return(
      <div className="row">
        <div className="col-md-2 col-lg-2">
          <div className="panel panel-default">
            <div className="panel-body">
              ...
            </div>
          </div>
        </div>
        <div className="col-md-10 col-lg-10">
          <div className="panel panel-default">
            <div className="panel-body">
              <div id="map" className="map">
                <div id="popup" className="ol-popup"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OLComponent
