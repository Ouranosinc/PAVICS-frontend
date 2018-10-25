import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';

// Constants
export const constants = {
  SET_CURRENT_TIME_ISO: 'Visualize.SET_CURRENT_TIME_ISO',
  ADD_DATASETS_TO_VISUALIZE: 'LAYER_DATASET.ADD_DATASETS_TO_VISUALIZE',
  SET_SELECTED_DATASET_LAYER: 'LAYER_DATASET.SET_SELECTED_DATASET_LAYER',
  SET_SELECTED_DATASET_CAPABILITIES: 'LAYER_DATASET.SET_SELECTED_DATASET_CAPABILITIES',
  VISUALIZE_SET_VARIABLE_BOUNDARY_VALUES: 'LAYER_DATASET.VISUALIZE_SET_VARIABLE_BOUNDARY_VALUE',
  SET_SELECTED_COLOR_PALETTE: 'LAYER_DATASET.SET_SELECTED_COLOR_PALETTE',
  FETCH_WMS_LAYER_DETAILS_REQUEST: 'LAYER_DATASET.FETCH_WMS_LAYER_DETAILS_REQUEST',
  FETCH_WMS_LAYER_DETAILS_FAILURE: 'LAYER_DATASET.FETCH_WMS_LAYER_DETAILS_FAILURE',
  FETCH_WMS_LAYER_DETAILS_SUCCESS: 'LAYER_DATASET.FETCH_WMS_LAYER_DETAILS_SUCCESS',
  FETCH_WMS_LAYER_TIMESTEPS_REQUEST: 'LAYER_DATASET.FETCH_WMS_LAYER_TIMESTEPS_REQUEST',
  FETCH_WMS_LAYER_TIMESTEPS_FAILURE: 'LAYER_DATASET.FETCH_WMS_LAYER_TIMESTEPS_FAILURE',
  FETCH_WMS_LAYER_TIMESTEPS_SUCCESS: 'LAYER_DATASET.FETCH_WMS_LAYER_TIMESTEPS_SUCCESS',
};

