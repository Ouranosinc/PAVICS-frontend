import myHttp from '../../util/http';

// Constants
export const constants = {
  SET_SELECTED_FEATURE_LAYER: 'Visualize.SET_SELECTED_FEATURE_LAYER',
  RESET_SELECTED_REGIONS: 'REGION_RESET_SELECTED_REGIONS',
  ADD_FEATURE_TO_SELECTED_REGIONS: 'REGION_ADD_FEATURE_TO_SELECTED_REGIONS',
  REMOVE_FEATURE_FROM_SELECTED_REGIONS: 'REGION_REMOVE_FEATURE_FROM_SELECTED_REGIONS',
  FETCH_WORKSPACES_REQUEST: 'Visualize.FETCH_WORKSPACES_REQUEST',
  FETCH_WORKSPACES_FAILURE: 'Visualize.FETCH_WORKSPACES_FAILURE',
  FETCH_WORKSPACES_SUCCESS: 'Visualize.FETCH_WORKSPACES_SUCCESS',
  FETCH_WORKSPACES_LAYERS_REQUEST: 'Visualize.FETCH_WORKSPACES_LAYERS_REQUEST',
  FETCH_WORKSPACES_LAYERS_FAILURE: 'Visualize.FETCH_WORKSPACES_LAYERS_FAILURE',
  FETCH_WORKSPACES_LAYERS_SUCCESS: 'Visualize.FETCH_WORKSPACES_LAYERS_SUCCESS',
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
    workspaces.map(workspace => {
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
          allResponses.map(res => {
            allTransformToJson.push(res.json());
          });
          return Promise.all(allTransformToJson);
        })
        .then(allJson => {
          let layers = {};
          allJson.map((oneRequestLayers, i) => {
            if (!oneRequestLayers.layers || !oneRequestLayers.layers.layer) {
              return;
            }
            const workspaceName = workspaces[i].resource_name;
            oneRequestLayers.layers.layer.map(layer => {
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
          dispatch(receiveVisibleWorkspacesLayersSuccess(layers));
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
          Object.keys(json.service.resources).map(serviceId => {
            const resource = json.service.resources[serviceId];
            if (resource.resource_name === 'workspaces') {
              const workspaces = [];
              Object.keys(resource.children).map(resourceId => {
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
};

// Reducer
const HANDLERS = {
  [constants.SET_SELECTED_FEATURE_LAYER]: (state, action) => {
    return {...state, selectedFeatureLayer: action.featureLayer};
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
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
