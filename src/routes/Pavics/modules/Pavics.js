import initialState from './../../../store/initialState';
import * as constants from './../../../constants';
function assignNewProcess (process) {
  return {
    type: constants.WORKFLOW_CHOOSE_PROCESS,
    process: process
  };
}
function chooseStep (step) {
  return {
    type: constants.WORKFLOW_CHANGE_STEP,
    step: step
  };
}
export function chooseProcess (process) {
  return (dispatch) => {
    dispatch(assignNewProcess(process));
    dispatch(chooseStep(constants.WORKFLOW_STEP_INPUTS));
  };
}
export function executeProcess () {
  console.log('executing process!');
  return (dispatch) => {
    return fetch('/wps/execute')
      .then(response => { console.log('received:', response); })
      .catch(error => { console.log('problem', error); });
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
          state.workflowWizard,
          {
            selectedProcess: action.process
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
          state.workflowWizard,
          {
            currentStep: action.step
          }
        )
      });
  }
};
function pavicsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
export default pavicsReducer;
