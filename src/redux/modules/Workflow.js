import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';
import { InputDefinition } from '../../data-models/InputDefinition';
import { actions as jobAPIActions } from './JobAPI';
import { JOB_PROJECT_PREFIX } from './../../constants';

// Constants
export const constants = {
  CHANGE_STEP: 'CHANGE_STEP',
  SET_PROCESSES: 'WORKFLOW.SET_PROCESSES',
  SET_PROVIDERS: 'WORKFLOW.SET_PROVIDERS',
  CHOOSE_PROCESS: 'WORKFLOW.CHOOSE_PROCESS',
  GET_FIRST_STEP: 'WORKFLOW.GET_FIRST_STEP',
  GET_LAST_STEP: 'WORKFLOW.GET_LAST_STEP',
  GET_NEXT_STEP: 'WORKFLOW.GET_NEXT_STEP',
  STEP_PROCESS: 'WORKFLOW.STEP_PROCESS',
  STEP_INPUTS: 'WORKFLOW.STEP_INPUTS',
  STEP_RUN: 'WORKFLOW.STEP_RUN',
  EXECUTE_JOB_REQUEST: 'WORKFLOW.EXECUTE_JOB_REQUEST',
  EXECUTE_JOB_FAILURE: 'WORKFLOW.EXECUTE_JOB_FAILURE',
  EXECUTE_JOB_SUCCESS: 'WORKFLOW.EXECUTE_JOB_SUCCESS',
  SET_WPS_PROVIDER: 'WORKFLOW.SET_WPS_PROVIDER',
  SET_ACTIVE_PROCESS_INPUTS: 'WORKFLOW.SET_ACTIVE_PROCESS_INPUTS',
  SET_ACTIVE_PROCESS_VALUES: 'WORKFLOW.SET_ACTIVE_PROCESS_VALUES',
};

// Actions
function setSelectedProcess (process) {
  return {
    type: constants.CHOOSE_PROCESS,
    process: process
  };
}

function setProcesses (processes) {
  return {
    type: constants.SET_PROCESSES,
    processes: processes
  };
}

function setProviders (providers) {
  return {
    type: constants.SET_PROVIDERS,
    items: providers
  };
}

function setWpsProvider (provider) {
  return {
    type: constants.SET_WPS_PROVIDER,
    provider: provider
  };
}

function setProcessInputs (inputs) {
  return {
    type: constants.SET_ACTIVE_PROCESS_INPUTS,
    inputs: inputs
  };
}

function setSelectedProcessValues (key, value) {
  return {
    type: constants.SET_ACTIVE_PROCESS_VALUES,
    key: key,
    value: value
  };
}

function chooseStep (step) {
  return {
    type: constants.CHANGE_STEP,
    step: step
  };
}

function getFirstStep () {
  return {
    type: constants.GET_FIRST_STEP
  };
}

function getLastStep () {
  return {
    type: constants.GET_LAST_STEP
  };
}

function getNextStep () {
  return {
    type: constants.GET_NEXT_STEP
  };
}

function handleSelectedProcessValueChange (key, value) {
  return dispatch => {
    dispatch(setSelectedProcessValues(key, value));
  };
}

function fetchProcessInputs (provider, process) {
  return dispatch => {
    return myHttp.get(`${__PAVICS_TWITCHER_API_PATH__}/providers/${provider}/processes/${process}`)
      .then(response => response.json())
      .then(json => {
        let inputDefinitions = [];
        json.inputs.map((input) => {
          inputDefinitions.push(new InputDefinition(
            input.id,
            input.dataType,
            input.title,
            input.abstract,
            input.minOccurs,
            input.maxOccurs,
            input.defaultValue,
            input.allowedValues
          ));
        });
        dispatch(setProcessInputs(inputDefinitions));
      })
      .catch(err => {
        console.log(err);
      });
  };
}

function selectWpsProvider (provider) {
  return dispatch => {
    dispatch(setWpsProvider(provider));
    dispatch(getNextStep());
    dispatch(fetchProcesses(provider));
  };
}

function chooseProcess (process) {
  return (dispatch) => {
    dispatch(setSelectedProcess(process));
    dispatch(getNextStep());
  };
}

// FIXME: 1 ASYNC ACTION => 3 SYNC ACTIONS
function fetchProcesses (provider) {
  return (dispatch) => {
    return myHttp.get(`${__PAVICS_TWITCHER_API_PATH__}/providers/${provider}/processes`)
      .then(response => response.json())
      .then(json => dispatch(setProcesses(json)))
      .catch(err => {
        console.log(err);
      });
  };
}

// FIXME: 1 ASYNC ACTION => 3 SYNC ACTIONS
function fetchProviders () {
  return (dispatch) => {
    return myHttp.get(`${__PAVICS_TWITCHER_API_PATH__}/providers`)
      .then(response => response.json())
      .then(json => dispatch(setProviders(json)))
      .catch(err => {
        console.log(err);
      });
  };
}

function requestExecuteJob () {
  return {
    type: constants.EXECUTE_JOB_REQUEST,
    executedJob: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {},
      error: null
    }
  };
}

