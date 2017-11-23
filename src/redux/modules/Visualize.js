// Constants
export const constants = {};

// Action Creators
export const actions = {};

// Handlers
const HANDLERS = {};

// Reducer
export const initialState = {};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
