import myHttp from '../../util/http';
import { GeoJSON } from 'ol/format';
import { NotificationManager } from 'react-notifications';
import { VISUALIZE_DRAW_MODES } from './../../constants';

// Constants
export const constants = {
  SET_CURRENT_DRAWING_TOOL: 'DRAW_FEATURE_SET_CURRENT_DRAWING_TOOL',
  SET_CURRENT_SELECTED_DRAWN_FEATURE: 'DRAW_FEATURE_SET_CURRENT_SELECTED_DRAWN_FEATURE',
  SET_GEO_JSON_DRAWN_FEATURE: 'DRAW_FEATURE_SET_GEO_JSON_DRAWN_FEATURE',
  SET_DRAWN_CUSTOM_FEATURES: 'DRAW_FEATURE_SET_DRAWN_CUSTOM_FEATURES',
  UPLOAD_SHAPEFILE_REQUEST: 'DRAW_FEATURE_SET_DRAWN_CUSTOM_FEATURES.UPLOAD_SHAPEFILE_REQUEST',
  UPLOAD_SHAPEFILE_FAILURE: 'DRAW_FEATURE_SET_DRAWN_CUSTOM_FEATURES.UPLOAD_SHAPEFILE_FAILURE',
  UPLOAD_SHAPEFILE_SUCCESS: 'DRAW_FEATURE_SET_DRAWN_CUSTOM_FEATURES.UPLOAD_SHAPEFILE_SUCCESS',
};

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
export function receiveUploadShapefileFailure (error) {
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
export function receiveUploadShapefileSuccess (response) {
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
  setGeoJSONDrawnFeatures: function (featuresString) {
    return {
      type: constants.SET_GEO_JSON_DRAWN_FEATURE,
      geoJSONDrawnFeature: featuresString
    };
  },
  uploadZipShapeFile: function (workspace, datastore, blobData){
    return function (dispatch, getState) {
      dispatch(requestUploadShapefile());
      const url = `${__PAVICS_GEOSERVER_API_PATH__}/workspaces/${workspace}/datastore/${datastore}/file.shp`;
      let headers = new Headers();
      headers.append('Content-Type', 'application/zip');
      headers.append('Content-Length', blobData.size);
      headers.append('Accept', 'application/zip')

      fetch(url, {
        method: 'PUT',
        headers: headers,
        body: blobData
      }).then(function (response) {
        if(response.ok) {
          receiveUploadShapefileSuccess(response.statusText)
        } else {
          receiveUploadShapefileFailure(response)
        }
        console.log(result.statusText)
      })
      .catch(function (error) {
        receiveUploadShapefileFailure(error)
      });
    };
  }
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
  [constants.SET_GEO_JSON_DRAWN_FEATURE]: (state, action) => {
    return ({...state, geoJSONDrawnFeature: action.geoJSONDrawnFeature});
  }
};

// Initial State
export const initialState = {
  drawnCustomFeatures: [],
  currentDrawingTool: '', // Disabled by default
  currentSelectedDrawnFeatureProperties: null,
  geoJSONDrawnFeature: ''
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
