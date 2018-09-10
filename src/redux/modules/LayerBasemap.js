// Constants
export const constants = {};

// Actions


// Action Creators
export const actions = {};

// Reducer
const HANDLERS = {};

// Initial State
export const initialState = {};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
