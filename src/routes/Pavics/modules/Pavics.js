import initialState from './../../../store/initialState';
import * as constants from './../../../constants';
import ol from 'openlayers';
// SYNC
const SET_WMS_LAYER = 'Visualize.SET_WMS_LAYER';
const SET_SHAPEFILES = 'Visualize.SET_SHAPEFILES';
const SET_SELECTED_SHAPEFILE = 'Visualize.SET_SELECTED_SHAPEFILE';
const SET_SELECTED_BASEMAP = 'Visualize.SET_SELECTED_BASEMAP';
const SET_SELECTED_DATASET_LAYER = 'Visualize.SET_SELECTED_DATASET_LAYER';
const SET_SELECTED_DATASET_CAPABILITIES = 'Visualize.SET_SELECTED_DATASET_CAPABILITIES';
const ADD_DATASET_LAYERS_TO_VISUALIZE = 'Visualize.ADD_DATASET_LAYERS_TO_VISUALIZE';
const ADD_SEARCH_CRITERIAS_TO_PROJECTS = 'Visualize.ADD_SEARCH_CRITERIAS_TO_PROJECTS';
const REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS = 'Visualize.REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS'
const ADD_DATASETS_TO_PROJECTS = 'Visualize.ADD_DATASETS_TO_PROJECTS';
const ADD_FACET_KEY_VALUE_PAIR = 'Visualize.ADD_FACET_KEY_VALUE_PAIR';
const REMOVE_FACET_KEY_VALUE_PAIR = 'Visualize.REMOVE_FACET_KEY_VALUE_PAIR';
const REMOVE_ALL_FACET_KEY_VALUE = 'Visualize.REMOVE_ALL_FACET_KEY_VALUE';
const OPEN_DATASET_DETAILS = 'Visualize.OPEN_DATASET_DETAILS';
const CLOSE_DATASET_DETAILS = 'Visualize.CLOSE_DATASET_DETAILS';
const OPEN_DATASET_WMS_LAYERS = 'Visualize.OPEN_DATASET_WMS_LAYERS';
const OPEN_WMS_LAYER = 'Visualize.OPEN_WMS_LAYER';
const SELECT_LOAD_WMS = 'Visualize.SELECT_LOAD_WMS';
const CLICK_TOGGLE_PANEL = 'Visualize.CLICK_TOGGLE_PANEL';
const SET_CURRENT_TIME_ISO = 'Visualize.SET_CURRENT_TIME_ISO';
const RESTORE_PAVICS_DATASETS = 'Visualize.RESTORE_PAVICS_DATASETS';
// ASYNC
const FETCH_PLOTLY_DATA_REQUEST = 'Visualize.FETCH_PLOTLY_DATA_REQUEST';
const FETCH_PLOTLY_DATA_FAILURE = 'Visualize.FETCH_PLOTLY_DATA_FAILURE';
const FETCH_PLOTLY_DATA_SUCCESS = 'Visualize.FETCH_PLOTLY_DATA_SUCCESS';
const FETCH_CLIMATE_INDICATORS_REQUEST = 'Visualize.FETCH_CLIMATE_INDICATORS_REQUEST';
const FETCH_CLIMATE_INDICATORS_FAILURE = 'Visualize.FETCH_CLIMATE_INDICATORS_FAILURE';
const FETCH_CLIMATE_INDICATORS_SUCCESS = 'Visualize.FETCH_CLIMATE_INDICATORS_SUCCESS';
const FETCH_FACETS_REQUEST = 'Visualize.FETCH_FACETS_REQUEST';
const FETCH_FACETS_FAILURE = 'Visualize.FETCH_FACETS_FAILURE';
const FETCH_FACETS_SUCCESS = 'Visualize.FETCH_FACETS_SUCCESS';
const FETCH_DATASET_REQUEST = 'Visualize.FETCH_DATASET_REQUEST';
const FETCH_DATASET_FAILURE = 'Visualize.FETCH_DATASET_FAILURE';
const FETCH_DATASET_SUCCESS = 'Visualize.FETCH_DATASET_SUCCESS';
const FETCH_ESGF_DATASETS_REQUEST = 'Visualize.FETCH_ESGF_DATASETS_REQUEST';
const FETCH_ESGF_DATASETS_FAILURE = 'Visualize.FETCH_ESGF_DATASETS_FAILURE';
const FETCH_ESGF_DATASETS_SUCCESS = 'Visualize.FETCH_ESGF_DATASETS_SUCCESS';
const FETCH_PAVICS_DATASETS_REQUEST = 'Visualize.FETCH_PAVICS_DATASETS_REQUEST';
const FETCH_PAVICS_DATASETS_FAILURE = 'Visualize.FETCH_PAVICS_DATASETS_FAILURE';
const FETCH_PAVICS_DATASETS_SUCCESS = 'Visualize.FETCH_PAVICS_DATASETS_SUCCESS';
const FETCH_DATASET_WMS_LAYERS_REQUEST = 'Visualize.FETCH_DATASET_WMS_LAYERS_REQUEST';
const FETCH_DATASET_WMS_LAYERS_FAILURE = 'Visualize.FETCH_DATASET_WMS_LAYERS_FAILURE';
const FETCH_DATASET_WMS_LAYERS_SUCCESS = 'Visualize.FETCH_DATASET_WMS_LAYERS_SUCCESS';
const FETCH_WMS_LAYER_DETAILS_REQUEST = 'Visualize.FETCH_WMS_LAYER_DETAILS_REQUEST';
const FETCH_WMS_LAYER_DETAILS_FAILURE = 'Visualize.FETCH_WMS_LAYER_DETAILS_FAILURE';
const FETCH_WMS_LAYER_DETAILS_SUCCESS = 'Visualize.FETCH_WMS_LAYER_DETAILS_SUCCESS';
const FETCH_WMS_LAYER_TIMESTEPS_REQUEST = 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_REQUEST';
const FETCH_WMS_LAYER_TIMESTEPS_FAILURE = 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_FAILURE';
const FETCH_WMS_LAYER_TIMESTEPS_SUCCESS = 'Visualize.FETCH_WMS_LAYER_TIMESTEPS_SUCCESS';
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
export function addFacetKeyValue (key, value) {
  return {
    type: ADD_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  };
}
export function removeFacetKeyValue (key, value) {
  return {
    type: REMOVE_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  };
}
export function removeAllFacetKeyValue () {
  return {
    type: REMOVE_ALL_FACET_KEY_VALUE
  };
}
export function openDatasetDetails (id) {
  return {
    type: OPEN_DATASET_DETAILS,
    id: id
  };
}
export function closeDatasetDetails () {
  return {
    type: OPEN_DATASET_DETAILS
  };
}
export function openDatasetWmsLayers (dataset) {
  return {
    type: OPEN_DATASET_WMS_LAYERS,
    dataset: dataset
  };
}
export function openWmsLayer (layer) {
  return {
    type: OPEN_WMS_LAYER,
    layer: layer
  };
}
export function selectLoadWms (url, name, start, end, style, opacity) {
  return {
    type: SELECT_LOAD_WMS,
    url: url,
    name: name,
    start: start,
    end: end,
    style: style,
    opacity: opacity
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
export function requestFacets () {
  return {
    type: FETCH_FACETS_REQUEST,
    facets: {
      receivedAt: 1, // TODO: Fix
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receiveFacetsFailure (error) {
  return {
    type: FETCH_FACETS_FAILURE,
    facets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receiveFacets (facets) {
  return {
    type: FETCH_FACETS_SUCCESS,
    facets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: facets,
      error: null
    }
  };
}
export function requestDataset () {
  return {
    type: FETCH_DATASET_REQUEST,
    selectedDatasets: {
      receivedAt: 1, // TODO: Fix
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receiveDatasetFailure (error) {
  return {
    type: FETCH_DATASET_FAILURE,
    selectedDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receiveDataset (dataset) {
  return {
    type: FETCH_DATASET_SUCCESS,
    selectedDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [dataset],
      error: null
    }
  };
}
export function restorePavicsDatasets (searchCriteria) {
  return {
    type: RESTORE_PAVICS_DATASETS,
    pavicsDatasets: {
      requestedAt: searchCriteria.date,
      receivedAt: searchCriteria.date,
      archive: true,
      isFetching: false,
      items: searchCriteria.results
    }
  };
}
export function requestPavicsDatasets () {
  return {
    type: FETCH_PAVICS_DATASETS_REQUEST,
    pavicsDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      archive: false,
      items: []
    }
  };
}
export function receivePavicsDatasetsFailure (error) {
  return {
    type: FETCH_PAVICS_DATASETS_FAILURE,
    pavicsDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      archive: false,
      items: [],
      error: error
    }
  };
}
export function receivePavicsDatasets (datasets) {
  return {
    type: FETCH_PAVICS_DATASETS_SUCCESS,
    pavicsDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      archive: false,
      items: datasets,
      error: null
    }
  };
}
export function requestEsgfDatasets () {
  return {
    type: FETCH_ESGF_DATASETS_REQUEST,
    esgfDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receiveEsgfDatasetsFailure (error) {
  return {
    type: FETCH_ESGF_DATASETS_FAILURE,
    esgfDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receiveEsgfDatasets (datasets) {
  return {
    type: FETCH_ESGF_DATASETS_SUCCESS,
    esgfDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  };
}
export function requestDatasetWMSLayers () {
  return {
    type: FETCH_DATASET_WMS_LAYERS_REQUEST,
    selectedWMSLayers: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receiveDatasetWMSLayersFailure (error) {
  return {
    type: FETCH_DATASET_WMS_LAYERS_FAILURE,
    selectedWMSLayers: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receiveDatasetWMSLayers (layers) {
  return {
    type: FETCH_DATASET_WMS_LAYERS_SUCCESS,
    selectedWMSLayers: {
      receivedAt: Date.now(),
      isFetching: false,
      items: layers,
      error: null
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
// ASYNC
export function fetchClimateIndicators () {
  return function (dispatch) {
    dispatch(requestClimateIndicators());
    return fetch('/api/climate_indicators')
      .then(response => response.json())
      .then(json => dispatch(receiveClimateIndicators(json)))
      .catch(error => dispatch(receiveClimateIndicatorsFailure(error)));
  };
}
export function fetchFacets () {
  return function (dispatch) {
    dispatch(requestFacets());
    return fetch('/api/facets')
      .then(response => response.json())
      .then(json => dispatch(receiveFacets(json)))
      .catch(error => dispatch(receiveFacetsFailure(error)));
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
export function fetchDataset (url) {
  return function (dispatch) {
    dispatch(requestDataset());
    return fetch(`/api/dataset?url=${url}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDataset(json))
      );
    // TODO FIX THIS HAPPEN FOR NO REASON
    /* .catch(error =>
     dispatch(receiveDatasetFailure(error))
     ) */
  };
}
// OUR PAVICS DATASETS CATALOG 2.0
export function fetchPavicsDatasets () {
  return function (dispatch, getState) {
    dispatch(requestPavicsDatasets());
    // Get current added facets by querying store
    let facets = getState().pavics.visualize.selectedFacets;
    let constraints = '';
    facets.forEach(function (facet, i) {
      constraints += `${(i > 0) ? ',' : ''}${facet.key}:${facet.value}`;
    });
    console.log(getState().visualize);
    return fetch(`/api/datasets/pavics?constraints=${constraints}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receivePavicsDatasets(json))
      )
      .catch(error =>
        dispatch(receivePavicsDatasetsFailure(error))
      );
  };
}
// EXTERNAL ESGF CATALOG
export function fetchEsgfDatasets () {
  return function (dispatch, getState) {
    dispatch(requestEsgfDatasets());
    // Get current added facets by querying store
    let facets = getState().pavics.visualize.selectedFacets;
    let constraints = '';
    facets.forEach(function (facet, i) {
      constraints += `${(i > 0) ? ',' : ''}${facet.key}:${facet.value}`;
    });
    console.log(getState().visualize);
    return fetch(`/api/datasets/esgf?constraints=${constraints}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveEsgfDatasets(json))
      )
      .catch(error =>
        dispatch(receiveEsgfDatasetsFailure(error))
      );
  };
}
export function fetchDatasetWMSLayers (url, dataset) {
  return function (dispatch) {
    dispatch(requestDatasetWMSLayers());
    // dataset = 'outputs/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc'; // TODO, Dynamically use datasetid
    return fetch(`/api/wms/dataset/layers?url=${url}&dataset=${dataset}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDatasetWMSLayers(json))
      )
      .catch(error =>
        dispatch(receiveDatasetWMSLayersFailure(error))
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
function setProcessInputs (inputs) {
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
export function fetchJobs () {
  return (dispatch) => {
    return fetch('/phoenix/jobs')
      .then(response => response.json())
      .then(json => dispatch(setJobs(json.jobs)))
      .catch(err => {
        console.log(err);
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
  [SET_WMS_LAYER]: (state, action) => {
    return {...state, layer: action.layer};
  },
  [SET_SHAPEFILES]: (state, action) => {
    return {...state, publicShapeFiles: action.publicShapeFiles};
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
  [ADD_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let facets = state.selectedFacets.concat({key: action.key, value: action.value});
    facets.sort(function (a, b) {
      if (a.key + a.value < b.key + b.value) {
        return -1;
      }
      if (a.key + a.value > b.key + b.value) {
        return 1;
      }
      return 0;
    });
    return ({...state, selectedFacets: facets});
  },
  [REMOVE_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let selectedFacets = state.selectedFacets.slice();
    let index = selectedFacets.findIndex(x => x.key === action.key && x.value === action.value);
    if (index > -1) {
      selectedFacets.splice(index, 1);
    }
    return ({...state, selectedFacets: selectedFacets});
  },
  [REMOVE_ALL_FACET_KEY_VALUE]: (state, action) => {
    return ({...state, selectedFacets: []});
  },
  [OPEN_DATASET_DETAILS]: (state, action) => {
    return ({...state, currentOpenedDataset: action.id});
  },
  [CLOSE_DATASET_DETAILS]: (state) => {
    return ({...state, currentOpenedDataset: ''});
  },
  [OPEN_DATASET_WMS_LAYERS]: (state, action) => {
    return ({...state, currentOpenedDatasetWMSFile: action.dataset});
  },
  [OPEN_WMS_LAYER]: (state, action) => {
    return ({...state, currentOpenedWMSLayer: action.layer});
  },
  [SELECT_LOAD_WMS]: (state, action) => {
    return ({
      ...state, loadedWmsDatasets: state.loadedWmsDatasets.concat({
        url: action.url,
        name: action.name,
        start: action.start,
        end: action.end,
        style: action.style,
        opacity: action.opacity
      })
    });
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
  [FETCH_DATASET_REQUEST]: (state, action) => {
    return ({...state, selectedDatasets: action.selectedDatasets});
  },
  [FETCH_DATASET_FAILURE]: (state, action) => {
    return ({...state, selectedDatasets: action.selectedDatasets});
  },
  [FETCH_DATASET_SUCCESS]: (state, action) => {
    return ({...state, selectedDatasets: action.selectedDatasets});
  },
  [FETCH_FACETS_REQUEST]: (state, action) => {
    return ({...state, facets: action.facets});
  },
  [FETCH_FACETS_FAILURE]: (state, action) => {
    return ({...state, facets: action.facets});
  },
  [FETCH_FACETS_SUCCESS]: (state, action) => {
    return ({...state, facets: action.facets});
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
  [FETCH_ESGF_DATASETS_REQUEST]: (state, action) => {
    return ({...state, esgfDatasets: action.esgfDatasets});
  },
  [FETCH_ESGF_DATASETS_FAILURE]: (state, action) => {
    return ({...state, esgfDatasets: action.esgfDatasets});
  },
  [FETCH_ESGF_DATASETS_SUCCESS]: (state, action) => {
    return ({...state, esgfDatasets: action.esgfDatasets});
  },
  [FETCH_PAVICS_DATASETS_REQUEST]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [FETCH_PAVICS_DATASETS_FAILURE]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [RESTORE_PAVICS_DATASETS]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [FETCH_PAVICS_DATASETS_SUCCESS]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [FETCH_DATASET_WMS_LAYERS_REQUEST]: (state, action) => {
    return ({...state, selectedWMSLayers: action.selectedWMSLayers});
  },
  [FETCH_DATASET_WMS_LAYERS_FAILURE]: (state, action) => {
    return ({...state, selectedWMSLayers: action.selectedWMSLayers});
  },
  [FETCH_DATASET_WMS_LAYERS_SUCCESS]: (state, action) => {
    return ({...state, selectedWMSLayers: action.selectedWMSLayers});
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
  [constants.MONITOR_SET_JOBS]: (state, action) => {
    return {...state, jobs: action.jobs};
  }
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
