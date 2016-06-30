// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_wms = 'REQUEST_wms'
export const RECIEVE_wms = 'RECIEVE_wms'
export const SAVE_CURRENT_wms = 'SAVE_CURRENT_wms'

// ------------------------------------
// Actions
// ------------------------------------

export function requestwms () {
  return {
    type: REQUEST_wms
  }
}

let availableId = 0
export function recievewms (value) {
  return {
    type: RECIEVE_wms,
    payload: {
      value: JSON.parse(value),
      id: availableId++
    }
  }
}

export function saveCurrentwms () {
  return {
    type: SAVE_CURRENT_wms
  }
}

export const fetchwms = () => {
  return (dispatch) => {
    dispatch(requestwms())

    return fetch('api/wms/capabilities')
      .then(data => data.text())
      .then(text => dispatch(recievewms(text)))
  }
}

export const actions = {
  requestwms,
  recievewms,
  fetchwms,
  saveCurrentwms
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const wms_ACTION_HANDLERS = {
  [REQUEST_wms]: (state) => {
    return ({ ...state, fetching: true })
  },
  [RECIEVE_wms]: (state, action) => {
    return ({ ...state, wmss: state.wmss.concat(action.payload), current: action.payload.id, fetching: false })
  },
  [SAVE_CURRENT_wms]: (state) => {
    return state.current != null ? ({ ...state, saved: state.saved.concat(state.current) }) : state
  }
}

// ------------------------------------
// Reducers
// ------------------------------------

const initialState = { fetching: false, current: null, wmss: [], saved: [] }
export default function wmsReducer (state = initialState, action) {
  const handler = wms_ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

