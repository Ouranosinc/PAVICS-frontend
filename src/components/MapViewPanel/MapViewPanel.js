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
require('jquery');
//Couldn't figure out the bug when importing inner component css file but it works from node_modules

var MapViewToolbar = require('../MapViewToolbar/MapViewToolbar');
var Bootstrap = require('react-bootstrap');
var Panel = Bootstrap.Panel

var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;

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
    this.state = {clickCoordinate: [0,0] };
    this.layersCount = 0;
    this.map = null;
    this.baseLayers = new ol.layer.Group({'title': 'Base maps', 'opacity':1.0, 'visible':true,'zIndex':0});
    this.overlayLayers = new ol.layer.Group({'title': 'Overlays','opacity':1.0, 'visible':true,'zIndex':1});
    this.watershedsLayers = new ol.layer.Group({'title': 'Watersheds','opacity':1.0, 'visible':true,'zIndex':1});
    this.featuresSelectedLayer=null;
    this.view = null;
    this.tmpLayer=null;
    this.dragBox = null;
    this.select= null;
    this.selectedFeatures= null;
    this.watersheds_layers_name = [];
    this.bukowskis_layer_name = [];
    this.dragExtent=ol.extent.createEmpty();
    me=this;
  }

  _addFeaturesFromWfsResponse(vectorSource, response) {
    var features = vectorSource.readFeatures(response);
    vectorSource.addFeatures(features);
  }


  _createLayer(nameId){
    // the source is configured with a format, loader function and a
    // strategy, the strategy causes the loader function to be called
    // in different ways.  With the tile strategy, it will call with
    // extents matching tile boundaries for the current zoom level
    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
    });

    // styles for the vector layer
    var fill = new ol.style.Fill({
      color: 'rgba(0,255,255,0.5)'
    });

    var stroke = new ol.style.Stroke({
      color: 'rgba(255,255,255,0.5)'
    });

    var vectorStyle = new ol.style.Style({
      fill: fill,
      stroke: stroke,
    });

    // a vector layer, this time with some style options
    var layer = new ol.layer.Vector({
      source: vectorSource,
      style: vectorStyle
    });
    layer.set('nameId', nameId);
    return layer;
  }

  getGroupLayerExtent(layersGroup){
    var extentMax1 = ol.extent;
    var layers = layersGroup.getLayers();
    for (let k = 0; k < layers.getLength(); k++) {
      var source = layers.item(k).getVisible() ? layers.item(k).getSource() : null;
      if (source !== null) {
        var ext = layers.item(k).getExtent();
        extentMax1.extend(source.getExtent());
      }
    }
    return extentMax;
  }

  getMaxLayersExtent(){
    var extentMax=me.getGroupLayerExtent(me.watershedsLayers);
    return extentMax;
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
    var yolo = me.getMapBaseLayersList();
    me.addBingLayer('Aerial', this.getMapBaseLayersList(),'Aerial',true,1);
    me.addBingLayer('AerialWithLabels', this.getMapBaseLayersList(),'AerialWithLabels',false,1);
    me.addBingLayer('Road', this.getMapBaseLayersList(),'Road',false,1);


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

  addBingLayer(title, layers, bingStyle,visible,opacity){
    layers.push(new ol.layer.Tile({
      visible:visible,
      opacity:opacity,
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

  loadFromWfsGeoserver(layerId, visible, opacity, workspace,extent){

    var str = 'http://132.217.140.48:8080/geoserver/wfs?service=WFS&' +
      'version=1.1.0&request=GetFeature&typename='+layerId+'&' +
      'outputFormat=application/json&srsname=EPSG:4326&' +
      'bbox=' + extent.join(',') + ',EPSG:4326';

    console.log(str);

    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: function(extent) {
        return 'http://132.217.140.48:8080/geoserver/wfs?service=WFS&' +
          'version=1.1.0&request=GetFeature&typename='+layerId+'&' +
          'outputFormat=application/json&srsname=EPSG:4326&' +
          'bbox=' + extent.join(',') + ',EPSG:4326';
      },
      strategy: ol.loadingstrategy.bbox
    });


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

  loadLayersWFS(layers_name, workspace, visible, opacity, layersList,extent){
    console.log(layers_name.length);
    for(let k =0; k<layers_name.length; k++) {
      console.log(layers_name[k]);
      me.loadFromWfsGeoserver(layers_name[k], visible, opacity, workspace,layersList,extent);
    }
  }

  _presentFeatures(){

    if(me.featuresSelectedLayer){
      var info=[];
      var html = '<div>'
      me.featuresSelectedLayer.getSource().forEachFeature(function(feature) {
        var props = feature.getProperties();
        console.log(props);
        html += '<div>'
        html += feature.get('NOM_BASSIN');
        html += '</div>'
      });
      html += '</div>'

      document.getElementById('info').innerHTML = html;

    }
  }

  _doFeatureSelection(){

      if(me.featuresSelectedLayer==null){
        me.featuresSelectedLayer=me._createLayer(layerId);
        me.map.addLayer(me.featuresSelectedLayer)
      }
      me.featuresSelectedLayer.getSource().clear();

      console.log("_doDragExtentAction :" + me.dragExtent)

      var layerId = "WATERSHEDS:BV_N1_S";

      var proj = me.map.getView().getProjection().getCode();

      var url = 'http://132.217.140.48:8080/geoserver/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename='+layerId+'&' +
        'outputFormat=application/json&srsname='+proj+'&' +
        'bbox=' + me.dragExtent.join(',')+','+proj;

      $.ajax({url: url,
        success: function(response){
          var format = new ol.format.GeoJSON();
          var features = format.readFeatures(response, {featureProjection: proj});
          me.featuresSelectedLayer.getSource().addFeatures(features);

          me._presentFeatures();

        },
        error: function (request, status, error) {
          alert(request.responseText);
        }
      });
  }

  _doDragExtentAction(){
    if(me.state.toolId==='select-id') {
      me._doFeatureSelection();
    }

  }


  initMap() {

    me.view = new ol.View({
      center: [-8065301, 5787882],
      zoom: 6
    })

    var mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position-id'),
      undefinedHTML: '&nbsp;'
    });

    var projectionSelect = document.getElementById('projection');
    projectionSelect.addEventListener('change', function(event) {
      mousePositionControl.setProjection(ol.proj.get(event.target.value));
    });



    var map = new ol.Map({
      controls: ol.control.defaults()
      .extend([
        mousePositionControl
      ]),
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
        console.log('singleclick');
        document.getElementById('info').innerHTML = "Loading... please wait...";
        me.setState({clickCoordinate:evt.coordinate})
        var tl = ol.coordinate.add(evt.coordinate, [-10e-6, -10e-6]);
        var br = ol.coordinate.add(evt.coordinate, [10e-6, 10e-6]);

        var minX;
        var maxX;

        if(tl[0] < br[0]){
          minX=tl[0];
          maxX=br[0];
        }else{
          minX=br[0];
          maxX=tl[0];
        }

        var minY;
        var maxY;

        if(tl[1] < br[1]){
          minY=tl[1];
          maxY=br[1];
        }else{
          minY=br[1];
          maxY=tl[1];
        }

        me.dragExtent = [minX, minY, maxX, maxY]
        me._doFeatureSelection();
      }
      else{
        document.getElementById('info').innerHTML = <div></div>;
      }
    });

    me.map.addInteraction(me.dragBox);
    me.dragBox.on('boxend', function() {
      me.dragExtent = me.dragBox.getGeometry().getExtent()
      me._doDragExtentAction();
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

  _doZoomMaxExtent(){
    me.map.getView().fit(me.getMaxLayersExtent(),me.map.getSize());
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
      case 'zoom-full-extend-id':me._doZoomMaxExtent();break;
      case 'select-id': me._doSelection();break;
      }
  }

  render () {
    return(

      <div className={classes['MapViewerPanel']}>
        <MapViewToolbar id="map-view-toolbar-id" onMapViewToolbarClick={this._handleToolbarClick}/>
        <div></div>
        <Panel id="map" className="map"/>
        <form id="mouse-position-id">
          <div>
            <label>Projection</label>
            <select id="projection">
              <option value="EPSG:4326">EPSG:4326</option>
              <option value="EPSG:3857">EPSG:3857</option>
            </select>
          </div>
        </form>
        <div id="info"><em>Click on the map to get feature info</em></div>
      </div>
    )
  }
}

export default MapViewerPanel
