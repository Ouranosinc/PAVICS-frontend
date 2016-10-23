/**
 * Created by beaulima on 16-10-20.
 */


import React from 'react'

import classes from './MapViewPanel.scss'
import ol from 'openlayers';
window.ol = ol; //_ol3-layerswitcher.js needs ol as global (...)
require('ol3-layerswitcher/src/ol3-layerswitcher.js');
require("openlayers/css/ol.css");
require("ol3-layerswitcher/src/ol3-layerswitcher.css");
//Couldn't figure out the bug when importing inner component css file but it works from node_modules

var MapViewToolbar = require('../MapViewToolbar/MapViewToolbar');

var g_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';

var me;

class MapViewerPanel extends React.Component {
  static propTypes = {
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.layersCount = 0;
    this.map = null;
    this.baseLayers = new ol.layer.Group({'title': 'Base maps', 'opacity':1.0, 'visible':true,'zIndex':0});
    this.overlayLayers = new ol.layer.Group({'title': 'Overlays','opacity':1.0, 'visible':true,'zIndex':1});
    this.view = null;
    this.tmpLayer=null;
    this.dragBox = null;
    this.select= null;
    this.selectedFeatures= null;
    this.watersheds_layers_name = [];
    this.bukowskis_layer_name = [];
    me=this;
  }

  // Returns base layers list
  getMapBaseLayersList() {
    if (me.baseLayers != null) {
      return me.baseLayers.getLayers()
    }
    return []
  }

  // Returns overlay layers list
  getMapOverlayList() {
    if (me.overlayLayers != null) {
      return me.overlayLayers.getLayers()
    }
    return []
  }

  getNumberOverlays(){
    return me.overlayLayers.getLayers().getLength()
  }

  // Add backgrounnd layer (use once)
  initBackgroundLayer() {
    var yolo = this.getMapBaseLayersList();
    this.addBingLayer('Aerial', this.getMapBaseLayersList(),'Aerial')
    //var wmsUrl = "http://demo.boundlessgeo.com/geoserver/wms";
    //var wmsParams = {'LAYERS': 'topp:states', 'TILED': true};
    //this.addTileWMSLayer('topp:states', this.getMapOverlayList(), wmsUrl, wmsParams);
  }

  removeLayer(layers, title){
    var layer;

    for(layer in layers)
      if(title===layer.get('title')) {
        console.log('addTileWMSLayer: First Remove layer ' + layer.get('title'));
        this.map.removeLayer(layer)
      }
  }

  /*! \brief Adds a layer to a layers list
   @param layers layers input list
   @param wmsUrl wms url
   @param wmsParams parameters associated to the wms
   @param extent region extent to load
   @param serverType Server's type
   */
  addTileWMSLayer(title,
                  layers,
                  wmsUrl,
                  wmsParams,
                  extent,
                  serverType,
                  visible=true) {

    var layer = this.getTileWMSLayer(title,
      wmsUrl,
      wmsParams,
      extent,
      serverType,
      visible)
    layers.push(layer)
    console.log('addTileWMSLayer: Add layer ' + layer.get('title'));
    return layer;
  }

  /*! \brief Returns a ol3 layer to a layers list
   @param layers layers input list
   @param wmsUrl wms url
   @param wmsParams parameters associated to the wms
   @param extent region extent to load
   @param serverType Server's type
   */
  getTileWMSLayer(title,
                  wmsUrl,
                  wmsParams,
                  extent,
                  serverType="",
                  visible=true){

    if (extent == undefined) {
      return new ol.layer.Tile(
        {
          visible:visible,
          title: title,
          opacity: 0.4, //TODO: Set opacity dynamically
          source: new ol.source.TileWMS(
            {
              url: wmsUrl,
              params: wmsParams,
              serverType: serverType
            })
        });
    }
    else {
      return new ol.layer.Tile(
        {
          title: title,
          extent: extent,
          source: new ol.source.TileWMS(
            {
              url: wmsUrl,
              params: wmsParams,
              serverType: serverType
            })
        });
    }
  }

