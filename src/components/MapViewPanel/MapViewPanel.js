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
var Bootstrap = require('react-bootstrap');
var Panel = Bootstrap.Panel

var g_BING_API_KEY = 'AtXX65CBBfZXBxm6oMyf_5idMAMI7W6a5GuZ5acVcrYi6lCQayiiBz7_aMHB7JR7';

var me;


class MapViewerPanel extends React.Component {
  static propTypes = {
    capabilities: React.PropTypes.object,
    dataset: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {toolId: "no-state-id"};
    this.layersCount = 0;
    this.map = null;
    this.baseLayers = new ol.layer.Group({'title': 'Base maps', 'opacity':1.0, 'visible':true,'zIndex':0});
    this.overlayLayers = new ol.layer.Group({'title': 'Overlays','opacity':1.0, 'visible':true,'zIndex':1});
    this.watershedsLayers = new ol.layer.Group({'title': 'Watersheds','opacity':1.0, 'visible':true,'zIndex':1});
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

  // Returns overlay layers list
  getWatershedLayerList() {
    if (me.watershedsLayers != null) {
      return me.watershedsLayers.getLayers()
    }
    return []
  }

  getNumberWatershedLayers(){
    return me.getWatershedLayerList().getLength()
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

  loadFromWmsGeoserver(layerId, visible, opacity, workspace, layersList){

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
    layersList.push(tiled);
  }

  loadLayers(layers_name, workspace, visible, opacity, layersList){
    console.log(layers_name.length);
    for(let k =0; k<layers_name.length; k++) {
      console.log(layers_name[k]);
      me.loadFromWmsGeoserver(layers_name[k], visible, opacity, workspace,layersList);
    }
  }



  initMap() {


    me.view = new ol.View({
      center: [-10997148, 8569099],
      zoom: 4
    })

    var map = new ol.Map({
      layers: [me.baseLayers, me.overlayLayers, me.watershedsLayers],
      target: 'map',
      renderer: 'canvas',
      view: this.view
    });

    /*var layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Legend' // Optional label for button
    });
    map.addControl(layerSwitcher);*/

    me.map = map;

    me.select = new ol.interaction.Select();
    me.map.addInteraction(me.select);

    // a DragBox interaction used to select features by drawing boxes
    me.dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly
    });

    map.getView().on('propertychange', function(e) {
      switch (e.key) {
        case 'resolution':
          console.log(e.oldValue);
          break;
      }
    });



    me.map.on('singleclick', function(evt) {

      if(me.state.toolId==='select-id') {
        document.getElementById('info').innerHTML = "Loading... please wait...";
        var view = me.map.getView();
        var viewResolution = view.getResolution();
        var layers = me.getWatershedLayerList();
        for (let k = 0; k < layers.getLength(); k++) {
          var source = layers.item(k).getVisible() ? layers.item(k).getSource() : null;
          if (source != null) {
            var url = source.getGetFeatureInfoUrl(
              evt.coordinate, viewResolution, view.getProjection(),
              {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});

            if (url) {
              document.getElementById('info').innerHTML = '<iframe border=none height=110px width=100% seamless src="' + url + '"></iframe>';
            }
          }
        }
      }
      else{
        document.getElementById('info').innerHTML = <div></div>;
      }
    });


    me.map.addInteraction(me.dragBox);
    me.dragBox.on('boxend', function() {
      console.log(me.dragBox.getGeometry().getExtent());

      if(me.state.toolId==='zoom-selection-id')
        me.map.getView().fit(me.dragBox.getGeometry().getExtent(),me.map.getSize());
      });


  }

  /** Returns view resolution */
  getCurrentResolution() {
    if (me.view != null) {
      return this.view.getResolution()
    }
    return -1;
  }

  /** Sets view resolution */
  setCurrentResolution(resolution) {
    if (me.view != null) {
      this.view.setResolution(resolution)
    }
  }

  /** Returns current view center */
  getCurrentCenter() {
    if (me.view != null) {
      return me.view.getCenter()
    }
    return [];
  }

  /** Sets current view center */
  setCurrentCenter(center) {
    if (me.view != null) {
      me.view.setCenter(center)
    }
    return [];
  }

  /** Returns current projection */
  getCurrentProjection() {
    if (me.view != null) {
      return me.view.getProjection()
    }
    return "";
  }

  /** Sets current projection */
  setCurrentProjection(epsg_string) {
    if (me.view != null) {
      me.view.setProjection(epsg_string)
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
      }
      //me.loadLayers(me.bukowskis_layer_name,"BUKOWSKI",true, 0.5);
      console.log(me.watersheds_layers_name.length);
      me.loadLayers(me.watersheds_layers_name,"WATERSHEDS",true, 0.5, me.getWatershedLayerList());
    });

    me.initBackgroundLayer()
    me.initMap();
  }

  componentWillUnmount(){
    //TODO: Verify if usefull
    //this.map.setTarget(null);
    //this.map = null;
  }

  componentDidUpdate(prevProps, prevState){

  }

  _doZoomIn(){
    me.setCurrentResolution(me.getCurrentResolution()*0.9);
  }

  _doZoomOut(){
    console.log("MapViewerPanel::handleToolbarClick : " + me.state.toolId);
    me.setCurrentResolution(me.getCurrentResolution()*1.1);
  }

  _doZoomSelection(){
  }

  _doSelection(){
  }

  _handleToolbarClick(newState) {

    if(newState.toolId !== me.state.toolId){
      if(me.selectedFeatures)
        me.selectedFeatures.clear();
    }

    me.state = newState;
    console.log("new state : ", me.state.toolId)
    switch(me.state.toolId){
      case 'zoom-in-id':me._doZoomIn();break;
      case 'zoom-out-id':me._doZoomOut(); break;
      case 'zoom-selection-id':me._doZoomSelection();break;
      case 'select-id': me._doSelection();break;
      }
  }

  render () {
    return(
      <Panel className={classes['MapViewerPanel']}>
        <MapViewToolbar id="map-view-toolbar-id" onMapViewToolbarClick={this._handleToolbarClick}/>
        <div></div>
        <Panel id="info"><em>Click on the map to get feature info</em></Panel>
        <div></div>
        <Panel id="map" className="map"> </Panel>
      </Panel>
    )
  }
}

export default MapViewerPanel
