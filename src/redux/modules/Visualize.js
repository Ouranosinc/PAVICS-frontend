// Constants
export const constants = {
  VISUALIZE_SET_VARIABLE_MIN: 'VISUALIZE_SET_VARIABLE_MIN',
  VISUALIZE_SET_VARIABLE_MAX: 'VISUALIZE_SET_VARIABLE_MAX'
};

function updateVariableMinInStore (variableMin) {
  return {
    type: constants.VISUALIZE_SET_VARIABLE_MIN,
    variableMin: variableMin
  };
}

function updateVariableMaxInStore (variableMax) {
  return {
    type: constants.VISUALIZE_SET_VARIABLE_MAX,
    variableMax: variableMax
  };
}

// Action Creators
export const actions = {
  setVariableMin: (variableMin) => {
    return dispatch => {
      dispatch(updateVariableMinInStore(variableMin));
    };
  },
  setVariableMax: (variableMax) => {
    return dispatch => {
      dispatch(updateVariableMaxInStore(variableMax));
    };
  }
};

// Handlers
const HANDLERS = {
  [constants.VISUALIZE_SET_VARIABLE_MIN]: (state, action) => {
    return {...state, variableMin: action.variableMin};
  },
  [constants.VISUALIZE_SET_VARIABLE_MAX]: (state, action) => {
    return {...state, variableMax: action.variableMax};
  }
};

// Reducer
export const initialState = {
  variableMin: '',
  variableMax: ''
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
