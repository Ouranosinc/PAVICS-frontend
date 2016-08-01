import { combineReducers } from 'redux'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_WMS = 'REQUEST_WMS'
export const RECEIVE_WMS = 'RECEIVE_WMS'
export const SAVE_CURRENT_WMS = 'SAVE_CURRENT_WMS'

// ------------------------------------
// Actions
// ------------------------------------

export function requestWms () {
  return {
    type: REQUEST_WMS
  }
}

let availableId = 0;
export function receiveWms (value) {
  return {
    type: RECEIVE_WMS,
    payload: {
      value: JSON.parse(value),
      id: availableId++
    }
  }
}

export function saveCurrentWms () {
  return {
    type: SAVE_CURRENT_WMS
  }
}

export const fetchWms = () => {
  return (dispatch) => {
    dispatch(requestWms())

    return fetch('api/wms/capabilities')
      .then(data => data.text())
      .then(text => dispatch(receiveWms(text)))
  }
};

/*function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}*/

export const actions = {
  requestWms,
  receiveWms,
  fetchWms,
  saveCurrentWms
};

// ------------------------------------
// Action Handlers
// ------------------------------------

const WMS_ACTION_HANDLERS = {
  [REQUEST_WMS]: (state) => {
    return ({ ...state, fetching: true })
  },
  [RECEIVE_WMS]: (state, action) => {
    return ({ ...state, wmss: state.wmss.concat(action.payload), current: action.payload.id, fetching: false })
  },
  [SAVE_CURRENT_WMS]: (state) => {
    return state.current != null ? ({ ...state, saved: state.saved.concat(state.current) }) : state
  }
}

// ------------------------------------
// Reducers
// ------------------------------------

const initialState = { fetching: false, current: null, wmss: [], saved: [] }
export default function wmsReducer (state = initialState, action) {
  const handler = WMS_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

