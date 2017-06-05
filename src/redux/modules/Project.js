// Constants
export const constants = {
  PROJECT_SET_CURRENT_PROJECT: 'PROJECT_SET_CURRENT_PROJECT'
};

// Actions
function setCurrentProject (project) {
  return {
    type: constants.PROJECT_SET_CURRENT_PROJECT,
    currentProject: project
  };
}

// Exported Action Creators
export const actions = {
  setCurrentProject
};

// Handlers
const HANDLERS = {
  [constants.PROJECT_SET_CURRENT_PROJECT]: (state, action) => {
    return ({...state, currentProject: action.currentProject});
  }
};

// Reducer
const initialState = {
  currentProject: {}
};
export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
