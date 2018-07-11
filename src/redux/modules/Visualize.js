import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';
import { VISUALIZE_SET_MAP_MANIPULATION_MODE } from './../../constants';

// Constants
export const constants = {
  // SYNC
  RESET_VISUALIZE_STATE: 'Visualize.RESET_VISUALIZE_STATE',
  SET_WMS_LAYER: 'Visualize.SET_WMS_LAYER',
  SET_SHAPEFILES: 'Visualize.SET_SHAPEFILES',
  SET_SELECTED_COLOR_PALETTE: 'Visualize.SET_SELECTED_COLOR_PALETTE',
  SET_SELECTED_SHAPEFILE: 'Visualize.SET_SELECTED_SHAPEFILE',
  SET_SELECTED_BASEMAP: 'Visualize.SET_SELECTED_BASEMAP',
  SET_SELECTED_DATASET_LAYER: 'Visualize.SET_SELECTED_DATASET_LAYER',
  SET_SELECTED_DATASET_CAPABILITIES: 'Visualize.SET_SELECTED_DATASET_CAPABILITIES',
  ADD_DATASETS_TO_VISUALIZE: 'Visualize.ADD_DATASETS_TO_VISUALIZE',
  ADD_SEARCH_CRITERIAS_TO_PROJECTS: 'Visualize.ADD_SEARCH_CRITERIAS_TO_PROJECTS',
  ADD_FEATURE_TO_SELECTED_REGIONS: 'Visualize.ADD_FEATURE_TO_SELECTED_REGIONS',
  REMOVE_FEATURE_FROM_SELECTED_REGIONS: 'Visualize.REMOVE_FEATURE_FROM_SELECTED_REGIONS',
  RESET_SELECTED_REGIONS: 'Visualize.RESET_SELECTED_REGIONS',
  REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS: 'Visualize.REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS',
  ADD_DATASETS_TO_PROJECTS: 'Visualize.ADD_DATASETS_TO_PROJECTS',
  CLICK_TOGGLE_PANEL: 'Visualize.CLICK_TOGGLE_PANEL',
  SET_CURRENT_TIME_ISO: 'Visualize.SET_CURRENT_TIME_ISO',
  VISUALIZE_SET_VARIABLE_BOUNDARY_VALUES: 'Visualize.VISUALIZE_SET_VARIABLE_BOUNDARY_VALUE',
  // ASYNC
  FETCH_PLOTLY_DATA_REQUEST: 'Visualize.FETCH_PLOTLY_DATA_REQUEST',
  FETCH_PLOTLY_DATA_FAILURE: 'Visualize.FETCH_PLOTLY_DATA_FAILURE',
  FETCH_PLOTLY_DATA_SUCCESS: 'Visualize.FETCH_PLOTLY_DATA_SUCCESS',
  FETCH_WMS_LAYER_DETAILS_REQUEST: 'Visualize.FETCH_WMS_LAYER_DETAILS_REQUEST',
  FETCH_WMS_LAYER_DETAILS_FAILURE: 'Visualize.FETCH_WMS_LAYER_DETAILS_FAILURE',
  FETCH_WMS_LAYER_DETAILS_SUCCESS: 'Visualize.FETCH_WMS_LAYER_DETAILS_SUCCESS',
  FETCH_WMS_LAYER_TIMESTEPS_REQUEST: 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_REQUEST',
  FETCH_WMS_LAYER_TIMESTEPS_FAILURE: 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_FAILURE',
  FETCH_WMS_LAYER_TIMESTEPS_SUCCESS: 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_SUCCESS',
  FETCH_SCALAR_VALUE_REQUEST: 'Visualize.FETCH_SCALAR_VALUE_REQUEST',
  FETCH_SCALAR_VALUE_FAILURE: 'Visualize.FETCH_SCALAR_VALUE_FAILURE',
  FETCH_SCALAR_VALUE_SUCCESS: 'Visualize.FETCH_SCALAR_VALUE_SUCCESS'
};

