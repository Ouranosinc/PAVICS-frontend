// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'Visualize.COUNTER_INCREMENT';
export const DEFAULT_SELECTED_KEY = 'frequency';
//SYNC
export const SELECT_FACET_KEY = 'Visualize.SELECT_FACET_KEY';
export const SELECT_FACET_VALUE = 'Visualize.SELECT_FACET_VALUE';
export const ADD_FACET_KEY_VALUE_PAIR = 'Visualize.ADD_FACET_KEY_VALUE_PAIR';
export const REMOVE_FACET_KEY_VALUE_PAIR = 'Visualize.REMOVE_FACET_KEY_VALUE_PAIR';
export const OPEN_DATASET_DETAILS = 'Visualize.OPEN_DATASET_DETAILS';
export const CLOSE_DATASET_DETAILS = 'Visualize.CLOSE_DATASET_DETAILS';
export const OPEN_DATASET_WMS_LAYERS = 'Visualize.OPEN_DATASET_WMS_LAYERS';
export const OPEN_WMS_LAYER = 'Visualize.OPEN_WMS_LAYER';
export const SELECT_LOAD_WMS = 'Visualize.SELECT_LOAD_WMS';
export const CLICK_TOGGLE_PANEL = 'Visualize.CLICK_TOGGLE_PANEL';
//ASYNC
export const FETCH_CLIMATE_INDICATORS_REQUEST = 'Visualize.FETCH_CLIMATE_INDICATORS_REQUEST';
export const FETCH_CLIMATE_INDICATORS_FAILURE = 'Visualize.FETCH_CLIMATE_INDICATORS_FAILURE';
export const FETCH_CLIMATE_INDICATORS_SUCCESS = 'Visualize.FETCH_CLIMATE_INDICATORS_SUCCESS';
export const FETCH_FACETS_REQUEST = 'Visualize.FETCH_FACETS_REQUEST';
export const FETCH_FACETS_FAILURE = 'Visualize.FETCH_FACETS_FAILURE';
export const FETCH_FACETS_SUCCESS = 'Visualize.FETCH_FACETS_SUCCESS';
export const FETCH_DATASET_REQUEST = 'Visualize.FETCH_DATASET_REQUEST';
export const FETCH_DATASET_FAILURE = 'Visualize.FETCH_DATASET_FAILURE';
export const FETCH_DATASET_SUCCESS = 'Visualize.FETCH_DATASET_SUCCESS';
export const FETCH_CATALOG_DATASETS_REQUEST = 'Visualize.FETCH_CATALOG_DATASETS_REQUEST';
export const FETCH_CATALOG_DATASETS_FAILURE = 'Visualize.FETCH_CATALOG_DATASETS_FAILURE';
export const FETCH_CATALOG_DATASETS_SUCCESS = 'Visualize.FETCH_CATALOG_DATASETS_SUCCESS';
export const FETCH_DATASET_WMS_LAYERS_REQUEST = 'Visualize.FETCH_DATASET_WMS_LAYERS_REQUEST';
export const FETCH_DATASET_WMS_LAYERS_FAILURE = 'Visualize.FETCH_DATASET_WMS_LAYERS_FAILURE';
export const FETCH_DATASET_WMS_LAYERS_SUCCESS = 'Visualize.FETCH_DATASET_WMS_LAYERS_SUCCESS';
export const FETCH_WMS_LAYER_DETAILS_REQUEST = 'Visualize.FETCH_WMS_LAYER_DETAILS_REQUEST';
export const FETCH_WMS_LAYER_DETAILS_FAILURE = 'Visualize.FETCH_WMS_LAYER_DETAILS_FAILURE';
export const FETCH_WMS_LAYER_DETAILS_SUCCESS = 'Visualize.FETCH_WMS_LAYER_DETAILS_SUCCESS';
// ------------------------------------
// Actions
// ------------------------------------
export function selectFacetKey(key) {
  return {
    type: SELECT_FACET_KEY,
    key: key,
    value: ""
  }
}
export function selectFacetValue(value) {
  return {
    type: SELECT_FACET_VALUE,
    value: value
  }
}
export function addFacetKeyValue(key, value) {
  return {
    type: ADD_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  }
}
export function removeFacetKeyValue(key, value) {
  return {
    type: REMOVE_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  }
}
export function openDatasetDetails(id) {
  return {
    type: OPEN_DATASET_DETAILS,
    id: id
  }
}
export function closeDatasetDetails() {
  return {
    type: OPEN_DATASET_DETAILS
  }
}
export function openDatasetWmsLayers(dataset) {
  return {
    type: OPEN_DATASET_WMS_LAYERS,
    dataset: dataset
  }
}
export function openWmsLayer(layer) {
  return {
    type: OPEN_WMS_LAYER,
    layer: layer
  }
}
export function selectLoadWms(url, name, start, end, style, opacity) {
  return {
    type: SELECT_LOAD_WMS,
    url: url,
    name: name,
    start: start,
    end: end,
    style: style,
    opacity: opacity
  }
}
export function clickTogglePanel(panel, show) {
  return {
    type: CLICK_TOGGLE_PANEL,
    panel: panel,
    show: show
  }
}
export function requestClimateIndicators() {
  return {
    type: FETCH_CLIMATE_INDICATORS_REQUEST,
    climateIndicators: {
      requestedAt: Date.now(),
      isFetching: true,
    },
  };
}
export function receiveClimateIndicatorsFailure(error) {
  return {
    type: FETCH_CLIMATE_INDICATORS_FAILURE,
    climateIndicators: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error,
    },
  };
}
export function receiveClimateIndicators(items) {
  return {
    type: FETCH_CLIMATE_INDICATORS_SUCCESS,
    climateIndicators: {
      receivedAt: Date.now(),
      isFetching: false,
      items: items,
    },
  };
}
export function requestFacets() {
  return {
    type: FETCH_FACETS_REQUEST,
    facets: {
      receivedAt: 1, //TODO: Fix
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
}
export function receiveFacetsFailure(error) {
  return {
    type: FETCH_FACETS_FAILURE,
    facets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  }
}
export function receiveFacets(facets) {
  return {
    type: FETCH_FACETS_SUCCESS,
    facets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: facets,
      error: null
    }
  }
}
export function requestDataset() {
  return {
    type: FETCH_DATASET_REQUEST,
    selectedDatasets: {
      receivedAt: 1, //TODO: Fix
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
}
export function receiveDatasetFailure(error) {
  return {
    type: FETCH_DATASET_FAILURE,
    selectedDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  }
}
export function receiveDataset(dataset) {
  return {
    type: FETCH_DATASET_SUCCESS,
    selectedDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [dataset],
      error: null
    }
  }
}
export function requestCatalogDatasets() {
  return {
    type: FETCH_CATALOG_DATASETS_REQUEST,
    datasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
}
export function receiveCatalogDatasetsFailure(error) {
  return {
    type: FETCH_CATALOG_DATASETS_FAILURE,
    datasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  }
}
export function receiveCatalogDatasets(datasets) {
  return {
    type: FETCH_CATALOG_DATASETS_SUCCESS,
    datasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  }
}
export function requestDatasetWMSLayers() {
  return {
    type: FETCH_DATASET_WMS_LAYERS_REQUEST,
    selectedWMSLayers: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
}
export function receiveDatasetWMSLayersFailure(error) {
  return {
    type: FETCH_DATASET_WMS_LAYERS_FAILURE,
    selectedWMSLayers: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  }
}
export function receiveDatasetWMSLayers(layers) {
  return {
    type: FETCH_DATASET_WMS_LAYERS_SUCCESS,
    selectedWMSLayers: {
      receivedAt: Date.now(),
      isFetching: false,
      items: layers,
      error: null
    }
  }
}
export function requestWMSLayerDetails(layer, url) {
  return {
    type: FETCH_WMS_LAYER_DETAILS_REQUEST,
    selectedWMSLayer: {
      requestedAt: Date.now(),
      layer: layer,
      wmsUrl: url,
      isFetching: true,
      data: {}
    }
  }
}
export function receiveWMSLayerDetailsFailure(error) {
  return {
    type: FETCH_WMS_LAYER_DETAILS_FAILURE,
    selectedWMSLayer: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  }
}
export function receiveWMSLayerDetails(data) {
  return {
    type: FETCH_WMS_LAYER_DETAILS_SUCCESS,
    selectedWMSLayer: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  }
}
//ASYNC
export function fetchClimateIndicators() {
  return function (dispatch) {
    dispatch(requestClimateIndicators());
    return fetch("/api/climate_indicators")
      .then(response => response.json())
      .then(json => dispatch(receiveClimateIndicators(json)))
      .catch(error => dispatch(receiveClimateIndicatorsFailure(error)));
  }
}
export function fetchFacets() {
  return function (dispatch) {
    dispatch(requestFacets());
    return fetch("/api/facets")
      .then(response => response.json())
      .then(json =>dispatch(receiveFacets(json)))
      .catch(error =>dispatch(receiveFacetsFailure(error)));
  }
}
export function fetchDataset(url) {
  return function (dispatch) {
    dispatch(requestDataset());
    return fetch(`/api/dataset?url=${url}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDataset(json))
      )
    //TODO FIX THIS HAPPEN FOR NO REASON
    /*.catch(error =>
     dispatch(receiveDatasetFailure(error))
     )*/
  }
}
export function fetchCatalogDatasets() {
  return function (dispatch, getState) {
    dispatch(requestCatalogDatasets());
    //Get current added facets by querying store
    let facets = getState().visualize.selectedFacets;
    let constraints = "";
    facets.forEach(function (facet, i) {
      constraints += `${(i > 0) ? "," : ""}${facet.key}:${facet.value}`;
    });
    console.log(getState().visualize);
    return fetch(`/api/datasets?constraints=${constraints}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveCatalogDatasets(json))
      )
      .catch(error =>
        dispatch(receiveCatalogDatasetsFailure(error))
      )
  }
}
export function fetchDatasetWMSLayers(url, dataset) {
  return function (dispatch) {
    dispatch(requestDatasetWMSLayers());
    dataset = "outputs/ouranos/subdaily/aet/pcp/aet_pcp_1970.nc"; //TODO, Dynamically use datasetid
    return fetch(`/api/wms/dataset/layers?url=${url}&dataset=${dataset}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDatasetWMSLayers(json))
      )
      .catch(error =>
        dispatch(receiveDatasetWMSLayersFailure(error))
      )
  }
}
export function fetchWMSLayerDetails(url, layer) {
  return function (dispatch) {
    dispatch(requestWMSLayerDetails());
    return fetch(`${url}?request=GetMetadata&item=layerDetails&layerName=${layer}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWMSLayerDetails(json))
      )
      .catch(error =>
        dispatch(receiveWMSLayerDetailsFailure(error))
      )
  }
}
//MERGE
/* The implementation for this will merge an update into the old state,
 *  where the first two entries are put in one List, and the rest in the new version of entries:
 */
/*export function next(state) {
 const entries = state.get('entries').concat(getWinners(state.get('vote')));
 return state.merge({
 vote: Map({pair: entries.take(2)}),
 entries: entries.skip(2)
 });
 }*/

//UPDATEIN
/* Using updateIn makes this pleasingly succinct.
 *  What the code expresses is "reach into the nested data structure path ['vote', 'tally', 'Trainspotting'],
 *  and apply this function there. If there are keys missing along the path, create new Maps in their place.
 *  If the value at the end is missing, initialize it with 0".
 */
/*export function vote(state, entry) {
 return state.updateIn(
 ['vote', 'tally', entry],
 0,
 tally => tally + 1
 );
 }*/
export const actions = {
  //Sync Panels
  clickTogglePanel,
  //Sync Facets
  selectFacetKey,
  selectFacetValue,
  addFacetKeyValue,
  removeFacetKeyValue,
  requestFacets,
  receiveFacetsFailure,
  receiveFacets,
  requestClimateIndicators,
  receiveClimateIndicatorsFailure,
  receiveClimateIndicators,
  //Sync Datasets
  openDatasetDetails,
  closeDatasetDetails,
  requestDataset,
  receiveDatasetFailure,
  receiveDataset,
  requestCatalogDatasets,
  receiveCatalogDatasetsFailure,
  receiveCatalogDatasets,
  openDatasetWmsLayers,
  openWmsLayer,
  selectLoadWms,
  //Async
  fetchFacets,
  fetchDataset,
  fetchCatalogDatasets,
  fetchDatasetWMSLayers,
  fetchWMSLayerDetails,
  fetchClimateIndicators,
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SELECT_FACET_KEY]: (state, action) => {
    return ({...state, currentSelectedKey: action.key, currentSelectedValue: action.value});
  },
  [SELECT_FACET_VALUE]: (state, action) => {
    return ({...state, currentSelectedValue: action.value});
  },
  [ADD_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let facets = state.selectedFacets.concat({key: action.key, value: action.value});
    facets.sort(function (a, b) {
      if (a.key + a.value < b.key + b.value)
        return -1;
      if (a.key + a.value > b.key + b.value)
        return 1;
      return 0;
    });
    return ({...state, selectedFacets: facets});
  },
  [REMOVE_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let selectedFacets = state.selectedFacets.slice();
    let index = selectedFacets.findIndex(x => x.key === action.key && x.value === action.value);
    if (index > -1) selectedFacets.splice(index, 1);
    return ({...state, selectedFacets: selectedFacets});
  },
  [OPEN_DATASET_DETAILS]: (state, action) => {
    return ({...state, currentOpenedDataset: action.id});
  },
  [CLOSE_DATASET_DETAILS]: (state) => {
    return ({...state, currentOpenedDataset: ""});
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
  [CLICK_TOGGLE_PANEL]: (state, action) => {
    let panelControls = JSON.parse(JSON.stringify(state.panelControls)); //TODO: deepcopy With Immutable.js or something like that
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
  [FETCH_CLIMATE_INDICATORS_REQUEST]: (state, action) => {
    return ({...state, climateIndicators: Object.assign({}, state.climateIndicators, action.climateIndicators)});
  },
  [FETCH_CLIMATE_INDICATORS_FAILURE]: (state, action) => {
    return ({...state, climateIndicators: Object.assign({}, state.climateIndicators, action.climateIndicators)});
  },
  [FETCH_CLIMATE_INDICATORS_SUCCESS]: (state, action) => {
    return ({...state, climateIndicators: Object.assign({}, state.climateIndicators, action.climateIndicators)});
  },
  [FETCH_CATALOG_DATASETS_REQUEST]: (state, action) => {
    return ({...state, datasets: action.datasets});
  },
  [FETCH_CATALOG_DATASETS_FAILURE]: (state, action) => {
    return ({...state, datasets: action.datasets});
  },
  [FETCH_CATALOG_DATASETS_SUCCESS]: (state, action) => {
    return ({...state, datasets: action.datasets});
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
    return ({...state, selectedWMSLayer: action.selectedWMSLayer});
  },
  [FETCH_WMS_LAYER_DETAILS_FAILURE]: (state, action) => {
    return ({...state, selectedWMSLayer: action.selectedWMSLayer});
  },
  [FETCH_WMS_LAYER_DETAILS_SUCCESS]: (state, action) => {
    return ({...state, selectedWMSLayer: action.selectedWMSLayer});
  }
};
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentSelectedKey: DEFAULT_SELECTED_KEY,
  currentSelectedValue: "",
  currentOpenedDataset: "",
  currentOpenedDatasetWMSFile: "",
  currentOpenedWMSLayer: "",
  loadedWmsDatasets: [],
  selectedFacets: [],
  selectedDatasets: { //One only ==> Details
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  selectedWMSLayers: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  selectedWMSLayer: {
    layerDetails: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      data: {},
      error: null
    },
    timesteps: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      data: {},
      error: null
    }
  },
  facets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  climateIndicators: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  datasets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  panelControls: {
    SearchCatalog: {
      show: true
    },
    DatasetDetails: {
      show: false
    },
    DatasetWMSLayers: {
      show: false
    },
    ClimateVariablesList: {
      show: true
    }
  }
};
export default function visualizeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state
}
