import initialState from './../../../store/initialState';
export const ACTION_HANDLERS = [];
export default function gandalfReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
