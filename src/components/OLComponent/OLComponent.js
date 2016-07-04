import React from 'react'
//import classes from './CesiumComponent.scss'
import ol from 'openlayers';
import WMS from './'
import $ from 'jquery';

require("openlayers/css/ol.css");
require("./OLComponent.css");

var me; //Do never trust this in javascript.

class OLComponent extends React.Component {
  static propTypes = {
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object
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
    //http://132.217.140.31:8080/ncWMS2/wms?
    // FORMAT=image%2Fpng&
    // TRANSPARENT=TRUE&
    // STYLES=default-scalar%2Fdefault&
    // LAYERS=pavics_dummy_file_simplest%2Fpr&
    // TIME=1961-12-06T00%253A00%253A00.000Z&
    // COLORSCALERANGE=0%2C1&
    // NUMCOLORBANDS=250&
    // ABOVEMAXCOLOR=0x000000&
    // BELOWMINCOLOR=0x000000&
    // BGCOLOR=transparent&
    // LOGSCALE=false&
    // SERVICE=WMS&
    // VERSION=1.1.1&
    // REQUEST=GetMap&
    // SRS=EPSG%3A4326&
    // BBOX=-78.88,45.68,-77.6,46.96&
    // WIDTH=256&
    // HEIGHT=256

    /*this.WMSLayer = new ol.layer.Tile({
      extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.TileWMS({
        url: 'http://132.217.140.31:8080/ncWMS2/wms',
        params: {
          //'FORMAT': 'image/png',
          'TRANSPARENT': 'TRUE',
          //'STYLES': 'default-scalar/default',
          'LAYERS' : 'pavics_dummy_file_simplest/pr',
          //'COLORSCALERANGE' : '0,1',
          //'NUMCOLORBANDS' : '250',
          //'ABOVEMAXCOLOR' : '0x000000',
          //'BELOWMINCOLOR' : '0x000000',
          'BGCOLOR' : 'transparent',
          //'LOGSCALE' : 'false',
          //'SERVICE' : 'WMS',
          //'VERSION' : '1.1.1',
          //'REQUEST' : 'GetMap',
          'SRS' : 'PSG:4326'//,
          //'BBOX' : '-78.88,45.68,-77.6,46.96',
          //'WIDTH': '256',
          //'HEIGHT': '256'
        }
      })
    });*/

    /*if(this.props.dataset){
      this.WMSLayer = new ol.layer.Tile({
        extent: [-13884991, 2870341, -7455066, 6338219],
        visible: true,
        source: new ol.source.TileWMS({
          url: 'http://132.217.140.31:8080/ncWMS2/wms',
          params: {
            'TRANSPARENT': 'TRUE',
            'LAYERS' : 'pavics_dummy_file_simplest/pr',
            'BGCOLOR' : 'transparent',
            'SRS' : 'PSG:4326'

          }
        })
      });
    }else{*/
      //Default
      this.WMSLayer = new ol.layer.Tile({
        //extent: [-91.00001018206,87.99997963588,-46.50001527309,132.49997454485],
        //extent: [-13884991, 2870341, -7455066, 6338219],
        visible: false,
        source: new ol.source.TileWMS({
          url: 'http://demo.boundlessgeo.com/geoserver/wms',
          params: {'LAYERS': 'topp:states', 'TILED': true},
          serverType: 'geoserver'
        })
      });
    /*}*/
  }

  setWCSLayer(){
    //http://gis.stackexchange.com/questions/166868/does-openlayers-3-support-wcs
    this.WCSLayer = new ol.layer.Image({
      //extent: [-13884991, 2870341, -7455066, 6338219],
      source: new ol.source.ImageWMS({
        url: 'http://demo.boundlessgeo.com/geoserver/wms',
        params: {'LAYERS': 'topp:states'},
        serverType: 'geoserver'
      })
    });
  }

  setWFSVector(){
    /*this.vectorSource = new ol.source.Vector({
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
    });*/
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
      this.WMSLayer
    ];
    this.map = new ol.Map({
      layers: this.layers,
      target: 'map',
      view: new ol.View({
        center: [-10997148, 9569099],
        zoom: 4
        /*center: [-10997148, 4569099],
        zoom: 4*/
      }),
      controls: ol.control.defaults().extend([
        /*new ol.control.ZoomSlider(),*/
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

  componentWillUnmount(){
    //TODO: Verify if usefull
    //this.map.setTarget(null);
    //this.map = null;
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.dataset && this.props.capabilities){
      var wmsUrl = this.props.capabilities.value["WMS_Capabilities"]["Service"][0]["OnlineResource"][0]["$"]["xlink:href"];
      this.WMSLayer.setSource(new ol.source.TileWMS({
        url: wmsUrl,
        params: {
          'TRANSPARENT': 'TRUE',
          'LAYERS' : this.props.dataset["Name"][0],
          'BGCOLOR' : 'transparent',
          'SRS' : 'PSG:4326'
        }
      }));
      this.WMSLayer.set("visible", true);
    }else{
      this.WMSLayer.set("visible", false);
    }
  }

  render () {
    return(
      <div id="map" className="map">
        <div id="popup" className="ol-popup"></div>
      </div>
    )
  }
}

export default OLComponent
