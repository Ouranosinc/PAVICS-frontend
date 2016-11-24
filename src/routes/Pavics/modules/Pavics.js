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
function setProcesses (processes) {
  return {
    type: constants.WORKFLOW_SET_PROCESSES,
    processes: processes
  };
}
export function chooseProcess (process) {
  return (dispatch) => {
    dispatch(assignNewProcess(process));
    dispatch(chooseStep(constants.WORKFLOW_STEP_INPUTS));
  };
}
export function fetchProcesses () {
  return (dispatch) => {
    return fetch('/phoenix/processes')
      .then(response => response.json())
      .then(json => dispatch(setProcesses(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function executeProcess () {
  return () => {
    return fetch('/phoenix/execute')
      .then(response => {
        console.log('received:', response);
      })
      .catch(error => {
        console.log('problem', error);
      });
  };
}
export const ACTION_HANDLERS = {
  [constants.WORKFLOW_CHOOSE_PROCESS]: (state, action) => {
    return Object.assign({}, state, {
      workflowWizard: Object.assign({}, state.workflowWizard, {
        selectedProcess: action.process
      })
    });
  },
  [constants.WORKFLOW_CHANGE_STEP]: (state, action) => {
    return Object.assign({}, state, {
      workflowWizard: Object.assign({}, state.workflowWizard, {
        currentStep: action.step
      })
    });
  },
  [constants.WORKFLOW_SET_PROCESSES]: (state, action) => {
    return Object.assign({}, state, {
      workflowWizard: Object.assign({}, state.workflowWizard, {
        processes: action.processes
      })
    });
  }
};
function pavicsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
export default pavicsReducer;