function receiveExecuteJobFailure (error) {
  return {
    type: constants.EXECUTE_JOB_FAILURE,
    executedJob: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}

function receiveExecuteJobSuccess (data) {
  return {
    type: constants.EXECUTE_JOB_SUCCESS,
    executedJob: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  };
}

function executeWorkflow (workflowName, inputs) {
  return (dispatch, getState) => {
    const provider = __PAVICS_WORKFLOW_PROVIDER__;
    const process = __PAVICS_RUN_WORKFLOW_IDENTIFIER__;
    const projectId = getState().project.currentProject.id;
    const tags = `${JOB_PROJECT_PREFIX}${projectId}`;

    dispatch(requestExecuteJob());
    return myHttp.postJson(`${__PAVICS_TWITCHER_API_PATH__}/providers/${provider}/processes/${process}/jobs?tags=${tags}`, inputs)
      .then(response => {
        if (!response.ok) {
          NotificationManager.error(`Failed at executing the workflow at address ${response.url}. Returned Status ${response.status}: ${response.statusText}`, 'Error', 10000);
          dispatch(receiveExecuteJobFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json) {
          NotificationManager.success('Workflow has be launched with success');
          dispatch(receiveExecuteJobSuccess(json));
          dispatch(jobAPIActions.createJob({
            projectId: projectId,
            phoenixTaskId: json.jobID,
            name: workflowName
          }));
        }
      }, err => {
        // Not an HTTP error, failed at parsing json or something else
        NotificationManager.error(`Failed at executing the workflow. ${err.message} ${err.stack}`, 'Error', 10000);
        dispatch(receiveExecuteJobFailure({
          status: 200,
          message: err.message,
          stack: err.stack
        }));
      });
  };

}

function executeProcess (provider, process, inputs) {
  return (dispatch, getState) => {
    const projectId = getState().project.currentProject.id;
    const tags = `project-${projectId}`;

    dispatch(requestExecuteJob());
    return myHttp.postJson(`${__PAVICS_TWITCHER_API_PATH__}/providers/${provider}/processes/${process}/jobs?tags=${tags}`, inputs)
      .then(response => {
        if (!response.ok) {
          NotificationManager.error(`Failed at executing the process at address ${response.url}. Returned Status ${response.status}: ${response.statusText}`, 'Error', 10000);
          dispatch(receiveExecuteJobFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        } else {
          return response.json();
        }
      })
      .then(json => {
        if (json) {
          NotificationManager.success('Process has been launched with success');
          dispatch(receiveExecuteJobSuccess(json));
          dispatch(jobAPIActions.createJob({
            projectId: projectId,
            phoenixTaskId: json.jobID
          }));
        }
      }, err => {
        // Not an HTTP error, failed at parsing json or something else
        NotificationManager.error(`Failed at executing the process. ${err.message} ${err.stack}`, 'Error', 10000);
        dispatch(receiveExecuteJobFailure({
          status: 200,
          message: err.message,
          stack: err.stack
        }));
      });
  };
}

// Exported Action Creators
export const actions = {
  setSelectedProcess: setSelectedProcess,
  setProcesses: setProcesses,
  setProviders: setProviders,
  setWpsProvider: setWpsProvider,
  setProcessInputs: setProcessInputs,
  setSelectedProcessValues: setSelectedProcessValues,
  chooseStep: chooseStep,
  getFirstStep: getFirstStep,
  getLastStep: getLastStep,
  getNextStep: getNextStep,
  handleSelectedProcessValueChange: handleSelectedProcessValueChange,
  fetchProcessInputs: fetchProcessInputs,
  selectWpsProvider: selectWpsProvider,
  chooseProcess: chooseProcess,
  fetchProcesses: fetchProcesses,
  fetchProviders: fetchProviders,
  executeProcess : executeProcess,
  executeWorkflow: executeWorkflow
};

// Handlers
const HANDLERS = {
  [constants.SET_WPS_PROVIDER]: (state, action) => {
    return {...state, selectedProvider: action.provider};
  },
  [constants.CHOOSE_PROCESS]: (state, action) => {
    return {...state, selectedProcess: action.process};
  },
  [constants.SET_ACTIVE_PROCESS_INPUTS]: (state, action) => {
    return {...state, selectedProcessInputs: action.inputs};
  },
  [constants.SET_ACTIVE_PROCESS_VALUES]: (state, action) => {
    return Object.assign({}, state, {
      selectedProcessValues: Object.assign({}, state.selectedProcessValues, {
        [action.key]: action.value
      })
    });
  },
  [constants.CHANGE_STEP]: (state, action) => {
    return {...state, currentStep: action.step};
  },
  [constants.GET_FIRST_STEP]: (state) => {
    return {...state, stepIndex: 0};
  },
  [constants.GET_LAST_STEP]: (state) => {
    return {...state, stepIndex: (state.stepIndex - 1)};
  },
  [constants.GET_NEXT_STEP]: (state) => {
    return {...state, stepIndex: (state.stepIndex + 1)};
  },
  [constants.SET_PROCESSES]: (state, action) => {
    return {...state, processes: action.processes};
  },
  [constants.SET_PROVIDERS]: (state, action) => {
    return Object.assign({}, state, {
      providers: {...state.providers, items: action.items}
    });
  },
  [constants.EXECUTE_JOB_REQUEST]: (state, action) => {
    return ({...state, executedJob: action.executedJob});
  },
  [constants.EXECUTE_JOB_SUCCESS]: (state, action) => {
    return ({...state, executedJob: action.executedJob});
  },
  [constants.EXECUTE_JOB_FAILURE]: (state, action) => {
    return ({...state, executedJob: action.executedJob});
  },
};

// Reducer
export const initialState = {
  executedJob: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  selectedProcess: {
    url: '',
    identifier: '',
    description: '',
    title: ''
  },
  stepIndex: 0,
  selectedProcessInputs: [],
  selectedProcessValues: {},
  currentStep: constants.STEP_PROCESS,
  processes: [],
  providers: {
    items: []
  },
  selectedProvider: ''
};
export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
