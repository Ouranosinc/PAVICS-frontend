import initialState from './../../../store/initialState';
import * as constants from './../../../constants';
function assignNewProcess (id) {
  return {
    type: constants.WORKFLOW_CHOOSE_PROCESS,
    id: id
  };
}
function chooseStep (step) {
  return {
    type: constants.WORKFLOW_CHANGE_STEP,
    step: step
  };
}
export function chooseProcess (id) {
  return function (dispatch) {
    dispatch(assignNewProcess(id));
    dispatch(chooseStep(constants.WORKFLOW_STEP_INPUTS));
  };
}
export const ACTION_HANDLERS = {
  [constants.WORKFLOW_CHOOSE_PROCESS]: (state, action) => {
    return Object.assign(
      {},
      state,
      {
        workflowWizard: Object.assign(
          {},
          ...state.workflowWizard,
          {
            selectedProcess: action.id
          }
        )
      });
  },
  [constants.WORKFLOW_CHANGE_STEP]: (state, action) => {
    return Object.assign(
      {},
      state,
      {
        workflowWizard: Object.assign(
          {},
          ...state.workflowWizard,
          {
            currentStep: action.step
          }
        )
      });
  }
};
export default function pavicsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
