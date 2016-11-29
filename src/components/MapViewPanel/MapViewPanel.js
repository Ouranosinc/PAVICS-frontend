/**
 * Created by beaulima on 16-10-20.
 */



var GEOSERVER48_ROUTE = 'http://outarde.crim.ca:8095/geoserver';
var NCWMS31_ROUTE = 'http://outarde.crim.ca:8083/thredds';
var NASA_DISC1 = 'http://disc1.gsfc.nasa.gov/daac-bin/wms_airs'

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
    dataset: React.PropTypes.object
  };

  _createGroupLayer(name, title, visible, opacity, zIndex){
    return {'id':name, 'layerGroup':new ol.layer.Group({'title': title, 'opacity':opacity, 'visible':visible,'zIndex':zIndex})};
  }

  constructor(props) {
    super(props);
    this.state = {toolId: "no-state-id"};
    this.state = {clickCoordinate: [0,0] };
    this.layerSwitcher=null;
    this.layersCatalog=[];

    this.layersGroup = [];

    this.layersCount = 0;
    this.map = null;
    this.featuresSelectedLayer=null;

    this.view = null;
    this.tmpLayer=null;
    this.dragBox = null;
    this.select= null;
    this.selectedFeatures= null;
    this.dragExtent=ol.extent.createEmpty();
    me=this;
  }



  _addLayerGroup(id, title, opacity, visible, zIndex){
    me.layersGroup.push(me._createGroupLayer(id,title, opacity, visible, zIndex));
  }

  _getLayersGroup(layerGroupId){
    for(var k=0; k<me.layersGroup.length; k++){
      if(me.layersGroup[k]['id']===layerGroupId){
        return me.layersGroup[k]['layerGroup'];
      }
    }
    return null;
  }

  _getLayersCatalog(){
    return me.layersCatalog;
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

  // A finir
  getGroupLayerExtent(layersGroup){
    var extentMax1 = ol.extent;
    var layers = layersGroup.getLayers();
    for (let k = 0; k < layers.getLength(); k++) {
      var source = layers.item(k).getVisible() ? layers.item(k).getSource() : null;
      if (source !== null) {
        var ext = layers.item(k).getExtent();
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
    return me._getLayersGroup('baseLayers').getLayers();
  }

  // Returns overlay layers list
  getMapOverlayList() {
    return me._getLayersGroup('overlayLayers').getLayers();
  }

  // Returns overlay layers list
  getWatershedLayerList() {
    return me._getLayersGroup('watershedsLayers').getLayers();
  }

  // Returns overlay layers list
  getNasaLayerList() {
    return me._getLayersGroup('nasaAirCO2').getLayers();
  }

  // Add backgrounnd layer (use once)
  initBackgroundLayer() {
    me.addBingLayer('Aerial', this.getMapBaseLayersList(),'Aerial',false,1);
    me.addBingLayer('AerialWithLabels', this.getMapBaseLayersList(),'AerialWithLabels',true,1);
    me.addBingLayer('Road', this.getMapBaseLayersList(),'Road',false,1);

  }

  removeLayer(layers, title){
    var layer;

    for(layer in layers)
      if(title===layer.get('title')) {
        console.log('addTileWMSLayer: First Remove layer ' + layer.get('title'));
        this.map.removeLayer(layer);
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

  addBingLayer(title, layersGroup, bingStyle,visible,opacity){
    layersGroup.push(new ol.layer.Tile({
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

  _loadFromGeoserverWms(serverUrl, workspaceLayerName, workspaceName, visible, opacity,style){
    var tiled = new ol.layer.Tile({
      visible: visible,
      opacity:opacity,
      source: new ol.source.TileWMS({
        url: [serverUrl,workspaceName,'wms'].join('/'),
        params: {'FORMAT': 'image/png',
          tiled: true,
          STYLES: '',
          LAYERS: workspaceLayerName
        }
      })
    });
    return  tiled
  }




  _presentFeatures(){

    if(me.featuresSelectedLayer){
      var info=[];
      var html = '<div>'
      me.featuresSelectedLayer.getSource().forEachFeature(function(feature) {
        var props = feature.getProperties();
        console.log(props);
        html += '<div>'
        html += [feature.get('NOM_BASSIN'),feature.getId(),feature.get('serverUrl'),feature.get('workspaceLayer')].join(',');
        html += '</div>'
      });
      html += '</div>'

      document.getElementById('info').innerHTML = html;

    }
  }

  _getWfsRequest(serverUrl, layerId, proj, extent){
    return serverUrl+ '/wfs?service=WFS&' +
      'version=1.1.0&request=GetFeature&typename='+layerId+'&' +
      'outputFormat=application/json&srsname='+proj+'&' +
      'bbox=' + extent.join(',')+','+proj;
  }

  _doFeatureSelection(serverUrl, olayerId,layerId){

      if(me.featuresSelectedLayer==null){
        me.featuresSelectedLayer=me._createLayer(olayerId);
        me.map.addLayer(me.featuresSelectedLayer)
      }
      me.featuresSelectedLayer.getSource().clear();

      var proj = me.map.getView().getProjection().getCode();

      var url = me._getWfsRequest(serverUrl, layerId, proj, me.dragExtent );

      console.log(url)

      fetch(url).then(function(response) {
        return response.text();
      }).then(function(text) {
        var format = new ol.format.GeoJSON();
        var features = format.readFeatures(response, {featureProjection: proj});
        me.featuresSelectedLayer.getSource().addFeatures(features);

        me._presentFeatures();
      });
  }

  _wfsFetchSelectFeatures(wfsUrl, serverUrl, workapcelayerId,proj,featuresSelectedLayer ){
    console.log(wfsUrl)
    fetch(wfsUrl).then(function(response) {
      if(response.ok) {
        return response.text();
      }else {
        console.log('Bad reponse');
      }
    }).then(function(text) {
      var format = new ol.format.GeoJSON();
      var features = format.readFeatures(text, {featureProjection: proj});
      if(features.length) {
        for(var k=0; k<features.length; k++ ){
          var feature = features[k];
          feature.set('serverUrl',serverUrl);
          feature.set('workspaceLayer', workapcelayerId);
          featuresSelectedLayer.getSource().addFeature(feature);
        }
        me._presentFeatures();
      }
    })
  }

  _doFeatureSelection(featurelayerId, layersCatalog){
    if(me.featuresSelectedLayer==null){
      me.featuresSelectedLayer=me._createLayer(featurelayerId);
      me.map.addLayer(me.featuresSelectedLayer)
    }
    me.featuresSelectedLayer.getSource().clear();
    var proj = me.map.getView().getProjection().getCode();
    for(var k=0; k<layersCatalog.length; k++) {
      // {'layerData':layerData, 'serverUrl':serverUrl, 'layerObj':null}
      var wmsLayerCatalogData = layersCatalog[k];
      if(wmsLayerCatalogData['layerObj']!=null) {
        if(wmsLayerCatalogData['layerData'].selectable) {
          var wfsUrl = me._getWfsRequest(wmsLayerCatalogData['serverUrl'], wmsLayerCatalogData['layerData'].Name, proj, me.dragExtent);
          var serverUrl = wmsLayerCatalogData['serverUrl'];
          var workapcelayerId = wmsLayerCatalogData['layerData'].Name;
          me._wfsFetchSelectFeatures(wfsUrl, serverUrl, workapcelayerId,proj, me.featuresSelectedLayer)
        }
      }
    }
  }

  _doDragExtentAction(){
    if(me.state.toolId==='select-id') {
      var serverUrl = GEOSERVER48_ROUTE;
      //me._doFeatureSelection(serverUrl, 'select-id', 'WATERSHEDS:BV_N1_S' );
      me._doFeatureSelection('select-id', me._getLayersCatalog());
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

    var layers=[];
    for(var k=0; k<me.layersGroup.length; k++){
      layers.push(me.layersGroup[k]['layerGroup'])
    }
    var map = new ol.Map({
      controls: ol.control.defaults()
      .extend([
        mousePositionControl
      ]),
      layers:layers,
      target: 'map',
      renderer: 'canvas',
      view: this.view
    });

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

        me.dragExtent = [minX, minY, maxX, maxY];
        me._doFeatureSelection('select-id', me._getLayersCatalog());
        //me._doFeatureSelection(GEOSERVER48_ROUTE, 'select-id', 'WATERSHEDS:BV_N1_S' );
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

   /* me.layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Legend' // Optional label for button
    });
    me.layerSwitcher.setMap(me.map);
    me.map.addControl(me.layerSwitcher);*/
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
    return [];prevState
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
      return me.view.getProjection();
    }
    return "";
  }

  /** Sets current projection */
  setCurrentProjection(epsg_string) {
    if (me.view != null) {
      me.view.setProjection(epsg_string);
    }
  }

  _getWmsCapabilitiesRequest(serverUrl){
    return [serverUrl,'wms?request=GetCapabilities'].join('/');
  }

  _getWmsCapabilitiesRequest2(serverUrl, version){
    return [serverUrl,'?service=WMS&VERSION='+version+'&REQUEST=GetCapabilities'].join('/');
  }

  _getThreddsWmsCapabilities(serverUrl){
    return [serverUrl,'wms/birdhouse/CMIP5/CCCMA/CanESM2/historical/day/atmos/r1i1p1/pr/pr_day_CanESM2_historical_r1i1p1_18500101-20051231.nc?service=WMS&request=GetCapabilities'].join('/');
  }


  _fromLayerDataGetWorkspace(catalogData){
    var r0 = catalogData.layerData.Name;
    var r1 = r0.split(':');
    return {'workspaceId':r1[0], 'layerId':r1[1]};
  }

  _getWmsCapabilities2(serverUrl, getWmsCapabilitiesFunc, version, callback){
    var parser = new ol.format.WMSCapabilities();
    console.log(getWmsCapabilitiesFunc(serverUrl,version));
    fetch(getWmsCapabilitiesFunc(serverUrl,version)).then(function(response) {
      return response.text();
    }).then(function(text) {
      var result = parser.read(text);
      var layers = result.Capability.Layer.Layer;
      for (var i = 0, len = layers.length; i < len; i++) {
        var layerData = layers[i];
        layerData.serverUrl=serverUrl;
        layerData.selectable=false;
        me.layersCatalog.push({'layerData':layerData, 'serverUrl':serverUrl, 'layerObj':null})
        console.log(layerData['Name'])
      }
      if(callback!=null) callback()
    });
  }

  _getThreddsWmsCapabilities2(serverUrl, getWmsCapabilitiesFunc, version, callback){
    var parser = new ol.format.WMSCapabilities();
    console.log(getWmsCapabilitiesFunc(serverUrl,version));
    fetch(getWmsCapabilitiesFunc(serverUrl,version)).then(function(response) {
      return response.text();
    }).then(function(text) {
      var result = parser.read(text);
      var layers = result.Capability.Layer.Layer;
      for (var i = 0, len = layers.length; i < len; i++) {
        var layerData0 = layers[i].Layer;
        for (var i = 0, len = layerData0.length; i < len; i++) {
          var layerData = layerData0[i];
          layerData.serverUrl = serverUrl;
          layerData.selectable = false;
          me.layersCatalog.push({'layerData': layerData, 'serverUrl': serverUrl, 'layerObj': null})
          console.log(layerData['Name'])
        }
      }
      if(callback!=null) callback()
    });
  }



  _applyFilter(layerObj, filterType, filter){

    // by default, reset all filters
    var filterParams = {
      'FILTER': null,
      'CQL_FILTER': null,
      'FEATUREID': null
    };
    if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') != "") {
      if (filterType == "cql") {
        filterParams["CQL_FILTER"] = filter;
      }
      if (filterType == "ogc") {
        filterParams["FILTER"] = filter;
      }
      if (filterType == "fid")
        filterParams["FEATUREID"] = filter;
    }
    // merge the new filter definitions

    layerObj.getSource().updateParams(filterParams);

  }

  _addLayerFromCatalog(layersCatalog,workspaceLayerId, visible,opacity, layerGroup, zIndex, selectable){
    for (var i = 0, len = layersCatalog.length; i < len; i++) {
      var LayersCatalogData = layersCatalog[i];
      if(LayersCatalogData['layerData'].Name.indexOf(workspaceLayerId)!==-1) {
        var layerObj=LayersCatalogData['layerObj'];
        if(layerObj!=null){
          layerObj.setVisible(visible);
          layerObj.setOpacity(opacity);
          layerObj.setZIndex(zIndex);
          layerGroup.push(layerObj);
          LayersCatalogData['layerData'].selectable=selectable;

         /*var filterType = "cql"
          var filter = "SUP_KM2 >10";

          me._applyFilter(layerObj, filterType, filter);*/
        }
      }
    }
  }

  _loadGEOSERVER48SpecificLayers(){
    me._loadFromCatalog(me._getLayersCatalog(), "WATERSHEDS:BV_N1_S", me._loadFromGeoserverWms);
    me._loadFromCatalog(me._getLayersCatalog(), "WATERSHEDS:BV_N2_S", me._loadFromGeoserverWms);
    me._loadFromCatalog(me._getLayersCatalog(), "WATERSHEDS:BV_N3_S", me._loadFromGeoserverWms);
    me._loadFromCatalog(me._getLayersCatalog(), "ADMINBOUNDARIES:canada_admin_boundaries", me._loadFromGeoserverWms);
    me._loadFromCatalog(me._getLayersCatalog(), "opengeo:countries", me._loadFromGeoserverWms);

    me._addLayerFromCatalog(me._getLayersCatalog(), "WATERSHEDS:BV_N1_S", true, 0.50, me.getWatershedLayerList(),1,1);
    //me._addLayerFromCatalog(me._getLayersCatalog(), "WATERSHEDS:BV_N2_S", true, 0.50, me.getWatershedLayerList(),1,1);
    //me._addLayerFromCatalog(me._getLayersCatalog(), "WATERSHEDS:BV_N3_S", true, 0.50, me.getWatershedLayerList(),0,1);
    me._addLayerFromCatalog(me._getLayersCatalog(), "ADMINBOUNDARIES:canada_admin_boundaries", true, 1.0, me.getWatershedLayerList(),0,0);
    me._addLayerFromCatalog(me._getLayersCatalog(), "opengeo:countries", true, 1.0, me.getWatershedLayerList(),0,0);
  }

  _loadNCWMSSpecificLayers() {

  }

  _loadNasaSpecificLayers() {

   // me._loadFromCatalog(me._getLayersCatalog(), "AIRX3C2M_CO2", me._loadFromGenericWms);
  //  me._addLayerFromCatalog(me._getLayersCatalog(), "AIRX3C2M_CO2", true, 1.0, me.getMapBaseLayersList(),1,1);

  }

  _getWPSRequest(wpsUrl, processName, option){

  }

  componentDidMount(){

    me._addLayerGroup('baseLayers','Base maps', 1.0, true, 0);
    //me._addLayerGroup('nasaAirCO2','AIRS CO2', 1.0, true, 1);
    me._addLayerGroup('overlayLayers','Overlays', 1.0, true, 1);
    me._addLayerGroup('watershedsLayers','Watersheds', 1.0, true, 3);
    me._getWmsCapabilities2(GEOSERVER48_ROUTE, me._getWmsCapabilitiesRequest, "1.1.1", me._loadGEOSERVER48SpecificLayers);
    //me._getWmsCapabilities2(NASA_DISC1, me._getWmsCapabilitiesRequest2, "1.1.1", me._loadNasaSpecificLayers);
    //me._getWmsCapabilities2(NCWMS31_ROUTE, "1.1.1", me._loadGEOSERVER48SpecificLayer);
    //me._getThreddsWmsCapabilities2(NCWMS31_ROUTE ,me._loadNWSSpecificLayer)
    me.initBackgroundLayer();
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
    me.setCurrentResolution(me.getCurrentResolution()*1.1);
  }

  _doZoomSelection(){
  }

  _doSelection(){
  }

  _doZoomMaxExtent(){
    me.map.getView().fit(me.getMaxLayersExtent(),me.map.getSize());
  }

  _doChangeBaseLayer(){

  }



  _wpsSubset_WFS(wpsUrl,featureids, layerId)
    {
      var method = 'POST';
      var postData =
        '<wps:Execute service="WPS" version="1.0.0"\n'
        + '            xmlns:wps="http://www.opengis.net/wps/1.0.0"\n'
        + '            xmlns:ows="http://www.opengis.net/ows/1.1"\n'
        + '            xmlns:xlink="http://www.w3.org/1999/xlink"\n'
        + '            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"           xsi:schemaLocation="http://www.opengis.net/wps/1.0.0              http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd">\n'
        + ' <ows:Identifier>subset_WFS</ows:Identifier>\n'
        + ' <wps:DataInputs>\n'
        + '  <wps:Input>\n'
        + '    <ows:Identifier>resource</ows:Identifier>\n'
        + '                <wps:Reference mimeType="application/x-netcdf"           xlink:href="http://132.217.140.31:8083/thredds/fileServer/birdhouse/CMIP5/CCCMA/CanESM2/historical/mon/atmos/r1i1p1/pr/pr_Amon_CanESM2_historical_r1i1p1_185001-200512.nc"/>\n'
        + '              </wps:Input>\n'
        + '             <wps:Input>\n'
        + '                <ows:Identifier>featureids</ows:Identifier>\n'
        + '                <wps:Data>\n'
        + '                  <wps:LiteralData>'+featureids+'</wps:LiteralData>\n'
        + '                </wps:Data>\n'
        + '              </wps:Input>\n'
        + '              <wps:Input>\n'
        + '               <ows:Identifier>typename</ows:Identifier>\n'
        + '                <wps:Data>\n'
        + '                  <wps:LiteralData>'+layerId+'</wps:LiteralData>\n'
        + '                </wps:Data>\n'
        + '             </wps:Input>\n'
        + '           </wps:DataInputs>\n'
        + '           <wps:ResponseForm>\n'
        + '             <wps:ResponseDocument storeExecuteResponse="false"           lineage="false" status="false">\n'
        + '               <wps:Output          asReference="true" mimeType="application/x-netcdf">\n'
        + '                  <ows:Identifier>ncout</ows:Identifier>\n'
        + '                </wps:Output>\n'
        + '              </wps:ResponseDocument>\n'
        + '           </wps:ResponseForm>\n'
        + '          </wps:Execute>\n'

      fetch(wpsUrl, {
        method: method,
        mode: 'cors',
        redirect: 'follow',
        headers: new Headers({
          'Content-Type': 'text/xml'
        }),
        body: postData
      }).then(function (response) {
        return response.text();
      }).then(function (text)
      {
          var parseString = require('xml2js').parseString;
          parseString(text, function (err, result) {
          var href = result['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'][0]['wps:Reference'][0]['$'].href;
          console.dir(href);

            var hrefWmsRefGetCapabilities = href.replace('http://localhost:8090/wpsoutputs/flyingpigeon', 'http://132.217.140.52:8083/thredds/wms/birdhouse/flyingpigeon')
              +'?service=WMS&version=1.3.0&request=GetCapabilities';
            console.dir(hrefWmsRefGetCapabilities);

            var hrefWmsRef = href.replace('http://localhost:8090/wpsoutputs/flyingpigeon', 'http://132.217.140.52:8083/thredds/wms/birdhouse/flyingpigeon');
            console.dir(hrefWmsRefGetCapabilities);

            me._getThreddsWmsCapabilities2(hrefWmsRef ,me._getWmsCapabilitiesRequest2, "1.3.0", me._loadPr());
        });
      });
    }

  _loadPr(){
    console.log('_loadPr');
    me._loadFromCatalog(me._getLayersCatalog(), "pr", me._loadFromGenericWms);
    me._addLayerFromCatalog(me._getLayersCatalog(), "pr", true, 1.0, me.getMapOverlayList(),10,0);

  }

  _loadFromCatalog(layersCatalog, workspaceLayerId, loadFunc){
    for (var i = 0, len = layersCatalog.length; i < len; i++) {
      var LayersCatalogData = layersCatalog[i];
      if(LayersCatalogData['layerData'].Name.indexOf(workspaceLayerId)!==-1) {
        var info = me._fromLayerDataGetWorkspace(LayersCatalogData);
        var layer = loadFunc(LayersCatalogData['serverUrl'],workspaceLayerId, info['workspaceId'],false,1.0, "");
        LayersCatalogData['layerObj'] = layer;
      }
    }
  }

  _loadFromGenericWms(serverUrl, layerName, layerName2, visible, opacity, style){
    var tiled = new ol.layer.Tile({
      visible: visible,
      opacity:opacity,
      source: new ol.source.TileWMS({
        url:serverUrl,
        params: {'FORMAT': 'image/png',
          tiled: true,
          STYLES: 'default',
          LAYERS: layerName,
          TRANSPARENT:'TRUE'
        }
      })
    });
    return  tiled
  }

  _doWpsLayer(){
    console.log('_doWpsLayer');
    var featureids='states.11';
    var layerId='usa:states';
    var wpsUrl = 'http://132.217.140.52:8093/wps';

    if(me.featuresSelectedLayer){
      var info=[];
      var html = '<div>'
      me.featuresSelectedLayer.getSource().forEachFeature(function(feature) {
        var props = feature.getProperties();
        console.log(props);
        html += '<div>'
        html += [feature.get('NOM_BASSIN'),feature.getId(),feature.get('serverUrl'),feature.get('workspaceLayer')].join(',');
        html += '</div>'

        layerId = feature.get('workspaceLayer');
        featureids = feature.getId();
        me._wpsSubset_WFS(wpsUrl,featureids,layerId);

      });
      html += '</div>'
      document.getElementById('info').innerHTML = html;
    }
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
      case 'select-baselayer-id' : me._doChangeBaseLayer(); break;
      case 'wps-id' : me._doWpsLayer(); break;


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