  addBingLayer(title, layers, bingStyle){
    layers.push(new ol.layer.Tile({
      visible: true,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: g_BING_API_KEY,
        imagerySet: bingStyle
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        // maxZoom: 19
      })
    }));
  }

  loadFromWmsGeoserver(layerId, visible, opacity, workspace){

    var tiled = new ol.layer.Tile({
      visible: visible,
      opacity:opacity,
      source: new ol.source.TileWMS({
        url: 'http://132.217.140.48:8080/geoserver/'+workspace+'/wms',
        params: {'FORMAT': 'image/png',
          tiled: true,
          STYLES: '',
          LAYERS: layerId
        }
      })
    });
    var layers = me.getMapOverlayList();
    layers.push(tiled);
  }

  loadLayers(layers_name, workspace, visible, opacity){
    console.log(layers_name.length);
    for(let k =0; k<layers_name.length; k++) {
      console.log(layers_name[k]);
      me.loadFromWmsGeoserver(layers_name[k], visible, opacity, workspace);
    }
  }

  initMap() {


    me.view = new ol.View({
      center: [-10997148, 8569099],
      zoom: 4
    })

    var map = new ol.Map({
      layers: [this.baseLayers, this.overlayLayers],
      target: 'map',
      renderer: 'canvas',
      view: this.view
    });

    /*var layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Legend' // Optional label for button
    });
    map.addControl(layerSwitcher);*/

    me.map = map;

    map.getView().on('propertychange', function(e) {
      switch (e.key) {
        case 'resolution':
          console.log(e.oldValue);
          break;
      }
    });

    me.map.on('singleclick', function(evt) {
      //document.getElementById('nodelist').innerHTML = "Loading... please wait...";
      var view = me.map.getView();
      var viewResolution = view.getResolution();

      var layers = me.getMapOverlayList();
      console.log(viewResolution);
      for(let k=0; k<layers.length; k++){
        var source = layers[k].get('visible') ? layers[k].getSource() : null;

        if(source != null)
        {
          var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});

          if (url) {
            console.log(url);
          }
        }
      }


    });

  }

  /** Returns view resolution */
  getCurrentResolution() {
    if (this.view != null) {
      return this.view.getResolution()
    }
    return -1;
  }

  /** Sets view resolution */
  setCurrentResolution(resolution) {
    if (this.view != null) {
      this.view.setResolution(resolution)
    }
  }

  /** Returns current view center */
  getCurrentCenter() {
    if (this.view != null) {
      return this.view.getCenter()
    }
    return [];
  }

  /** Sets current view center */
  setCurrentCenter(center) {
    if (this.view != null) {
      this.view.setCenter(center)
    }
    return [];
  }

  /** Returns current projection */
  getCurrentProjection() {
    if (this.view != null) {
      return this.view.getProjection()
    }
    return "";
  }

  /** Sets current projection */
  setCurrentProjection(epsg_string) {
    if (this.view != null) {
      this.view.setProjection(epsg_string)
    }
  }

  componentDidMount(){

    var parser = new ol.format.WMSCapabilities();
    fetch('http://132.217.140.48:8080/geoserver/wms?request=getCapabilities').then(function(response) {
      return response.text();
    }).then(function(text) {
      var result = parser.read(text);
      //console.log(JSON.stringify(result, null, 2));

      var layers = result.Capability.Layer.Layer;
      for (var i = 0, len = layers.length; i < len; i++) {

        var layerobj = layers[i];

        if(layerobj.Name.indexOf("WATERSHEDS:BV_N1_S")!==-1) {
          console.log(layerobj.Name);
          me.watersheds_layers_name.push(layerobj.Name);
        }



       /* if(layerobj.Name.indexOf("BUKOWSKI")!==-1) {
          console.log(layerobj.Name);
          me.bukowskis_layer_name.push(layerobj.Name);
        }*/
      }
      //me.loadLayers(me.bukowskis_layer_name,"BUKOWSKI",true, 0.5);
      console.log(me.watersheds_layers_name.length);
      me.loadLayers(me.watersheds_layers_name,"WATERSHEDS",true, 0.5);
    });

    this.initBackgroundLayer()
    this.initMap();
  }

  componentWillUnmount(){
    //TODO: Verify if usefull
    //this.map.setTarget(null);
    //this.map = null;
  }

  componentDidUpdate(prevProps, prevState){

  }

  handleToolbarClick(event) {
    var v = event
    console.log("MapViewerPanel::handleToolbarClick : " + v.buttonClick.id);
    switch(v.buttonClick.id){
      case 'zoom-in-id':
        me.setCurrentResolution(me.getCurrentResolution()*0.9);
        break;
      case 'zoom-out-id':
        me.setCurrentResolution(me.getCurrentResolution()*1.1);
        break;
      case 'zoom-selection-id':
        // a DragBox interaction used to select features by drawing boxes
        me.dragBox = new ol.interaction.DragBox({
          condition: ol.events.condition.platformModifierKeyOnly
        });
        me.map.addInteraction(me.dragBox);
        me.dragBox.on('boxend', function() {
          console.log(me.dragBox.getGeometry().getExtent());
          me.map.getView().fit(me.dragBox.getGeometry().getExtent(),me.map.getSize());

          });
        break;
      case 'select-id':
        me.select = new ol.interaction.Select();
        me.map.addInteraction(me.select);
        me.selectedFeatures = me.select.getFeatures();
        // a DragBox interaction used to select features by drawing boxes
        me.dragBox = new ol.interaction.DragBox({
          condition: ol.events.condition.platformModifierKeyOnly
        });
        me.map.addInteraction(me.dragBox);
        me.dragBox.on('boxend', function() {
          console.log(me.dragBox.getGeometry().getExtent());

          var extent = me.dragBox.getGeometry().getExtent();
        me.getMapOverlayList().forEach(function(layer){

            layer.forEachFeatureIntersectingExtent(extent, function(feature) {
              me.selectedFeatures.push(feature);
            })
          })
        });

        me.dragBox.on('boxstart', function() {
          me.selectedFeatures.clear();
        });

        me.map.on('singleclick', function(evt) {
          document.getElementById('info').innerHTML = "Loading... please wait...";
          var view = me.map.getView();
          var viewResolution = view.getResolution();

          var layers = me.getMapOverlayList();
          for(let k=0; k<me.getNumberOverlays(); k++){
            var source = layers.item(k).getVisible() ? layers.item(k).getSource() : null;

            if(source != null)
            {
              var url = source.getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, view.getProjection(),
                {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});

              if (url) {
                document.getElementById('info').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
              }

              // generate a GetFeature request
              var featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:4326',
                featureNS: 'http://openstreemap.org',
                featurePrefix: 'osm',
                featureTypes: ['water_areas'],
                outputFormat: 'application/json',
                filter: ol.format.filter.and(
                  ol.format.filter.like('name', 'Mississippi*'),
                  ol.format.filter.equalTo('waterway', 'riverbank')
                )
              });

            }
          }


        });


        /*me.map.on('click', function() {
          me.selectedFeatures.clear();
        });*/
        break;
    }

    if(v.buttonClick.id !== 'zoom-selection-id' && v.buttonClick.id !== 'select-id' ){
      if (me.dragBox) {
        me.map.removeInteraction(me.dragBox);
      }
      me.dragBox=null;

      if (me.select) {
        me.map.removeInteraction(me.select);
      }
      me.select=null;

      if(me.selectedFeatures)
        me.selectedFeatures.clear();
    }
  }



  render () {

    return(
      <div className={classes['MapViewerPanel']}>
        <MapViewToolbar id="map-view-toolbar-id" onMapViewToolbarClick={this.handleToolbarClick}/>
        <div></div>
        <div id="map" className="map"></div>
        <div id="info"><em>Click on the map to get feature info</em></div>
      </div>
    )
  }
}

export default MapViewerPanel
