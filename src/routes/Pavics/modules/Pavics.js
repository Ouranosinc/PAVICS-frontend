import initialState from './../../../store/initialState';
import * as constants from './../../../constants';
import ol from 'openlayers';

// SYNC
const SET_WMS_LAYER = 'Visualize.SET_WMS_LAYER';
const SET_SHAPEFILES = 'Visualize.SET_SHAPEFILES';
const SET_SELECTED_COLOR_PALETTE = 'Visualize.SET_SELECTED_COLOR_PALETTE';
const SET_SELECTED_SHAPEFILE = 'Visualize.SET_SELECTED_SHAPEFILE';
const SET_SELECTED_BASEMAP = 'Visualize.SET_SELECTED_BASEMAP';
const SET_SELECTED_DATASET_LAYER = 'Visualize.SET_SELECTED_DATASET_LAYER';
const SET_SELECTED_DATASET_CAPABILITIES = 'Visualize.SET_SELECTED_DATASET_CAPABILITIES';
const ADD_DATASET_LAYERS_TO_VISUALIZE = 'Visualize.ADD_DATASET_LAYERS_TO_VISUALIZE';
const ADD_SEARCH_CRITERIAS_TO_PROJECTS = 'Visualize.ADD_SEARCH_CRITERIAS_TO_PROJECTS';
const ADD_FEATURE_TO_SELECTED_REGIONS = 'Visualize.ADD_FEATURE_TO_SELECTED_REGIONS';
const REMOVE_FEATURE_FROM_SELECTED_REGIONS = 'Visualize.REMOVE_FEATURE_FROM_SELECTED_REGIONS';
const RESET_SELECTED_REGIONS = 'Visualize.RESET_SELECTED_REGIONS';
const REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS = 'Visualize.REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS';
const ADD_DATASETS_TO_PROJECTS = 'Visualize.ADD_DATASETS_TO_PROJECTS';
const CLICK_TOGGLE_PANEL = 'Visualize.CLICK_TOGGLE_PANEL';
const SET_CURRENT_TIME_ISO = 'Visualize.SET_CURRENT_TIME_ISO';
// ASYNC
const FETCH_WORKFLOWS_REQUEST = 'WorkflowWizard.FETCH_WORKFLOWS_REQUEST';
const FETCH_WORKFLOWS_FAILURE = 'WorkflowWizard.FETCH_WORKFLOWS_FAILURE';
const FETCH_WORKFLOWS_SUCCESS = 'WorkflowWizard.FETCH_WORKFLOWS_SUCCESS';
const SAVE_WORKFLOW_REQUEST = 'WorkflowWizard.SAVE_WORKFLOW_REQUEST';
const SAVE_WORKFLOW_FAILURE = 'WorkflowWizard.SAVE_WORKFLOW_FAILURE';
const SAVE_WORKFLOW_SUCCESS = 'WorkflowWizard.SAVE_WORKFLOW_SUCCESS';
const DELETE_WORKFLOW_REQUEST = 'WorkflowWizard.DELETE_WORKFLOW_REQUEST';
const DELETE_WORKFLOW_FAILURE = 'WorkflowWizard.DELETE_WORKFLOW_FAILURE';
const DELETE_WORKFLOW_SUCCESS = 'WorkflowWizard.DELETE_WORKFLOW_SUCCESS';
const FETCH_PLOTLY_DATA_REQUEST = 'Visualize.FETCH_PLOTLY_DATA_REQUEST';
const FETCH_PLOTLY_DATA_FAILURE = 'Visualize.FETCH_PLOTLY_DATA_FAILURE';
const FETCH_PLOTLY_DATA_SUCCESS = 'Visualize.FETCH_PLOTLY_DATA_SUCCESS';
const FETCH_CLIMATE_INDICATORS_REQUEST = 'Visualize.FETCH_CLIMATE_INDICATORS_REQUEST';
const FETCH_CLIMATE_INDICATORS_FAILURE = 'Visualize.FETCH_CLIMATE_INDICATORS_FAILURE';
const FETCH_CLIMATE_INDICATORS_SUCCESS = 'Visualize.FETCH_CLIMATE_INDICATORS_SUCCESS';
const FETCH_WMS_LAYER_DETAILS_REQUEST = 'Visualize.FETCH_WMS_LAYER_DETAILS_REQUEST';
const FETCH_WMS_LAYER_DETAILS_FAILURE = 'Visualize.FETCH_WMS_LAYER_DETAILS_FAILURE';
const FETCH_WMS_LAYER_DETAILS_SUCCESS = 'Visualize.FETCH_WMS_LAYER_DETAILS_SUCCESS';
const FETCH_WMS_LAYER_TIMESTEPS_REQUEST = 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_REQUEST';
const FETCH_WMS_LAYER_TIMESTEPS_FAILURE = 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_FAILURE';
const FETCH_WMS_LAYER_TIMESTEPS_SUCCESS = 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_SUCCESS';
const FETCH_WPS_JOBS_REQUEST = 'Visualize.FETCH_WPS_JOBS_REQUEST';
const FETCH_WPS_JOBS_FAILURE = 'Visualize.FETCH_WPS_JOBS_FAILURE';
const FETCH_WPS_JOBS_SUCCESS = 'Visualize.FETCH_WPS_JOBS_SUCCESS';
const FETCH_SCALAR_VALUE_REQUEST = 'Visualize.FETCH_SCALAR_VALUE_REQUEST';
const FETCH_SCALAR_VALUE_FAILURE = 'Visualize.FETCH_SCALAR_VALUE_FAILURE';
const FETCH_SCALAR_VALUE_SUCCESS = 'Visualize.FETCH_SCALAR_VALUE_SUCCESS';
// ------------------------------------
// Actions
// ------------------------------------
export function addSearchCriteriasToProject (searchCriterias) {
  return {
    type: ADD_SEARCH_CRITERIAS_TO_PROJECTS,
    searchCriterias: searchCriterias
  };
}
export function removeSearchCriteriasFromProject (searchCriteria) {
  return {
    type: REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS,
    searchCriteria: searchCriteria
  };
}
export function addDatasetsToProject (datasets) {
  return {
    type: ADD_DATASETS_TO_PROJECTS,
    datasets: datasets
  };
}
export function addDatasetLayersToVisualize (datasets) {
  return {
    type: ADD_DATASET_LAYERS_TO_VISUALIZE,
    datasets: datasets
  };
}
export function clickTogglePanel (panel, show) {
  return {
    type: CLICK_TOGGLE_PANEL,
    panel: panel,
    show: show
  };
}
export function setCurrentDateTime (datetime) {
  return {
    type: SET_CURRENT_TIME_ISO,
    currentDateTime: datetime
  };
}
export function requestPlotlyData () {
  return {
    type: FETCH_PLOTLY_DATA_REQUEST,
    plotlyData: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
export function receivePlotlyDataFailure (error) {
  return {
    type: FETCH_PLOTLY_DATA_FAILURE,
    plotlyData: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
export function receivePlotlyData (json) {
  let data = json.data;
  let layout = json.layout;
  return {
    type: FETCH_PLOTLY_DATA_SUCCESS,
    plotlyData: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      layout: layout
    }
  };
}
export function requestClimateIndicators () {
  return {
    type: FETCH_CLIMATE_INDICATORS_REQUEST,
    climateIndicators: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
export function receiveClimateIndicatorsFailure (error) {
  return {
    type: FETCH_CLIMATE_INDICATORS_FAILURE,
    climateIndicators: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
export function receiveClimateIndicators (items) {
  return {
    type: FETCH_CLIMATE_INDICATORS_SUCCESS,
    climateIndicators: {
      receivedAt: Date.now(),
      isFetching: false,
      items: items
    }
  };
}
export function requestScalarValue () {
  return {
    type: FETCH_SCALAR_VALUE_REQUEST,
    currentScalarValue: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
export function receiveScalarValueFailure (error) {
  return {
    type: FETCH_SCALAR_VALUE_FAILURE,
    currentScalarValue: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
export function receiveScalarValue (data) {
  return {
    type: FETCH_SCALAR_VALUE_SUCCESS,
    currentScalarValue: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data
    }
  };
}
export function requestWMSLayerDetails (layer, url) {
  return {
    type: FETCH_WMS_LAYER_DETAILS_REQUEST,
    selectedWMSLayerDetails: {
      requestedAt: Date.now(),
      layer: layer,
      wmsUrl: url,
      isFetching: true,
      data: {}
    }
  };
}
export function receiveWMSLayerDetailsFailure (error) {
  return {
    type: FETCH_WMS_LAYER_DETAILS_FAILURE,
    selectedWMSLayerDetails: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}
export function receiveWMSLayerDetails (data) {
  return {
    type: FETCH_WMS_LAYER_DETAILS_SUCCESS,
    selectedWMSLayerDetails: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  };
}
export function requestWMSLayerTimesteps (layer, url, day) {
  return {
    type: FETCH_WMS_LAYER_TIMESTEPS_REQUEST,
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
function saveWorkflowRequest () {
  return {
    type: SAVE_WORKFLOW_REQUEST
  };
}
function saveWorkflowSuccess () {
  return {
    type: SAVE_WORKFLOW_SUCCESS
  };
}
function saveWorkflowFailure () {
  return {
    type: SAVE_WORKFLOW_FAILURE
  };
}
export function saveWorkflow (json) {
  return dispatch => {
    dispatch(saveWorkflowRequest());
    let workflow = {
      json: json
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let request = new Request(
      __LOOPBACK_API_PATH__ + '/workflows',
      {
        method: 'POST',
        body: JSON.stringify(workflow),
        headers: headers
      }
    );
    fetch(request)
      .then(res => res.json(), err => console.log(err))
      .then(
        () => {
          dispatch(saveWorkflowSuccess());
          dispatch(fetchWorkflows());
        },
        err => dispatch(saveWorkflowFailure())
      );
  };
}
function fetchWorkflowsRequest () {
  return {
    type: FETCH_WORKFLOWS_REQUEST
  };
}
function fetchWorkflowsSuccess (workflows) {
  return {
    type: FETCH_WORKFLOWS_SUCCESS,
    items: workflows
  };
}
function fetchWorkflowsFailure () {
  return {
    type: FETCH_WORKFLOWS_FAILURE
  };
}
export function fetchWorkflows () {
  return dispatch => {
    dispatch(fetchWorkflowsRequest());
    fetch(__LOOPBACK_API_PATH__+'/workflows')
      .then(res => res.json(), err => console.log(err))
      .then(
        json => dispatch(fetchWorkflowsSuccess(json)),
        err => {
          console.log(err);
          dispatch(fetchWorkflowsFailure())
        }
      );
  };
}
function deleteWorkflowRequest () {
  return {
    type: DELETE_WORKFLOW_REQUEST
  };
}
function deleteWorkflowSuccess () {
  return {
    type: DELETE_WORKFLOW_SUCCESS
  };
}
function deleteWorkflowFailure () {
  return {
    type: DELETE_WORKFLOW_FAILURE
  };
}
export function deleteWorkflow (id) {
  return dispatch => {
    dispatch(deleteWorkflowRequest());
    let request = new Request(
      __LOOPBACK_API_PATH__+'/Workflows/'+id,
      {
        method: 'DELETE'
      }
    );
    fetch(request)
      .then(
        () => {
          dispatch(deleteWorkflowSuccess());
          dispatch(fetchWorkflows());
        },
        err => {
          console.log(err);
          dispatch(deleteWorkflowFailure());
        }
      );
  };
}
export function receiveWMSLayerTimestepsFailure (error) {
  return {
    type: FETCH_WMS_LAYER_TIMESTEPS_FAILURE,
    selectedWMSLayerTimesteps: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}
export function receiveWMSLayerTimesteps (data) {
  return {
    type: FETCH_WMS_LAYER_TIMESTEPS_SUCCESS,
    selectedWMSLayerTimesteps: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  };
}

export function requestWPSJobs () {
  return {
    type: FETCH_WPS_JOBS_REQUEST,
    jobs: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receiveWPSJobsFailure (error) {
  return {
    type: FETCH_WPS_JOBS_FAILURE,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receiveWPSJobs (jobs) {
  return {
    type: FETCH_WPS_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: jobs,
      error: null
    }
  };
}
// ASYNC
export function fetchScalarValue (opendapUrl, lat, lon, time, variable) {
  return function (dispatch) {
    dispatch(requestScalarValue());
    return fetch(`/wps/getpoint?opendapUrl=${opendapUrl}&lat=${lat}&lon=${lon}&time=${time}&variable=${variable}`)
      .then(response => response.json())
      .then(json => {
        // Removing black magic from application
        json['variable'] = json[variable];
        delete json[variable];
        dispatch(receiveScalarValue(json));
      })
      .catch(error => dispatch(receiveScalarValueFailure(error)));
  };
}
export function fetchClimateIndicators () {
  return function (dispatch) {
    dispatch(requestClimateIndicators());
    return fetch('/api/climate_indicators')
      .then(response => response.json())
      .then(json => dispatch(receiveClimateIndicators(json)))
      .catch(error => dispatch(receiveClimateIndicatorsFailure(error)));
  };
}
export function fetchPlotlyData (
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
    return fetch(url)
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
}
export function fetchWMSLayerDetails (url, layer) {
  return function (dispatch) {
    dispatch(requestWMSLayerDetails());
    return fetch(`${url}?request=GetMetadata&item=layerDetails&layerName=${layer}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWMSLayerDetails(json))
      )
      .catch(error =>
        dispatch(receiveWMSLayerDetailsFailure(error))
      );
  };
}
export function fetchWMSLayerTimesteps (url, layer, day) {
  return function (dispatch) {
    dispatch(requestWMSLayerTimesteps());
    return fetch(`${url}?request=GetMetadata&item=timesteps&day=${day}&layerName=${layer}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWMSLayerTimesteps(json))
      );
    // TODO FIX THIS HAPPEN FOR NO REASON
    /* .catch(error => {
     console.log(error);
     dispatch(receiveWMSLayerTimestepsFailure(error));
     }); */
  };
}
function setSelectedProcess (process) {
  // TODO remove the boilerplate when api provides the identifier
  // TODO uplicated in WpsProviderSelector to make executing easier
  let processIdentifier;
  if (process.identifier) {
    processIdentifier = process.identifier;
  } else {
    let param = process.url.slice('process=');
    let bits = param.split('=');
    processIdentifier = bits.slice(-1)[0];
  }
  process = Object.assign(process, {
    identifier: processIdentifier
  });
  return {
    type: constants.WORKFLOW_CHOOSE_PROCESS,
    process: process
  };
}
function setJobs (jobs) {
  return {
    type: constants.MONITOR_SET_JOBS,
    jobs: jobs
  };
}
function setProcesses (processes) {
  return {
    type: constants.WORKFLOW_SET_PROCESSES,
    processes: processes
  };
}
function setProviders (providers) {
  providers.map(provider => {
    provider.identifier = provider.url.replace('/processes/list?wps=', '');
  });
  return {
    type: constants.WORKFLOW_SET_PROVIDERS,
    items: providers
  };
}
function setWpsProvider (provider) {
  return {
    type: constants.WORKFLOW_SET_WPS_PROVIDER,
    provider: provider
  };
}
export function setProcessInputs (inputs) {
  return {
    type: constants.WORKFLOW_SET_ACTIVE_PROCESS_INPUTS,
    inputs: inputs
  };
}
function setSelectedProcessValues (key, value) {
  return {
    type: constants.WORKFLOW_SET_ACTIVE_PROCESS_VALUES,
    key: key,
    value: value
  };
}
function setSection (section) {
  return {
    type: constants.PLATFORM_SET_SECTION,
    section: section
  };
}
export function chooseStep (step) {
  return {
    type: constants.WORKFLOW_CHANGE_STEP,
    step: step
  };
}
export function getFirstStep () {
  return {
    type: constants.WORKFLOW_GET_FIRST_STEP
  };
}
export function getLastStep () {
  return {
    type: constants.WORKFLOW_GET_LAST_STEP
  };
}
export function getNextStep () {
  return {
    type: constants.WORKFLOW_GET_NEXT_STEP
  };
}
export function selectShapefile (shapefile) {
  return dispatch => {
    dispatch(setSelectedShapefile(shapefile));
  };
}
function setMapManipulationMode (mode) {
  return {
    type: constants.VISUALIZE_SET_MAP_MANIPULATION_MODE,
    mode: mode
  };
}
export function selectMapManipulationMode (mode) {
  return dispatch => {
    dispatch(setMapManipulationMode(mode));
  };
}
export function selectBasemap (basemap) {
  return dispatch => {
    dispatch(setSelectedBasemap(basemap));
  };
}
export function selectDatasetLayer (layer) {
  return dispatch => {
    dispatch(setSelectedDatasetLayer(layer));
  };
}
function setSelectedColorPalette(palette) {
  return {
    type: SET_SELECTED_COLOR_PALETTE,
    palette: palette
  };
}
export function selectColorPalette (palette) {
  return dispatch => {
    dispatch(setSelectedColorPalette(palette));
  };
}
export function receivedDatasetCapabilities (capabilities) {
  return dispatch => {
    dispatch(setSelectedDatasetCapabilities(capabilities));
  };
}
export function fetchShapefiles () {
  const parser = new ol.format.WMSCapabilities();
  return dispatch => {
    return fetch(`${__PAVICS_GEOSERVER_PATH__}/wms?request=GetCapabilities`)
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
}
function restoreInitialSelectedRegions () {
  return {
    type: RESET_SELECTED_REGIONS
  };
}
function addFeatureIdToSelectedRegions (featureId) {
  console.log('about to return the actual action handler');
  return {
    type: ADD_FEATURE_TO_SELECTED_REGIONS,
    featureId: featureId
  };
}
function removeFeatureIdFromSelectedRegions (featureId) {
  return {
    type: REMOVE_FEATURE_FROM_SELECTED_REGIONS,
    featureId: featureId
  };
}
export function selectRegion (featureId) {
  return dispatch => {
    console.log('about to dispatch select region');
    dispatch(addFeatureIdToSelectedRegions(featureId));
  };
}
export function unselectRegion (featureId) {
  return dispatch => {
    dispatch(removeFeatureIdFromSelectedRegions(featureId));
  };
}
export function resetSelectedRegions () {
  return dispatch => {
    dispatch(restoreInitialSelectedRegions());
  };
}
export function setSelectedDatasetCapabilities (capabilities) {
  return {
    type: SET_SELECTED_DATASET_CAPABILITIES,
    capabilities: capabilities
  };
}
function setShapefiles (shapefiles) {
  return {
    type: SET_SHAPEFILES,
    publicShapeFiles: shapefiles
  };
}
function setSelectedShapefile (shapefile) {
  return {
    type: SET_SELECTED_SHAPEFILE,
    shapefile: shapefile
  };
}
function setSelectedBasemap (basemap) {
  return {
    type: SET_SELECTED_BASEMAP,
    basemap: basemap
  };
}
function setSelectedDatasetLayer (layer) {
  return {
    type: SET_SELECTED_DATASET_LAYER,
    layer: layer
  };
}
function setLayer (layer) {
  return {
    type: SET_WMS_LAYER,
    layer: layer
  };
}
export function fetchVisualizableData (statusLocation) {
  return dispatch => {
    return fetch(`/api/wms/visualizableData?status=${statusLocation}`)
      .then(response => response.json())
      .then(json => dispatch(setLayer(json)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function goToSection (section) {
  return dispatch => dispatch(setSection(section));
}
export function handleSelectedProcessValueChange (key, value) {
  return dispatch => {
    dispatch(setSelectedProcessValues(key, value));
  };
}
export function fetchProcessInputs (provider, process) {
  return dispatch => {
    return fetch(`/phoenix/inputs?provider=${provider}&process=${process}`)
      .then(response => response.json())
      .then(json => {
        dispatch(setProcessInputs(json.inputs));
      })
      .catch(err => {
        console.log(err);
      });
  };
}
export function selectWpsProvider (provider) {
  return dispatch => {
    dispatch(setWpsProvider(provider));
    dispatch(getNextStep());
    dispatch(fetchProcesses(provider));
  };
}
export function chooseProcess (process) {
  return (dispatch) => {
    dispatch(setSelectedProcess(process));
    dispatch(getNextStep());
  };
}
export function fetchWPSJobs () {
  return function (dispatch) {
    dispatch(requestWPSJobs());
    return fetch('/phoenix/jobs')
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWPSJobs(json.jobs))
      )
      .catch(error => {
        console.log(error);
        dispatch(receiveWPSJobsFailure(error));
      });
  };
}
export function fetchProcesses (provider) {
  return (dispatch) => {
    return fetch(`/phoenix/processesList?provider=${provider}`)
      .then(response => response.json())
      .then(json => dispatch(setProcesses(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function fetchProviders () {
  return (dispatch) => {
    return fetch('/phoenix/processes')
      .then(response => response.json())
      .then(json => dispatch(setProviders(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function executeProcess (provider, process, inputValues) {
  return () => {
    console.log(inputValues);
    let array = [];
    for (let key in inputValues) {
      if (inputValues.hasOwnProperty(key)) {
        array.push(encodeURIComponent(key) + '=' + encodeURIComponent(inputValues[key]));
      }
    }
    let string = array.join(';');
    return fetch(`/phoenix/execute?wps=${provider}&process=${process}&inputs=${string}`)
      .then(response => {
        console.log('received:', response);
      })
      .catch(error => {
        console.log('problem', error);
      });
  };
}
const WORKFLOW_WIZARD_HANDLERS = {
  [FETCH_WORKFLOWS_REQUEST]: (state) => {
    return {...state, workflows: {...state.workflows, isFetching: true}};
  },
  [FETCH_WORKFLOWS_SUCCESS]: (state, action) => {
    return {...state, workflows: {...state.workflows, isFetching: false, items: action.items}};
  },
  [FETCH_WORKFLOWS_FAILURE]: (state) => {
    return {...state, workflows: {...state.workflows, isFetching: false}};
  },
  [SAVE_WORKFLOW_REQUEST]: (state) => {
    return {...state, workflows: {...state.workflows, isSaving: true}};
  },
  [SAVE_WORKFLOW_SUCCESS]: (state) => {
    return {...state, workflows: {...state.workflows, isSaving: false}};
  },
  [SAVE_WORKFLOW_FAILURE]: (state) => {
    return {...state, workflows: {...state.workflows, isSaving: false}};
  },
  [DELETE_WORKFLOW_REQUEST]: (state) => {
    return {...state, workflows: {...state.workflows, isDeleting: true}};
  },
  [DELETE_WORKFLOW_SUCCESS]: (state) => {
    return {...state, workflows: {...state.workflows, isDeleting: false}};
  },
  [DELETE_WORKFLOW_FAILURE]: (state) => {
    return {...state, workflows: {...state.workflows, isDeleting: false}};
  },
  [constants.WORKFLOW_SET_WPS_PROVIDER]: (state, action) => {
    return {...state, selectedProvider: action.provider};
  },
  [constants.WORKFLOW_CHOOSE_PROCESS]: (state, action) => {
    return {...state, selectedProcess: action.process};
  },
  [constants.WORKFLOW_SET_ACTIVE_PROCESS_INPUTS]: (state, action) => {
    return {...state, selectedProcessInputs: action.inputs};
  },
  [constants.WORKFLOW_SET_ACTIVE_PROCESS_VALUES]: (state, action) => {
    return Object.assign({}, state, {
      selectedProcessValues: Object.assign({}, state.selectedProcessValues, {
        [action.key]: action.value
      })
    });
  },
  [constants.WORKFLOW_CHANGE_STEP]: (state, action) => {
    return {...state, currentStep: action.step};
  },
  [constants.WORKFLOW_GET_FIRST_STEP]: (state) => {
    return {...state, stepIndex: 0};
  },
  [constants.WORKFLOW_GET_LAST_STEP]: (state) => {
    return {...state, stepIndex: (state.stepIndex - 1)};
  },
  [constants.WORKFLOW_GET_NEXT_STEP]: (state) => {
    return {...state, stepIndex: (state.stepIndex + 1)};
  },
  [constants.WORKFLOW_SET_PROCESSES]: (state, action) => {
    return {...state, processes: action.processes};
  },
  [constants.WORKFLOW_SET_PROVIDERS]: (state, action) => {
    return Object.assign({}, state, {
      providers: {...state.providers, items: action.items}
    });
  }
};
const VISUALIZE_HANDLERS = {
  [constants.VISUALIZE_SET_MAP_MANIPULATION_MODE]: (state, action) => {
    return {...state, mapManipulationMode: action.mode};
  },
  [ADD_FEATURE_TO_SELECTED_REGIONS]: (state, action) => {
    let copy = state.selectedRegions.concat([action.featureId]);
    return {...state, selectedRegions: copy};
  },
  [REMOVE_FEATURE_FROM_SELECTED_REGIONS]: (state, action) => {
    let copy = state.selectedRegions.slice();
    copy.splice(copy.indexOf(action.featureId), 1);
    console.log('after removing feature:', copy);
    return {...state, selectedRegions: copy};
  },
  [RESET_SELECTED_REGIONS]: (state) => {
    return {...state, selectedRegions: []};
  },
  [SET_WMS_LAYER]: (state, action) => {
    return {...state, layer: action.layer};
  },
  [SET_SHAPEFILES]: (state, action) => {
    return {...state, publicShapeFiles: action.publicShapeFiles};
  },
  [SET_SELECTED_COLOR_PALETTE]: (state, action) => {
    return {...state, selectedColorPalette: action.palette};
  },
  [SET_SELECTED_SHAPEFILE]: (state, action) => {
    return {...state, selectedShapefile: action.shapefile};
  },
  [SET_SELECTED_BASEMAP]: (state, action) => {
    return {...state, selectedBasemap: action.basemap};
  },
  [ADD_SEARCH_CRITERIAS_TO_PROJECTS]: (state, action) => {
    let newSearchCriterias = state.currentProjectSearchCriterias.concat(action.searchCriterias);
    return ({...state, currentProjectSearchCriterias: newSearchCriterias});
  },
  [REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS]: (state, action) => {
    let newSearchCriterias = state.currentProjectSearchCriterias.slice();
    let index = state.currentProjectSearchCriterias.findIndex(x => x === action.searchCriteria);
    newSearchCriterias.splice(index, 1);
    return ({...state, currentProjectSearchCriterias: newSearchCriterias});
  },
  [SET_SELECTED_DATASET_LAYER]: (state, action) => {
    return {...state, selectedDatasetLayer: action.layer};
  },
  [SET_SELECTED_DATASET_CAPABILITIES]: (state, action) => {
    return {...state, selectedDatasetCapabilities: action.capabilities};
  },
  [ADD_DATASETS_TO_PROJECTS]: (state, action) => {
    let newDatasets = state.currentProjectDatasets.concat(action.datasets);
    return ({...state, currentProjectDatasets: newDatasets});
  },
  [ADD_DATASET_LAYERS_TO_VISUALIZE]: (state, action) => {
    let newDatasetLayers = state.currentVisualizedDatasetLayers.concat(action.datasets);
    return ({...state, currentVisualizedDatasetLayers: newDatasetLayers});
  },
  [SET_CURRENT_TIME_ISO]: (state, action) => {
    return ({...state, currentDateTime: action.currentDateTime});
  },
  [CLICK_TOGGLE_PANEL]: (state, action) => {
    // TODO: deepcopy With Immutable.js or something like that
    let panelControls = JSON.parse(JSON.stringify(state.panelControls));
    panelControls[action.panel].show = action.show;
    return ({...state, panelControls: panelControls});
  },
  [FETCH_PLOTLY_DATA_REQUEST]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [FETCH_PLOTLY_DATA_FAILURE]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [FETCH_PLOTLY_DATA_SUCCESS]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [FETCH_CLIMATE_INDICATORS_REQUEST]: (state, action) => {
    return ({...state, climateIndicators: Object.assign({}, state.climateIndicators, action.climateIndicators)});
  },
  [FETCH_CLIMATE_INDICATORS_FAILURE]: (state, action) => {
    return ({...state, climateIndicators: Object.assign({}, state.climateIndicators, action.climateIndicators)});
  },
  [FETCH_CLIMATE_INDICATORS_SUCCESS]: (state, action) => {
    return ({...state, climateIndicators: Object.assign({}, state.climateIndicators, action.climateIndicators)});
  },
  [FETCH_SCALAR_VALUE_REQUEST]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [FETCH_SCALAR_VALUE_FAILURE]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [FETCH_SCALAR_VALUE_SUCCESS]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [FETCH_WMS_LAYER_DETAILS_REQUEST]: (state, action) => {
    return ({...state, selectedWMSLayerDetails: action.selectedWMSLayerDetails});
  },
  [FETCH_WMS_LAYER_DETAILS_FAILURE]: (state, action) => {
    return ({...state, selectedWMSLayerDetails: action.selectedWMSLayerDetails});
  },
  [FETCH_WMS_LAYER_DETAILS_SUCCESS]: (state, action) => {
    return ({...state, selectedWMSLayerDetails: action.selectedWMSLayerDetails});
  },
  [FETCH_WMS_LAYER_TIMESTEPS_REQUEST]: (state, action) => {
    return ({...state, selectedWMSLayerTimesteps: action.selectedWMSLayerTimesteps});
  },
  [FETCH_WMS_LAYER_TIMESTEPS_FAILURE]: (state, action) => {
    return ({...state, selectedWMSLayerTimesteps: action.selectedWMSLayerTimesteps});
  },
  [FETCH_WMS_LAYER_TIMESTEPS_SUCCESS]: (state, action) => {
    return ({...state, selectedWMSLayerTimesteps: action.selectedWMSLayerTimesteps});
  }
};
const PLATFORM_HANDLERS = {
  [constants.PLATFORM_SET_SECTION]: (state, action) => {
    return {...state, section: action.section};
  }
};
const MONITOR_HANDLERS = {
  [FETCH_WPS_JOBS_REQUEST]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
  [FETCH_WPS_JOBS_FAILURE]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
  [FETCH_WPS_JOBS_SUCCESS]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
};
function workflowWizardReducer (state, action) {
  const handler = WORKFLOW_WIZARD_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
function platformReducer (state, action) {
  const handler = PLATFORM_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
function monitorReducer (state, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
function visualizeReducer (state, action) {
  const handler = VISUALIZE_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
function pavicsReducer (state = initialState, action) {
  return {
    workflowWizard: workflowWizardReducer(state.workflowWizard, action),
    platform: platformReducer(state.platform, action),
    monitor: monitorReducer(state.monitor, action),
    visualize: visualizeReducer(state.visualize, action)
  };
}
export default pavicsReducer;
