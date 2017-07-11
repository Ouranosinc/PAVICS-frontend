// Constants
export const constants = {

};

// Actions


// Exported Action Creators
export const actions = {
  test: () => {

  }
};

// Handlers
const WORKFLOW_HANDLERS = {

};

// Reducer
const initialState = {
  yolo: "yolo"
};
export default function (state = initialState, action) {
  const handler = WORKFLOW_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