// Actions
function requestWMSLayerDetails (layer, url) {
  return {
    type: constants.FETCH_WMS_LAYER_DETAILS_REQUEST,

    selectedWMSLayerDetails: {
      requestedAt: Date.now(),
      layer: layer,
      wmsUrl: url,
      isFetching: true,
      data: {}
    }
  };
}
function receiveWMSLayerDetailsFailure (error) {
  return {
    type: constants.FETCH_WMS_LAYER_DETAILS_FAILURE,
    selectedWMSLayerDetails: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}
function receiveWMSLayerDetails (data) {
  return {
    type: constants.FETCH_WMS_LAYER_DETAILS_SUCCESS,
    selectedWMSLayerDetails: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  };
}
function requestWMSLayerTimesteps (layer, url, day) {
  return {
    type: constants.FETCH_WMS_LAYER_TIMESTEPS_REQUEST,
    selectedWMSLayerTimesteps: {
      requestedAt: Date.now(),
      layer: layer,
      wmsUrl: url,
      day: day,
      isFetching: true,
      data: {}
    }
  };
}
function receiveWMSLayerTimestepsFailure (error) {
  return {
    type: constants.FETCH_WMS_LAYER_TIMESTEPS_FAILURE,
    selectedWMSLayerTimesteps: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}
function receiveWMSLayerTimesteps (data) {
  return {
    type: constants.FETCH_WMS_LAYER_TIMESTEPS_SUCCESS,
    selectedWMSLayerTimesteps: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  };
}

// Action Creators
export const actions = {
  fetchWMSLayerDetails: function (url, layer) {
    return function (dispatch) {
      dispatch(requestWMSLayerDetails());
      return myHttp.get(`${url}?request=GetMetadata&item=layerDetails&layerName=${layer}`)
        .then(response => {
          if(response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          try {
            return response.json()
          } catch(err) {
            throw new Error('Failed at parsing JSON response');
          }
        })
        .then(json =>
          dispatch(receiveWMSLayerDetails(json))
        )
        .catch(error => {
          NotificationManager.error(`Method GetMetadata LayerDetails failed at being fetched from the NcWMS2 server: ${error}`, 'Error', 10000);
          dispatch(receiveWMSLayerDetailsFailure(error))
        });
    };
  },
  fetchWMSLayerTimesteps: function (url, layer, day) {
    return function (dispatch) {
      dispatch(requestWMSLayerTimesteps());
      return myHttp.get(`${url}?request=GetMetadata&item=timesteps&day=${day}&layerName=${layer}`)
        .then(response => {
          if(response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          try {
            return response.json()
          } catch(err) {
            throw new Error('Failed at parsing JSON response');
          }
        })
        .then(json =>
          dispatch(receiveWMSLayerTimesteps(json))
        )
        .catch(error => {
          NotificationManager.error(`Method GetMetadata TimeSteps failed at being fetched from the NcWMS2 server: ${error}`, 'Error', 10000);
          dispatch(receiveWMSLayerTimestepsFailure(error))
        });
    };
  },
  testWMSGetMapPermission: function (url, layer) {
    // Removed dispatch events since this route does not return any useful data
    return function (dispatch) {
      return myHttp.get(`${url}?REQUEST=GetMap&LAYERS=${layer}`)
        .then(response => {
          if(response.status !== 200) {
            throw new Error(`${response.status} ${response.statusText}`);
          }
          try {
            //text.contains('Must provide a value for VERSION')
            return response.text()
          } catch(err) {
            throw new Error('Failed at parsing XML response');
          }
        })
        .then(text => {/*console.log(text)*/})
        .catch(error => NotificationManager.error(`Method GetMap failed at being fetched from the NcWMS2 server: ${error}`, 'Error', 10000));
    };
  },
  addDatasetsToVisualize: function (datasets) {
    return {
      type: constants.ADD_DATASETS_TO_VISUALIZE,
      datasets: datasets
    };
  },
  setSelectedDatasetCapabilities: function (capabilities) {
    return {
      type: constants.SET_SELECTED_DATASET_CAPABILITIES,
      capabilities: capabilities
    };
  },
  selectCurrentDisplayedDataset: function (layer) {
    return {
      type: constants.SET_SELECTED_DATASET_LAYER,
      layer: layer
    };
  },
  selectColorPalette: function (palette) {
    return {
      type: constants.SET_SELECTED_COLOR_PALETTE,
      palette: palette
    };
  },
  setVariablePreferenceBoundaries: function (min, max) {
    return {
      type: constants.VISUALIZE_SET_VARIABLE_BOUNDARY_VALUES,
      min: min,
      max: max
    };
  },
  setCurrentDateTime: function (datetime) {
    return {
      type: constants.SET_CURRENT_TIME_ISO,
      currentDateTime: datetime
    };
  },
};

// Reducer
const HANDLERS = {
  [constants.FETCH_WMS_LAYER_DETAILS_REQUEST]: (state, action) => {
    return ({...state, selectedWMSLayerDetails: action.selectedWMSLayerDetails});
  },
  [constants.FETCH_WMS_LAYER_DETAILS_FAILURE]: (state, action) => {
    return ({...state, selectedWMSLayerDetails: action.selectedWMSLayerDetails});
  },
  [constants.FETCH_WMS_LAYER_DETAILS_SUCCESS]: (state, action) => {
    return ({...state, selectedWMSLayerDetails: action.selectedWMSLayerDetails});
  },
  [constants.FETCH_WMS_LAYER_TIMESTEPS_REQUEST]: (state, action) => {
    return ({...state, selectedWMSLayerTimesteps: action.selectedWMSLayerTimesteps});
  },
  [constants.FETCH_WMS_LAYER_TIMESTEPS_FAILURE]: (state, action) => {
    return ({...state, selectedWMSLayerTimesteps: action.selectedWMSLayerTimesteps});
  },
  [constants.FETCH_WMS_LAYER_TIMESTEPS_SUCCESS]: (state, action) => {
    return ({...state, selectedWMSLayerTimesteps: action.selectedWMSLayerTimesteps});
  },
  [constants.ADD_DATASETS_TO_VISUALIZE]: (state, action) => {
    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    action.datasets.map( x => {
      x.uniqueLayerSwitcherId = uuidv4();
      return x;
    });
    let newDatasetLayers = state.currentVisualizedDatasets.concat(action.datasets);
    return ({...state, currentVisualizedDatasets: newDatasetLayers});
  },
  [constants.REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS]: (state, action) => {
    let newSearchCriterias = state.currentProjectSearchCriterias.slice();
    let index = state.currentProjectSearchCriterias.findIndex(x => x === action.searchCriteria);
    newSearchCriterias.splice(index, 1);
    return ({...state, currentProjectSearchCriterias: newSearchCriterias});
  },
  /*
   this handler must receive a dataset
   verify if preferences has been set for the selected variable
   if variable is set
   update dataset informations with it
   else
   initialize preferences for the variable
   */
  [constants.SET_SELECTED_DATASET_LAYER]: (state, action) => {
    let variablePreference;
    if (state.variablePreferences[action.layer.variable]) {
      variablePreference = state.variablePreferences[action.layer.variable];
      action.layer.variable_min = variablePreference.min;
      action.layer.variable_max = variablePreference.max;
      action.layer.variable_palette = variablePreference.colorPalette;
    } else {
      variablePreference = {
        min: action.layer.variable_min,
        max: action.layer.variable_max,
        colorPalette: action.layer.variable_palette
      };
    }
    return {
      ...state,
      currentDisplayedDataset: action.layer,
      // When resetting datasets, it results in adding to variablePreferences:
      // 'undefined': {colorPalette:undefined, max:  undefined, min:undefined}
      variablePreferences: {...state.variablePreferences, [action.layer.variable]: variablePreference},
      selectedColorPalette: variablePreference.colorPalette
    };
  },
  [constants.SET_SELECTED_DATASET_CAPABILITIES]: (state, action) => {
    return {...state, selectedDatasetCapabilities: action.capabilities};
  },
  [constants.SET_SELECTED_COLOR_PALETTE]: (state, action) => {
    if (state.currentDisplayedDataset.variable && state.variablePreferences[state.currentDisplayedDataset.variable]) {
      return {
        ...state,
        selectedColorPalette: action.palette,
        variablePreferences: {
          ...state.variablePreferences,
          [state.currentDisplayedDataset.variable]: {
            ...state.variablePreferences[state.currentDisplayedDataset.variable],
            colorPalette: action.palette
          }
        }
      };
    }
    return {...state, selectedColorPalette: action.palette};
  },
  [constants.VISUALIZE_SET_VARIABLE_BOUNDARY_VALUES]: (state, action) => {
    return {
      ...state,
      variablePreferences: {
        ...state.variablePreferences,
        [state.currentDisplayedDataset.variable]: {
          ...state.variablePreferences[state.currentDisplayedDataset.variable],
          min: action.min,
          max: action.max
        }
      },
      currentDisplayedDataset: {
        ...state.currentDisplayedDataset,
        variable_min: action.min,
        variable_max: action.max
      }
    };
  },
  [constants.SET_CURRENT_TIME_ISO]: (state, action) => {
    return ({...state, currentDateTime: action.currentDateTime});
  },
};

// Initial State
export const initialState = {
  currentVisualizedDatasets: [],
  selectedWMSLayerDetails: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  selectedWMSLayerTimesteps: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  currentDisplayedDataset: {
    opacity: 0.8
  },
  selectedDatasetCapabilities: {},
  variablePreferences: {},
  selectedColorPalette: '',
  currentDateTime: '1900-01-01T00:00:00.000Z',
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
