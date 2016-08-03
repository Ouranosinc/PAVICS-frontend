// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'Visualize.COUNTER_INCREMENT';
//SYNC
export const SELECT_FACET_KEY = 'Visualize.SELECT_FACET_KEY';
export const SELECT_FACET_VALUE = 'Visualize.SELECT_FACET_VALUE';
export const ADD_FACET_KEY_VALUE_PAIR = 'Visualize.ADD_FACET_KEY_VALUE_PAIR';
export const REMOVE_FACET_KEY_VALUE_PAIR = 'Visualize.REMOVE_FACET_KEY_VALUE_PAIR';

//ASYNC
export const FETCH_FACETS_REQUEST = 'Visualize.FETCH_FACETS_REQUEST';
export const FETCH_FACETS_FAILURE = 'Visualize.FETCH_FACETS_FAILURE';
export const FETCH_FACETS_SUCCESS = 'Visualize.FETCH_FACETS_SUCCESS';
export const FETCH_DATASETS_REQUEST = 'Visualize.FETCH_DATASETS_REQUEST';
export const FETCH_DATASETS_FAILURE = 'Visualize.FETCH_DATASETS_FAILURE';
export const FETCH_DATASETS_SUCCESS = 'Visualize.FETCH_DATASETS_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
export function selectFacetKey (key) {
  return {
    type: SELECT_FACET_KEY,
    key: key,
    value: ""
  }
}

export function selectFacetValue (value) {
  return {
    type: SELECT_FACET_VALUE,
    value: value
  }
}

export function addFacetKeyValue (key, value) {
  return {
    type: ADD_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  }
}

export function removeFacetKeyValue (key, value) {
  return {
    type: REMOVE_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  }
}

export function requestFacets () {
  return {
    type: FETCH_FACETS_REQUEST,
    facets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
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
  }
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
  }
}

export function requestDatasets () {
  return {
    type: FETCH_DATASETS_REQUEST,
    datasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
}

export function receiveDatasetsFailure (error) {
  return {
    type: FETCH_DATASETS_FAILURE,
    datasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  }
}

export function receiveDatasets (datasets) {
  return {
    type: FETCH_DATASETS_SUCCESS,
    datasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  }
}

//ASYNC
export function fetchFacets() {
  return function (dispatch) {
    dispatch(requestFacets());

    //TODO Add fields to query
    return fetch("/api/facets")
      .then(response => response.json())
      .then(json =>
        /*dispatch(receivedatasets(json.data.datasets))*/
        dispatch(receiveFacets(json))
      )
      .catch(error =>
        dispatch(receiveFacetsFailure(error))
      )
  }
}

export function fetchDatasets() {
  return function (dispatch, getState) {
    dispatch(requestDatasets());
    //Get current added facets by querying store
    let facets = getState().visualize.selectedFacets;
    let constraints = "";
    facets.forEach(function(facet,i){
      constraints += `${(i > 0)?",":""}${facet.key}:${facet.value}`;
    });
    console.log(getState().visualize);

    //TODO Add fields to query
    return fetch(`/api/datasets?constraints=${constraints}`)
      .then(response => response.json())
      .then(json =>
        /*dispatch(receivedatasets(json.data.datasets))*/
        dispatch(receiveDatasets(json))
      )
      .catch(error =>
        dispatch(receiveDatasetsFailure(error))
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
  //Sync Facets
  selectFacetKey,
  selectFacetValue,
  addFacetKeyValue,
  removeFacetKeyValue,
  requestFacets,
  receiveFacetsFailure,
  receiveFacets,
  //Sync Datasets
  requestDatasets,
  receiveDatasetsFailure,
  receiveDatasets,
  //Async
  fetchFacets,
  fetchDatasets
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SELECT_FACET_KEY]: (state, action) => {
    return ({ ...state, currentSelectedKey: action.key, currentSelectedValue: action.value });
  },
  [SELECT_FACET_VALUE]: (state, action) => {
    return ({ ...state, currentSelectedValue: action.value });
  },
  [ADD_FACET_KEY_VALUE_PAIR]: (state, action) => {
    return ({ ...state, selectedFacets: state.selectedFacets.concat({ key: action.key, value: action.value }) });
  },
  [REMOVE_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let selectedFacets = state.selectedFacets.slice();
    let index = selectedFacets.findIndex( x => x.key === action.key && x.value === action.value);
    if( index > -1 ) selectedFacets.splice(index, 1);
    return ({ ...state, selectedFacets: selectedFacets });
  },
  [FETCH_FACETS_REQUEST]: (state, action) => {
    return ({ ...state, facets: action.facets });
  },
  [FETCH_FACETS_FAILURE]: (state, action) => {
    return ({ ...state, facets: action.facets });
  },
  [FETCH_FACETS_SUCCESS]: (state, action) => {
    return ({ ...state, facets: action.facets });
  },
  [FETCH_DATASETS_REQUEST]: (state, action) => {
    return ({ ...state, datasets: action.datasets });
  },
  [FETCH_DATASETS_FAILURE]: (state, action) => {
    return ({ ...state, datasets: action.datasets });
  },
  [FETCH_DATASETS_SUCCESS]: (state, action) => {
    return ({ ...state, datasets: action.datasets });
  }
  //[FETCH_DATASETS_FAILURE]: (state, action) => {
  //  return ({ ...state, wmss: state.wmss.concat(action.payload), current: action.payload.id, fetching: false })
  //},
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentSelectedKey: "",
  currentSelectedValue: "",
  selectedFacets: [],
  selectedDatasets: [],
  facets: {
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
  }
};
export default function visualizeReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state
}
