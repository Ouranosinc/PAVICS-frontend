import myHttp from './../../../lib/http';

// Constants
export const constants = {
  CREATE_RESEARCH_REQUEST: 'RESEARCH.CREATE_RESEARCH_REQUEST',
  CREATE_RESEARCH_FAILURE: 'RESEARCH.CREATE_RESEARCH_FAILURE',
  CREATE_RESEARCH_SUCCESS: 'RESEARCH.CREATE_RESEARCH_SUCCESS',
  ADD_FACET_KEY_VALUE_PAIR: 'RESEARCH.ADD_FACET_KEY_VALUE_PAIR',
  REMOVE_FACET_KEY_VALUE_PAIR: 'RESEARCH.REMOVE_FACET_KEY_VALUE_PAIR',
  REMOVE_ALL_FACET_KEY_VALUE: 'RESEARCH.REMOVE_ALL_FACET_KEY_VALUE',
  FETCH_FACETS_REQUEST: 'RESEARCH.FETCH_FACETS_REQUEST',
  FETCH_FACETS_FAILURE: 'RESEARCH.FETCH_FACETS_FAILURE',
  FETCH_FACETS_SUCCESS: 'RESEARCH.FETCH_FACETS_SUCCESS',
  FETCH_PAVICS_DATASETS_REQUEST: 'RESEARCH.FETCH_PAVICS_DATASETS_REQUEST',
  FETCH_PAVICS_DATASETS_FAILURE: 'RESEARCH.FETCH_PAVICS_DATASETS_FAILURE',
  FETCH_PAVICS_DATASETS_SUCCESS: 'RESEARCH.FETCH_PAVICS_DATASETS_SUCCESS',
  RESTORE_PAVICS_DATASETS: 'RESEARCH.RESTORE_PAVICS_DATASETS'
};

