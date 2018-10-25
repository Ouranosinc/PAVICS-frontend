import myHttp from '../../util/http';
import shpwrite from 'shp-write';
import prj from 'shp-write/src/prj';
import geojson from 'shp-write/src/geojson';
import JSZip from 'jszip';
import {VISUALIZE_DRAW_MODES} from './../../constants';
import { NotificationManager } from 'react-notifications';
import { actions as layerRegionActions, constants as layerRegionConstants} from './LayerRegion';

// http://epsg.io/3857.esriwkt
const PROJ_3857 = `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",
SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.017453292519943295]],
PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],
PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]`;

// Constants
export const constants = {
  SET_CURRENT_DRAWING_TOOL: 'LAYER_CUSTOM_FEATURE.SET_CURRENT_DRAWING_TOOL',
  SET_CURRENT_SELECTED_DRAWN_FEATURE: 'LAYER_CUSTOM_FEATURE.SET_CURRENT_SELECTED_DRAWN_FEATURE',
  SET_GEO_JSON_DRAWN_FEATURES: 'LAYER_CUSTOM_FEATURE.SET_GEO_JSON_DRAWN_FEATURES',
  SET_DRAWN_CUSTOM_FEATURES: 'LAYER_CUSTOM_FEATURE.SET_DRAWN_CUSTOM_FEATURES',
  UPLOAD_SHAPEFILE_REQUEST: 'LAYER_CUSTOM_FEATURE.UPLOAD_SHAPEFILE_REQUEST',
  UPLOAD_SHAPEFILE_FAILURE: 'LAYER_CUSTOM_FEATURE.UPLOAD_SHAPEFILE_FAILURE',
  UPLOAD_SHAPEFILE_SUCCESS: 'LAYER_CUSTOM_FEATURE.UPLOAD_SHAPEFILE_SUCCESS',
};

function createZipFileFromGeoJSON(geoJSON, fileName) {
  // Clear features properties or get a corrupted file and upload won't actually work for now
  /*geoJSON.features.map(feature => feature.properties = {});
  this.props.layerCustomFeatureActions.setGeoJSONDrawnFeatures(geoJSONString);*/

  let zip = new JSZip();
  const points = geojson.point(geoJSON);
  const lines = geojson.line(geoJSON);
  const polygons = geojson.polygon(geoJSON);
  const types = [points, lines, polygons];
  console.log(types.length);
  // TODO: MultiPolygon checkbox, when unchecked push one shapefile for each feature
  // TODO: Shapefile support only one type at a time, could user filename suffix for other types
  types.forEach((layer) => {
    if (layer.geometries.length && layer.geometries[0].length) {
      shpwrite.write(
        // field definitions
        layer.properties,
        // geometry type
        layer.type,
        // geometries
        layer.geometries,
        (err, files) => {
          fileName = fileName || 'CUSTOM_' + new Date().getTime();
          zip.file(fileName + '.shp', files.shp.buffer, {binary: true});
          zip.file(fileName + '.shx', files.shx.buffer, {binary: true});
          zip.file(fileName + '.dbf', files.dbf.buffer, {binary: true});
          zip.file(fileName + '.prj', PROJ_3857);
        });
    }
  });
  return zip;
}

// DEPRECATED: this actually triggers one download event for each drawn feature
// Local shapefile can't contains multiple polygons as expected (shp-write limitation)
// So this functionnality should be available for every shapefile available on geoserver instead
function createDownloadZipShapefile (filename) {
  return function (dispatch, getState) {
    const geoJSON = getState().layerCustomFeature.geoJSONDrawnFeatures;
    geoJSON.features.forEach(feature => {
      const singleGeoJSONFeature = {
        type: "FeatureCollection",
        features: [feature]
      };
      let zip = createZipFileFromGeoJSON(singleGeoJSONFeature, filename);
      const content = zip.generate({compression: 'STORE'});
      location.href = 'data:application/zip;base64,' + content;
    });
  };
}

function createUploadZipShapefile (fileName, workspace = __PAVICS_GEOSERVER_CUSTOM_WORKSPACE__, datastore = __PAVICS_GEOSERVER_CUSTOM_DATASTORE__) {
  return function (dispatch, getState) {
    const geoJSON = getState().layerCustomFeature.geoJSONDrawnFeatures;
    let blobDataArray = [];

    // HTTP PUT will append shapefile feature by default if filename already exists
    // Since shp-write won't allow to push multiple at once in the shapefile, we'll delegate this functionnaly to geoserver
    geoJSON.features.forEach(feature => {
      const singleGeoJSONFeature = {
        type: "FeatureCollection",
        features: [feature]
      };
      let zip = createZipFileFromGeoJSON(singleGeoJSONFeature, fileName);
      blobDataArray.push(zip.generate({type:"blob"}));
    });
    dispatch(uploadZipShapefiles(workspace, datastore, fileName, blobDataArray));
  };
}

