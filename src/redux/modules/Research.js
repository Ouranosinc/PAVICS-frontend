import myHttp from '../../util/http';
import { actions as processActions } from './Process';

// Constants
export const constants = {
  ADD_FACET_KEY_VALUE_PAIR: 'RESEARCH.ADD_FACET_KEY_VALUE_PAIR',
  REMOVE_FACET_KEY_VALUE_PAIR: 'RESEARCH.REMOVE_FACET_KEY_VALUE_PAIR',
  REMOVE_ALL_FACET_KEY_VALUE: 'RESEARCH.REMOVE_ALL_FACET_KEY_VALUE',
  FETCH_FACETS_REQUEST: 'RESEARCH.FETCH_FACETS_REQUEST',
  FETCH_FACETS_FAILURE: 'RESEARCH.FETCH_FACETS_FAILURE',
  FETCH_FACETS_SUCCESS: 'RESEARCH.FETCH_FACETS_SUCCESS',
  FETCH_PAVICS_DATASETS_FACETS_REQUEST: 'RESEARCH.FETCH_PAVICS_DATASETS_FACETS_REQUEST',
  FETCH_PAVICS_DATASETS_FACETS_FAILURE: 'RESEARCH.FETCH_PAVICS_DATASETS_FACETS_FAILURE',
  FETCH_PAVICS_DATASETS_FACETS_SUCCESS: 'RESEARCH.FETCH_PAVICS_DATASETS_FACETS_SUCCESS',
  RESTORE_PAVICS_DATASETS: 'RESEARCH.RESTORE_PAVICS_DATASETS'
};

// Actions
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
function requestPavicsDatasetsAndFacets () {
  return {
    type: constants.FETCH_PAVICS_DATASETS_FACETS_REQUEST,
    pavicsDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
export function receivePavicsDatasetsAndFacetsFailure (error) {
  // NotificationManager.error(JSON.stringify(error));
  return {
    type: constants.FETCH_PAVICS_DATASETS_FACETS_FAILURE,
    pavicsDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function receivepavicsDatasetsAndFacets (datasets, facets) {
  // PROROTYPE TODO get facets and datasets from json
  // alert(JSON.stringify(json));
  return {
    type: constants.FETCH_PAVICS_DATASETS_FACETS_SUCCESS,
    facets: facets,
    pavicsDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  };
}

// Returns dataset results AND facet counts
export function fetchPavicsDatasetsAndFacets (type = 'Aggregate', limit = 10000) {
  return function (dispatch, getState) {
    // Get current added facets by querying store
    let facets = getState().research.selectedFacets;
    let constraints = '';
    facets.forEach(function (facet, i) {
      constraints += `${(i > 0) ? ',' : ''}${facet.key}:${facet.value}`;
    });
    if(!constraints.length) limit = 0; // If no facets selected, we attend to have no dataset result

    // PROTOTYPE: Calling twitcher API instead of pywps web interface
    // Using duck middleware Process.js
    /*let inputs = {
      inputs: [
        {
          id: 'constraints',
          type: 'string',
          value: constraints
        },
        {
          id: 'type',
          type: 'string',
          value: type
        },
        {
          id: 'limit',
          type: 'integer',
          value: limit
        },
        {
          id: 'distrib',
          type: 'boolean',
          value: true
        }
      ]
    };
    // TODO: From environment variables
    dispatch(processActions.executeProcess('catalog', 'pavicsearch', inputs,
      requestPavicsDatasetsAndFacets, receivepavicsDatasetsAndFacets, receivePavicsDatasetsAndFacetsFailure));*/

    dispatch(requestPavicsDatasetsAndFacets());

    //https://hirondelle.crim.ca/twitcher/ows/proxy/catalog/pywps?service=WPS&request=execute&version=1.0.0&identifier=pavicsearch&DataInputs=limit=0;facets=*;type=Aggregate;distrib=true
    return myHttp.get(`/wps/pavicsearch?limit=${limit}&type=${type}&constraints=${constraints}`)
      .then(response => response.json())
      .then(json => {
        // Dataset result
        let datasets = json.response.docs;
        datasets.sort((a, b) => a.dataset_id.localeCompare(b.dataset_id));
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
        dispatch(receivepavicsDatasetsAndFacets(datasets, facets));

      })
      .catch(error =>
        dispatch(receivePavicsDatasetsAndFacetsFailure(error))
      );
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
  fetchPavicsDatasetsAndFacets,
  restorePavicsDatasets,
  addFacetKeyValuePair,
  removeFacetKeyValuePair,
  clearFacetKeyValuePairs
};

// Handlers
const HANDLERS = {
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
  [constants.FETCH_PAVICS_DATASETS_FACETS_REQUEST]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [constants.FETCH_PAVICS_DATASETS_FACETS_FAILURE]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  },
  [constants.FETCH_PAVICS_DATASETS_FACETS_SUCCESS]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets, facets: action.facets});
  },
  [constants.RESTORE_PAVICS_DATASETS]: (state, action) => {
    return ({...state, pavicsDatasets: action.pavicsDatasets});
  }
};

// Reducer
export const initialState = {
  selectedFacets: [],
  facets: [],
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