// Actions
function fetchFacetsrequest () {
  return {
    type: constants.FETCH_FACETS_REQUEST,
    facets: {
      receivedAt: 1, // TODO: Fix
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
function fetchFacetsSuccess (facets) {
  return {
    type: constants.FETCH_FACETS_SUCCESS,
    facets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: facets,
      error: null
    }
  };
}
function fetchFacetsFailure (error) {
  return {
    type: constants.FETCH_FACETS_FAILURE,
    facets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function restorePavicsDatasets (searchCriteria) {
  return {
    type: constants.RESTORE_PAVICS_DATASETS,
    pavicsDatasets: {
      requestedAt: searchCriteria.createdOn,
      receivedAt: searchCriteria.createdOn,
      isFetching: false,
      items: searchCriteria.results
    }
  };
}
function requestPavicsDatasets () {
  return {
    type: constants.FETCH_PAVICS_DATASETS_REQUEST,
    pavicsDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receivePavicsDatasetsFailure (error) {
  return {
    type: constants.FETCH_PAVICS_DATASETS_FAILURE,
    pavicsDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receivePavicsDatasets (datasets) {
  return {
    type: constants.FETCH_PAVICS_DATASETS_SUCCESS,
    pavicsDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  };
}

// Returns dataset results AND facet counts
export function fetchPavicsDatasets (type = 'Aggregate', limit = 10000) {
  return function (dispatch, getState) {
    dispatch(requestPavicsDatasets());
    // Get current added facets by querying store
    let facets = getState().research.selectedFacets;
    let constraints = '';
    facets.forEach(function (facet, i) {
      constraints += `${(i > 0) ? ',' : ''}${facet.key}:${facet.value}`;
    });
    if(!constraints.length) limit = 0; // If no facets selected, we attend to have no dataset result

    return myHttp(`/wps/pavicsearch?limit=${limit}&type=${type}&constraints=${constraints}`)
      .then(response => response.json())
      .then(json => {
        // Dataset result
        let datasets = json.response.docs;
        datasets.sort((a, b) => a.dataset_id.localeCompare(b.dataset_id));
        dispatch(receivePavicsDatasets(datasets));

        // Facet result
        let facets = [];
        json['responseHeader']['params']['facet.field'].forEach(function (key) {
          facets.push({
            key: key,
            values: []//
          });
        });
        var facetFields = json['facet_counts']['facet_fields'];
        for (var facetKey in facetFields) {
          if (facetFields.hasOwnProperty(facetKey)) {
            let values = [];
            let keyIndex = facets.findIndex(x => x.key === facetKey);
            for(let i = 0; i < facetFields[facetKey].length; i = i + 2) {
              var thisValue = {
                value: facetFields[facetKey][i],
                count: facetFields[facetKey][i+1],
              };
              values.push(thisValue);
            }
            values.sort((a, b) => a.value.localeCompare(b.value));
            facets[keyIndex].values = values;
          }
        }
        dispatch(fetchFacetsSuccess(facets));

      })
      /*.catch(error =>
        dispatch(receivePavicsDatasetsFailure(error))
      );*/
  };
}
function requestEsgfDatasets () {
  return {
    type: constants.FETCH_ESGF_DATASETS_REQUEST,
    esgfDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
function receiveEsgfDatasetsFailure (error) {
  return {
    type: constants.FETCH_ESGF_DATASETS_FAILURE,
    esgfDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
function receiveEsgfDatasets (datasets) {
  return {
    type: constants.FETCH_ESGF_DATASETS_SUCCESS,
    esgfDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  };
}
// EXTERNAL ESGF CATALOG
function fetchEsgfDatasets () {
  return function (dispatch, getState) {
    dispatch(requestEsgfDatasets());
    // Get current added facets by querying store
    let facets = getState().research.selectedFacets;
    let constraints = '';
    facets.forEach(function (facet, i) {
      constraints += `${(i > 0) ? ',' : ''}${facet.key}:${facet.value}`;
    });
    return myHttp.get(`/api/datasets/esgf?constraints=${constraints}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveEsgfDatasets(json))
      )
      .catch(error =>
        dispatch(receiveEsgfDatasetsFailure(error))
      );
  };
}

function fetchFacets () {
  return function (dispatch) {
    dispatch(fetchFacetsrequest());
    return myHttp.get('/api/facets')
      .then(response => response.json())
      .then(json => dispatch(fetchFacetsSuccess(json)))
      .catch(error => dispatch(fetchFacetsFailure(error)));
  };
}
function addFacetKeyValuePair (key, value) {
  return {
    type: constants.ADD_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  };
}
function removeFacetKeyValuePair (key, value) {
  return {
    type: constants.REMOVE_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  };
}
function clearFacetKeyValuePairs () {
  return {
    type: constants.REMOVE_ALL_FACET_KEY_VALUE
  };
}

// Exported Action Creators
export const actions = {
  fetchFacets,
  fetchPavicsDatasets,
  restorePavicsDatasets,
  addFacetKeyValuePair,
  removeFacetKeyValuePair,
  clearFacetKeyValuePairs
};

// Handlers
const HANDLERS = {
  [constants.FETCH_FACETS_REQUEST]: (state, action) => {
    return ({...state, facets: action.facets});
  },
  [constants.FETCH_FACETS_SUCCESS]: (state, action) => {
    return ({...state, facets: action.facets});
  },
  [constants.FETCH_FACETS_FAILURE]: (state, action) => {
    return ({...state, facets: action.facets});
  },
  [constants.ADD_FACET_KEY_VALUE_PAIR]: (state, action) => {
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
  [constants.REMOVE_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let selectedFacets = state.selectedFacets.slice();
    let index = selectedFacets.findIndex(x => x.key === action.key && x.value === action.value);
    if (index > -1) {
      selectedFacets.splice(index, 1);
    }
    return ({...state, selectedFacets: selectedFacets});
  },
  [constants.REMOVE_ALL_FACET_KEY_VALUE]: (state, action) => {
    return ({...state, selectedFacets: []});
  },
  [constants.FETCH_ESGF_DATASETS_REQUEST]: (state, action) => {
    return ({...state, esgfDatasets: action.esgfDatasets});
  },
  [constants.FETCH_ESGF_DATASETS_FAILURE]: (state, action) => {
    return ({...state, esgfDatasets: action.esgfDatasets});
  },
  [constants.FETCH_ESGF_DATASETS_SUCCESS]: (state, action) => {
    return ({...state, esgfDatasets: action.esgfDatasets});
  },
  [constants.FETCH_PAVICS_DATASETS_REQUEST]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [constants.FETCH_PAVICS_DATASETS_FAILURE]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [constants.FETCH_PAVICS_DATASETS_SUCCESS]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [constants.RESTORE_PAVICS_DATASETS]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  }
};

// Reducer
const initialState = {
  selectedFacets: [],
  facets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  selectedDataset: { // NOT USED
    receivedAt: null,
    requestedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  esgfDatasets: { // NOT USED
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  pavicsDatasets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  }
};
export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