// Action Creators
function resetVisualizeState() {
  return {
    type: constants.RESET_VISUALIZE_STATE,
    visualizeInitialState: initialState.visualize
  };
}
function addDatasetsToVisualize (datasets) {
  return {
    type: constants.ADD_DATASETS_TO_VISUALIZE,
    datasets: datasets
  };
}
function setCurrentDateTime (datetime) {
  return {
    type: constants.SET_CURRENT_TIME_ISO,
    currentDateTime: datetime
  };
}
function requestPlotlyData () {
  return {
    type: constants.FETCH_PLOTLY_DATA_REQUEST,
    plotlyData: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
function receivePlotlyDataFailure (error) {
  return {
    type: constants.FETCH_PLOTLY_DATA_FAILURE,
    plotlyData: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function receivePlotlyData (json) {
  let data = json.data;
  let layout = json.layout;
  return {
    type: constants.FETCH_PLOTLY_DATA_SUCCESS,
    plotlyData: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      layout: layout
    }
  };
}
function requestClimateIndicators () {
  return {
    type: constants.FETCH_CLIMATE_INDICATORS_REQUEST,
    climateIndicators: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
function receiveClimateIndicatorsFailure (error) {
  return {
    type: constants.FETCH_CLIMATE_INDICATORS_FAILURE,
    climateIndicators: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function receiveClimateIndicators (items) {
  return {
    type: constants.FETCH_CLIMATE_INDICATORS_SUCCESS,
    climateIndicators: {
      receivedAt: Date.now(),
      isFetching: false,
      items: items
    }
  };
}
function requestScalarValue () {
  return {
    type: constants.FETCH_SCALAR_VALUE_REQUEST,
    currentScalarValue: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
function receiveScalarValueFailure (error) {
  return {
    type: constants.FETCH_SCALAR_VALUE_FAILURE,
    currentScalarValue: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function receiveScalarValue (data) {
  return {
    type: constants.FETCH_SCALAR_VALUE_SUCCESS,
    currentScalarValue: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data
    }
  };
}
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
function setMapManipulationMode (mode) {
  return {
    type: VISUALIZE_SET_MAP_MANIPULATION_MODE,
    mode: mode
  };
}
function setSelectedColorPalette (palette) {
  return {
    type: constants.SET_SELECTED_COLOR_PALETTE,
    palette: palette
  };
}
function restoreInitialSelectedRegions () {
  return {
    type: constants.RESET_SELECTED_REGIONS
  };
}
function addFeatureIdToSelectedRegions (featureId) {
  console.log('about to return the actual action handler');
  return {
    type: constants.ADD_FEATURE_TO_SELECTED_REGIONS,
    featureId: featureId
  };
}
function removeFeatureIdFromSelectedRegions (featureId) {
  return {
    type: constants.REMOVE_FEATURE_FROM_SELECTED_REGIONS,
    featureId: featureId
  };
}
function setSelectedDatasetCapabilities (capabilities) {
  return {
    type: constants.SET_SELECTED_DATASET_CAPABILITIES,
    capabilities: capabilities
  };
}
function setShapefiles (shapefiles) {
  return {
    type: constants.SET_SHAPEFILES,
    publicShapeFiles: shapefiles
  };
}
function setSelectedShapefile (shapefile) {
  return {
    type: constants.SET_SELECTED_SHAPEFILE,
    shapefile: shapefile
  };
}
function setSelectedBasemap (basemap) {
  return {
    type: constants.SET_SELECTED_BASEMAP,
    basemap: basemap
  };
}
function setCurrentDisplayedDataset (layer) {
  return {
    type: constants.SET_SELECTED_DATASET_LAYER,
    layer: layer
  };
}
function setLayer (layer) {
  return {
    type: constants.SET_WMS_LAYER,
    layer: layer
  };
}
function updateVariablePreferenceBoundaries (min, max) {
  return {
    type: constants.VISUALIZE_SET_VARIABLE_BOUNDARY_VALUES,
    min: min,
    max: max
  };
}

export const actions = {
  resetVisualizeState: resetVisualizeState,
  addDatasetsToVisualize: addDatasetsToVisualize,
  setCurrentDateTime: setCurrentDateTime,
  setLayer: setLayer,
  fetchScalarValue: function (opendapUrl, lat, lon, time, variable) {
    return function (dispatch) {
      dispatch(requestScalarValue());
      return myHttp.get(`/wps/getpoint?opendapUrl=${opendapUrl}&lat=${lat}&lon=${lon}&time=${time}&variable=${variable}`)
        .then(response => response.json())
        .then(json => {
          // Removing black magic from application
          json['variable'] = json[variable];
          delete json[variable];
          dispatch(receiveScalarValue(json));
        })
        .catch(error => dispatch(receiveScalarValueFailure(error)));
    };
  },
  fetchPlotlyData: function (
    opendapUrl,
    variableName,
    timeInitialIndice,
    timeFinalIndice,
    spatial1InitialIndice,
    spatial1FinalIndice,
    spatial2InitialIndice,
    spatial2FinalIndice
  ) {
    return function (dispatch) {
      dispatch(requestPlotlyData());
      let url = `/wps/plotly?opendap_url=${opendapUrl}&variable_name=${variableName}&time_initial_indice=${timeInitialIndice}` +
        `&time_final_indice=${timeFinalIndice}&spatial1_initial_indice=${spatial1InitialIndice}` +
        `&spatial1_final_indice=${spatial1FinalIndice}&spatial2_initial_indice=${spatial2InitialIndice}` +
        `&spatial2_final_indice=${spatial2FinalIndice}`;
      return myHttp.get(url)
        .then((response) => {
          console.log('variable name: ', variableName);
          return response.json();
        })
        .then(
          json => {
            dispatch(receivePlotlyData(json));
          },
          err => {
            dispatch(receivePlotlyDataFailure(err));
          }
        );
    };
  },
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
  // TODO: Should just be a single synchronous function
  selectShapefile: function (shapefile) {
    return dispatch => {
      dispatch(setSelectedShapefile(shapefile));
    };
  },
  // TODO: Should just be a single synchronous function
  selectMapManipulationMode: function (mode) {
    return dispatch => {
      dispatch(setMapManipulationMode(mode));
    };
  },
  // TODO: Should just be a single synchronous function
  selectBasemap: function (basemap) {
    return dispatch => {
      dispatch(setSelectedBasemap(basemap));
    };
  },
  // TODO: Should just be a single synchronous function
  selectCurrentDisplayedDataset: function (layer) {
    return dispatch => {
      dispatch(setCurrentDisplayedDataset(layer));
    };
  },
  // TODO: Should just be a single synchronous function
  selectColorPalette: function (palette) {
    return dispatch => {
      dispatch(setSelectedColorPalette(palette));
    };
  },
  setSelectedDatasetCapabilities: setSelectedDatasetCapabilities,
  fetchShapefiles: function () {
    const parser = new ol.format.WMSCapabilities();
    return dispatch => {
      return myHttp.get(`${__PAVICS_GEOSERVER_PATH__}/wms?request=GetCapabilities`)
        .then(response => response.text())
        .then(text => {
          return parser.read(text);
        })
        .then(json => {
          let shapefiles = [];
          json.Capability.Layer.Layer.map(layer => {
            shapefiles.push({
              title: layer.Title,
              wmsUrl: `${__PAVICS_GEOSERVER_PATH__}/wms`,
              wmsParams: {
                LAYERS: layer.Name,
                TILED: true,
                FORMAT: 'image/png'
              }
            });
          });
          dispatch(setShapefiles(shapefiles));
        });
    };
  },
  selectRegion: function (featureId) {
    return dispatch => {
      console.log('about to dispatch select region');
      dispatch(addFeatureIdToSelectedRegions(featureId));
    };
  },
  unselectRegion: function(featureId) {
    return dispatch => {
      dispatch(removeFeatureIdFromSelectedRegions(featureId));
    };
  },
  resetSelectedRegions: function() {
    return dispatch => {
      dispatch(restoreInitialSelectedRegions());
    };
  },
  setVariablePreferenceBoundaries: function (min, max) {
    return dispatch => dispatch(updateVariablePreferenceBoundaries(min, max));
  }
};

// Handlers
const HANDLERS = {
  [constants.RESET_VISUALIZE_STATE]: (state, action) => {
    return {...action.visualizeInitialState};
  },
  [VISUALIZE_SET_MAP_MANIPULATION_MODE]: (state, action) => {
    return {...state, mapManipulationMode: action.mode};
  },
  [constants.ADD_FEATURE_TO_SELECTED_REGIONS]: (state, action) => {
    let copy = state.selectedRegions.concat([action.featureId]);
    return {...state, selectedRegions: copy};
  },
  [constants.REMOVE_FEATURE_FROM_SELECTED_REGIONS]: (state, action) => {
    let copy = state.selectedRegions.slice();
    copy.splice(copy.indexOf(action.featureId), 1);
    console.log('after removing feature:', copy);
    return {...state, selectedRegions: copy};
  },
  [constants.RESET_SELECTED_REGIONS]: (state) => {
    return {...state, selectedRegions: []};
  },
  [constants.SET_WMS_LAYER]: (state, action) => {
    return {...state, layer: action.layer};
  },
  [constants.SET_SHAPEFILES]: (state, action) => {
    return {...state, publicShapeFiles: action.publicShapeFiles};
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
  [constants.SET_SELECTED_SHAPEFILE]: (state, action) => {
    return {...state, selectedShapefile: action.shapefile};
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
  [constants.SET_SELECTED_BASEMAP]: (state, action) => {
    return {...state, selectedBasemap: action.basemap};
  },
  [constants.ADD_SEARCH_CRITERIAS_TO_PROJECTS]: (state, action) => {
    let newSearchCriterias = state.currentProjectSearchCriterias.concat(action.searchCriterias);
    return ({...state, currentProjectSearchCriterias: newSearchCriterias});
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
      variablePreferences: {...state.variablePreferences, [action.layer.variable]: variablePreference},
      selectedColorPalette: variablePreference.colorPalette
    };
  },
  [constants.SET_SELECTED_DATASET_CAPABILITIES]: (state, action) => {
    return {...state, selectedDatasetCapabilities: action.capabilities};
  },
  [constants.ADD_DATASETS_TO_PROJECTS]: (state, action) => {
    let newDatasets = state.currentProjectDatasets.concat(action.datasets);
    return ({...state, currentProjectDatasets: newDatasets});
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
  [constants.SET_CURRENT_TIME_ISO]: (state, action) => {
    return ({...state, currentDateTime: action.currentDateTime});
  },
  [constants.FETCH_PLOTLY_DATA_REQUEST]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [constants.FETCH_PLOTLY_DATA_FAILURE]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [constants.FETCH_PLOTLY_DATA_SUCCESS]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [constants.FETCH_SCALAR_VALUE_REQUEST]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [constants.FETCH_SCALAR_VALUE_FAILURE]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [constants.FETCH_SCALAR_VALUE_SUCCESS]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
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
  }
};

// Reducer
export const initialState = {
  variablePreferences: {},
  mapManipulationMode: constants.VISUALIZE_MODE_GRID_VALUES,
  selectedColorPalette: '',
  selectedShapefile: {},
  selectedBasemap: 'Aerial',
  currentDisplayedDataset: {
    opacity: 0.8
  },
  publicShapeFiles: [],
  baseMaps: [
    'Aerial',
    'Road',
    'AerialWithLabels'
  ],
  layer: {},
  selectedFacets: [],
  selectedRegions: [],
  currentDateTime: '1900-01-01T00:00:00.000Z',
  currentProjectSearchCriterias: [],
  currentProjectDatasets: [],
  currentScalarValue: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  currentVisualizedDatasets: [],
  selectedDatasetCapabilities: {},
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
  plotlyData: {
    isFetching: false,
    receivedAt: null,
    requestedAt: null,
    data: [],
    layout: {},
    error: null
  }
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
