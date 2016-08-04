// ------------------------------------
// Constants
// ------------------------------------
export const SYNC_METHOD_EVENT_TYPE = '<%= pascalEntityName %>.ANY_METHOD_EVENT_TYPE'
export const FETCH_ANY_REQUEST = '<%= pascalEntityName %>.FETCH_ANY_REQUEST';
export const FETCH_ANY_FAILURE = '<%= pascalEntityName %>.FETCH_ANY_FAILURE';
export const FETCH_ANY_SUCCESS = '<%= pascalEntityName %>.FETCH_ANY_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
export function syncMethod () {
  return {
    type: ANY_METHOD_EVENT_TYPE,
    variable: "anything"
  }
}

export function requestAnys () {
  return {
    type: FETCH_ANY_REQUEST,
    variable: "anything"
  }
}

export function receiveAnys () {
  return {
    type: FETCH_ANY_SUCCESS,
    variable: "anything"
  }
}

export function receiveAnysFailure () {
  return {
    type: FETCH_ANY_FAILURE,
    variable: "anything"
  }
}

export const asyncFetchAnys = () => {
  return (dispatch, getState) => {
    dispatch(requestAnys());
    return new Promise((resolve) => {
      setTimeout(() => {
        if(true) dispatch(receiveAnys());
        if(false) dispatch(receiveAnysFailure());
        resolve()
      }, 200)
    })
  }
}

export const actions = {
  //Sync
  syncMethod,
  requestAnys,
  receiveAnys,
  receiveAnysFailure,
  //Async
  asyncFetchAnys
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SYNC_METHOD_EVENT_TYPE]: (state, action) => {
    return ({ ...state, variable: action.variable  });
  },
  [FETCH_ANY_REQUEST]: (state, action) => {
    return ({ ...state, variable: action.variable  });
  },
  [FETCH_ANY_FAILURE]: (state, action) => {
    return ({ ...state, variable: action.variable  });
  },
  [FETCH_ANY_SUCCESS]: (state, action) => {
    return ({ ...state, variable: action.variable  });
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  variable: null
}
export default function <%= pascalEntityName %>Reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
