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
function setWpsProvider (provider) {
  return {
    type: constants.WORKFLOW_SET_WPS_PROVIDER,
    provider: provider
  };
}
export function selectWpsProvider (provider) {
  return dispatch => {
    dispatch(setWpsProvider(provider));
    dispatch(fetchProcesses(provider));
  };
}
export function chooseProcess (process) {
  return (dispatch) => {
    dispatch(assignNewProcess(process));
    dispatch(chooseStep(constants.WORKFLOW_STEP_INPUTS));
  };
}
export function fetchProcesses (provider) {
  return (dispatch) => {
    return fetch(`/phoenix/processes?provider=${provider}`)
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
  [constants.WORKFLOW_SET_WPS_PROVIDER]: (state, action) => {
    return Object.assign({}, state, {
      workflowWizard: Object.assign({}, state.workflowWizard, {
        wpsProvider: action.provider
      })
    });
  },
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
