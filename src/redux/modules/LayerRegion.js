import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';

// Constants
export const constants = {
  SET_SELECTED_FEATURE_LAYER: 'LAYER_REGION.SET_SELECTED_FEATURE_LAYER',
  SELECT_FEATURE_LAYER_BY_WORKSPACE_LAYER: 'LAYER_REGION.SELECT_FEATURE_LAYER_BY_WORKSPACE_LAYER',
  RESET_SELECTED_REGIONS: 'LAYER_REGION.RESET_SELECTED_REGIONS',
  ADD_FEATURE_TO_SELECTED_REGIONS: 'LAYER_REGION.ADD_FEATURE_TO_SELECTED_REGIONS',
  REMOVE_FEATURE_FROM_SELECTED_REGIONS: 'LAYER_REGION.REMOVE_FEATURE_FROM_SELECTED_REGIONS',
  FETCH_WORKSPACES_REQUEST: 'LAYER_REGION.FETCH_WORKSPACES_REQUEST',
  FETCH_WORKSPACES_FAILURE: 'LAYER_REGION.FETCH_WORKSPACES_FAILURE',
  FETCH_WORKSPACES_SUCCESS: 'LAYER_REGION.FETCH_WORKSPACES_SUCCESS',
  FETCH_WORKSPACES_LAYERS_REQUEST: 'LAYER_REGION.FETCH_WORKSPACES_LAYERS_REQUEST',
  FETCH_WORKSPACES_LAYERS_FAILURE: 'LAYER_REGION.FETCH_WORKSPACES_LAYERS_FAILURE',
  FETCH_WORKSPACES_LAYERS_SUCCESS: 'LAYER_REGION.FETCH_WORKSPACES_LAYERS_SUCCESS',
  SET_NEWLY_CREATED_REGION: 'LAYER_REGION.SET_NEWLY_CREATED_REGION',
};