// HTTP PUT will append shapefile feature by default if filename exists
function uploadZipShapefiles (workspace, datastore, fileName, blobDataArray){
  return function (dispatch) {
    let promises = [];
    const url = `${__PAVICS_GEOSERVER_API_PATH__}/workspaces/${workspace}/datastores/${datastore}/file.shp`;
    blobDataArray.forEach(blobData => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/zip');
      headers.append('Content-Length', blobData.size);
      headers.append('Accept', 'application/zip');
      dispatch(requestUploadShapefile());
      promises.push(fetch(url, {
        method: 'PUT',
        headers: headers,
        body: blobData,
        credentials: 'include'
      }));
    });
    Promise.all(promises)
      .then(responses => {
        if (responses.every(response => response.ok)) {
          NotificationManager.success('Shapefile was uploaded on the server with success.', 'Success', 10000);
          dispatch(receiveUploadShapefileSuccess(responses));

          // Automatic actions after successful upload
          dispatch(layerRegionActions.setNewlyCreatedRegion(workspace, fileName));
          dispatch(layerRegionActions.fetchFeatureLayers());
          dispatch(layerRegionActions.resetSelectedRegions());
          dispatch(actions.resetGeoJSONDrawnFeatures());
        } else {
          NotificationManager.error('An error occurred while uploading the shapefile on the server.', 'Error', 10000);
          dispatch(receiveUploadShapefileFailure(responses));
        }
      })
      // Avoid swallowing non-HTTP errors
      .catch(function (error) {
        throw new Error(error);
        // NotificationManager.error('An error occurred while uploading the shapefile on the server.', 'Error', 10000);
        // dispatch(receiveUploadShapefileFailure(error));
      });
  };
}

function requestUploadShapefile () {
  return {
    type: constants.UPLOAD_SHAPEFILE_REQUEST,
    uploadedShapefile: {
      requestedAt: Date.now(),
      isFetching: true,
      response: ''
    }
  };
}
function receiveUploadShapefileFailure (error) {
  return {
    type: constants.UPLOAD_SHAPEFILE_FAILURE,
    uploadedShapefile: {
      receivedAt: Date.now(),
      isFetching: false,
      response: '',
      error: error
    }
  };
}
function receiveUploadShapefileSuccess (response) {
  return {
    type: constants.UPLOAD_SHAPEFILE_SUCCESS,
    uploadedShapefile: {
      receivedAt: Date.now(),
      isFetching: false,
      response: response,
      error: null
    }
  };
}

// Action Creators
export const actions = {
  setCurrentDrawingTool: function (tool) {
    return {
      type: constants.SET_CURRENT_DRAWING_TOOL,
      currentDrawingTool: tool
    };
  },
  setCurrentSelectedDrawnFeature: function (feature) {
    return {
      type: constants.SET_CURRENT_SELECTED_DRAWN_FEATURE,
      currentSelectedDrawnFeatureProperties: feature
    };
  },
  setDrawnCustomFeatures: function (features) {
    return {
      type: constants.SET_DRAWN_CUSTOM_FEATURES,
      drawnCustomFeatures: features
    };
  },
  setGeoJSONDrawnFeatures: function (geoJSONFeatures) {
    return {
      type: constants.SET_GEO_JSON_DRAWN_FEATURES,
      geoJSONDrawnFeatures: geoJSONFeatures
    };
  },
  resetGeoJSONDrawnFeatures: function () {
    return {
      type: constants.SET_GEO_JSON_DRAWN_FEATURES,
      geoJSONDrawnFeatures: {
        type: "FeatureCollection",
        features: []
      }
    };
  },
  createUploadZipShapefile: createUploadZipShapefile,
  createDownloadZipShapefile: createDownloadZipShapefile,
  uploadZipShapefiles: uploadZipShapefiles
};

// Reducer
const HANDLERS = {
  [constants.SET_DRAWN_CUSTOM_FEATURES]: (state, action) => {
    return {...state, drawnCustomFeatures: action.drawnCustomFeatures.slice()};
  },
  [constants.SET_CURRENT_DRAWING_TOOL]: (state, action) => {
    return ({...state, currentDrawingTool: action.currentDrawingTool});
  },
  [constants.SET_CURRENT_SELECTED_DRAWN_FEATURE]: (state, action) => {
    return ({...state, currentSelectedDrawnFeatureProperties: Object.assign({}, action.currentSelectedDrawnFeatureProperties)});
  },
  [constants.SET_GEO_JSON_DRAWN_FEATURES]: (state, action) => {
    return ({...state, geoJSONDrawnFeatures: action.geoJSONDrawnFeatures});
  }
};

// Initial State
export const initialState = {
  drawnCustomFeatures: [],
  currentDrawingTool: VISUALIZE_DRAW_MODES.BBOX.value, // Enabled BBOX by default
  currentSelectedDrawnFeatureProperties: null,
  geoJSONDrawnFeatures: {
    type: "FeatureCollection",
    features: []
  }
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
