// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'Visualize.COUNTER_INCREMENT';
//SYNC
export const SELECT_CATALOG_KEY = 'Visualize.SELECT_CATALOG_KEY';
export const SELECT_CATALOG_VALUE = 'Visualize.SELECT_CATALOG_VALUE';
export const ADD_CATALOG_KEY_VALUE_PAIR = 'Visualize.ADD_CATALOG_KEY_VALUE_PAIR';
export const REMOVE_CATALOG_KEY_VALUE_PAIR = 'Visualize.REMOVE_CATALOG_KEY_VALUE_PAIR';

//ASYNC
export const FETCH_CATALOGS_REQUEST = 'Visualize.FETCH_CATALOGS_REQUEST';
export const FETCH_CATALOGS_FAILURE = 'Visualize.FETCH_CATALOGS_FAILURE';
export const FETCH_CATALOGS_SUCCESS = 'Visualize.FETCH_CATALOGS_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
export function selectCatalogKey (key) {
  return {
    type: SELECT_CATALOG_KEY,
    key: key
  }
}

export function selectCatalogValue (key, value) {
  return {
    type: SELECT_CATALOG_VALUE,
    key: key,
    value: value
  }
}

export function addCatalogKeyValue (key, value) {
  console.log("addCatalogKeyValue: " + key + " " + value);
  return {
    type: ADD_CATALOG_KEY_VALUE_PAIR,
    key: key,
    value: value
  }
}

export function removeCatalogKeyValue (key, value) {
  return {
    type: REMOVE_CATALOG_KEY_VALUE_PAIR,
    key: key,
    value: value
  }
}

export function requestCatalogs () {
  return {
    type: FETCH_CATALOGS_REQUEST,
    catalogs: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  }
}

export function receiveCatalogsFailure (error) {
  return {
    type: FETCH_CATALOGS_FAILURE,
    catalogs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  }
}

export function receiveCatalogs (catalogs) {
  return {
    type: FETCH_CATALOGS_SUCCESS,
    catalogs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: catalogs,
      error: null
    }
  }
}

//ASYNC
export function fetchCatalogs(fields) {
  return function (dispatch) {
    dispatch(requestCatalogs());

    //TODO Add fields to query
    return fetch(`http://www.reddit.com/r/AskReddit.json`)
      .then(response => response.json())
      .then(json =>
        /*dispatch(receiveCatalogs(json.data.catalogs))*/
        dispatch(receiveCatalogs(json.data.children.map(child => child.data)))
      )
      .catch(error =>
        dispatch(receiveCatalogsFailure(error))
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
  selectCatalogKey,
  selectCatalogValue,
  addCatalogKeyValue,
  removeCatalogKeyValue,
  fetchCatalogs,
  requestCatalogs,
  receiveCatalogsFailure,
  receiveCatalogs
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SELECT_CATALOG_KEY]: (state, action) => {
    return ({ ...state, currentSelectedKey: action.key  });
  },
  [SELECT_CATALOG_VALUE]: (state, action) => {
    return ({ ...state, currentSelectedKey: action.key, currentSelectedValue: action.value });
  },
  [ADD_CATALOG_KEY_VALUE_PAIR]: (state, action) => {
    return ({ ...state, selectedFields: state.selectedFields.concat({ key: action.key, value: action.value })/*.push({ key: action.key, value: action.value })*/ });
  },
  [REMOVE_CATALOG_KEY_VALUE_PAIR]: (state, action) => {
    return ({ ...state, selectedFields: state.selectedFields }); //TODO: Remove field with both key and value
  },
  [FETCH_CATALOGS_REQUEST]: (state, action) => {
    return ({ ...state, catalogs: action.catalogs });
  },
  [FETCH_CATALOGS_FAILURE]: (state, action) => {
    return ({ ...state, catalogs: action.catalogs });
  },
  [FETCH_CATALOGS_SUCCESS]: (state, action) => {
    return ({ ...state, catalogs: action.catalogs });
  }
  //[FETCH_CATALOGS_FAILURE]: (state, action) => {
  //  return ({ ...state, wmss: state.wmss.concat(action.payload), current: action.payload.id, fetching: false })
  //},
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentSelectedKey: "",
  currentSelectedValue: "",
  selectedFields: [],
  selectedDatasets: [],
  catalogs: {
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