// Actions
function requestVisibleWorkspaces () {
  return {
    type: constants.FETCH_WORKSPACES_REQUEST,
    visibleWorkspaces: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {},
      error: null
    }
  };
}
function receiveVisibleWorkspacesSuccess (workspaces) {
  return {
    type: constants.FETCH_WORKSPACES_SUCCESS,
    visibleWorkspaces: {
      receivedAt: Date.now(),
      isFetching: false,
      data: workspaces
    }
  };
}
function receiveVisibleWorkspacesFailure (error) {
  return {
    type: constants.FETCH_WORKSPACES_FAILURE,
    visibleWorkspaces: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function requestVisibleWorkspacesLayers () {
  return {
    type: constants.FETCH_WORKSPACES_LAYERS_REQUEST,
    featureLayers: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {},
      error: null
    }
  };
}
function receiveVisibleWorkspacesLayersSuccess (layers) {
  return {
    type: constants.FETCH_WORKSPACES_LAYERS_SUCCESS,
    featureLayers: {
      receivedAt: Date.now(),
      isFetching: false,
      data: layers
    }
  };
}
function receiveVisibleWorkspacesLayersFailure (error) {
  return {
    type: constants.FETCH_WORKSPACES_LAYERS_FAILURE,
    featureLayers: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function selectFeatureLayerByWorkspaceLayer (workspace, layer) {
  return {
    type: constants.SELECT_FEATURE_LAYER_BY_WORKSPACE_LAYER,
    layer: layer,
    workspace, workspace
  };
};

// Action Creators
export const actions = {
  selectRegion: function (featureId) {
    return {
      type: constants.ADD_FEATURE_TO_SELECTED_REGIONS,
      featureId: featureId
    };
  },
  unselectRegion: function (featureId) {
    return {
      type: constants.REMOVE_FEATURE_FROM_SELECTED_REGIONS,
      featureId: featureId
    };
  },
  resetSelectedRegions: function () {
    return {
      type: constants.RESET_SELECTED_REGIONS
    };
  },
  selectFeatureLayer: function (layer) {
    return {
      type: constants.SET_SELECTED_FEATURE_LAYER,
      featureLayer: layer
    };
  },
  aggregateFetchWorkspacesLayersRequests: function (workspaces) {
    const promises = [];
    workspaces.forEach(workspace => {
      const url = `${__PAVICS_GEOSERVER_API_PATH__}/workspaces/${workspace.resource_name}/layers.json`;
      promises.push(myHttp.get(url));
    });
    return Promise.all(promises);
  },
  fetchLayersFromWorkspaces: function () {
    return (dispatch, getState) => {
      dispatch(requestVisibleWorkspacesLayers());
      const state = getState();
      const workspaces = state.layerRegion.visibleWorkspaces.data;
      actions.aggregateFetchWorkspacesLayersRequests(workspaces)
        .then(allResponses => {
          const allTransformToJson = [];
          allResponses.forEach(res => {
            allTransformToJson.push(res.json());
          });
          return Promise.all(allTransformToJson);
        })
        .then(allJson => {
          let layers = {};
          allJson.forEach((oneRequestLayers, i) => {
            if (!oneRequestLayers.layers || !oneRequestLayers.layers.layer) {
              return;
            }
            const workspaceName = workspaces[i].resource_name;
            oneRequestLayers.layers.layer.forEach(layer => {
              const layerName = layer.name;
              layers[workspaceName] = layers[workspaceName] || [];
              layers[workspaceName].push({
                title: layerName,
                wmsUrl: `${__PAVICS_GEOSERVER_PATH__}/wms`,
                wmsParams: {
                  LAYERS: `${workspaceName}:${layerName}`,
                  TILED: true,
                  FORMAT: 'image/png'
                }
              });
            });
          });
          const { newlyCreatedRegion } = getState().layerRegion;
          dispatch(receiveVisibleWorkspacesLayersSuccess(layers));
          if (newlyCreatedRegion.workspace.length && newlyCreatedRegion.layer.length) {
            dispatch(selectFeatureLayerByWorkspaceLayer(newlyCreatedRegion.workspace, newlyCreatedRegion.layer));
          }
        })
        .catch(err => dispatch(receiveVisibleWorkspacesLayersFailure(err)));
    };
  },
  fetchFeatureLayers: function () {
    return dispatch => {
      dispatch(requestVisibleWorkspaces());
      return myHttp
        .get(`${__PAVICS_MAGPIE_PATH__}/users/current/services/${__PAVICS_GEOSERVER_WORKSPACES_SERVICE_NAME__}/inherited_resources`)
        .then(response => response.json())
        .then(json => {
          Object.keys(json.service.resources).forEach(serviceId => {
            const resource = json.service.resources[serviceId];
            if (resource.resource_name === 'workspaces') {
              const workspaces = [];
              Object.keys(resource.children).forEach(resourceId => {
                const workspace = resource.children[resourceId];
                workspaces.push(workspace);
              });
              dispatch(receiveVisibleWorkspacesSuccess(workspaces));
              return dispatch(actions.fetchLayersFromWorkspaces());
            }
          });
        })
        .catch(err => {
          dispatch(receiveVisibleWorkspacesFailure(err));
        });
    };
  },
  setNewlyCreatedRegion: function (workspace, layer) {
    NotificationManager.info('Newly uploaded region was automatically selected as current region.', 'Error', 10000);
    return {
      type: constants.SET_NEWLY_CREATED_REGION,
      workspace: workspace,
      layer: layer
    };
  },
};

// Reducer
const HANDLERS = {
  [constants.SET_SELECTED_FEATURE_LAYER]: (state, action) => {
    return {...state, selectedFeatureLayer: action.featureLayer};
  },
  [constants.SELECT_FEATURE_LAYER_BY_WORKSPACE_LAYER]: (state, action) => {
    const layer = Object.assign({}, state.featureLayers.data[action.workspace].find(layer => layer.title === action.layer));
    return {...state, selectedFeatureLayer: layer, newlyCreatedRegion: { workspace: '', layer: '' },};
  },
  [constants.FETCH_WORKSPACES_REQUEST]: (state, action) => {
    return ({...state, visibleWorkspaces: Object.assign({}, state.visibleWorkspaces, action.visibleWorkspaces)});
  },
  [constants.FETCH_WORKSPACES_SUCCESS]: (state, action) => {
    return ({...state, visibleWorkspaces: Object.assign({}, state.visibleWorkspaces, action.visibleWorkspaces)});
  },
  [constants.FETCH_WORKSPACES_FAILURE]: (state, action) => {
    return ({...state, visibleWorkspaces: Object.assign({}, state.visibleWorkspaces, action.visibleWorkspaces)});
  },
  [constants.FETCH_WORKSPACES_LAYERS_REQUEST]: (state, action) => {
    return ({...state, featureLayers: Object.assign({}, state.featureLayers, action.featureLayers)});
  },
  [constants.FETCH_WORKSPACES_LAYERS_SUCCESS]: (state, action) => {
    return ({...state, featureLayers: Object.assign({}, state.featureLayers, action.featureLayers)});
  },
  [constants.FETCH_WORKSPACES_LAYERS_FAILURE]: (state, action) => {
    return ({...state, featureLayers: Object.assign({}, state.featureLayers, action.featureLayers)});
  },
  [constants.ADD_FEATURE_TO_SELECTED_REGIONS]: (state, action) => {
    const copy = state.selectedRegions.concat([action.featureId]);
    return {...state, selectedRegions: copy};
  },
  [constants.REMOVE_FEATURE_FROM_SELECTED_REGIONS]: (state, action) => {
    let copy = state.selectedRegions.slice();
    copy.splice(copy.indexOf(action.featureId), 1);
    return {...state, selectedRegions: copy};
  },
  [constants.RESET_SELECTED_REGIONS]: (state) => {
    return {...state, selectedRegions: []};
  },
  [constants.SET_NEWLY_CREATED_REGION]: (state, action) => {
    return {...state, newlyCreatedRegion: { workspace: action.workspace, layer: action.layer }};
  },
};

// Initial State
export const initialState = {
  selectedRegions: [],
  selectedFeatureLayer: {},
  publicShapeFiles: [],
  featureLayers: {
    data: {},
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    error: null
  },
  visibleWorkspaces: {
    requestedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  newlyCreatedRegion: {
    workspace: '',
    layer: ''
  },
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
