import initialState from './../../../store/initialState';
import * as constants from './../../../constants';
function setSelectedProcess (process) {
  // TODO remove the boilerplate when api provides the identifier
  // TODO uplicated in ProcessesSelector to make executing easier
  let processIdentifier;
  if (process.identifier) {
    processIdentifier = process.identifier;
  } else {
    let param = process.url.slice('process=');
    let bits = param.split('=');
    processIdentifier = bits.slice(-1)[0];
  }
  process = Object.assign(process, {
    identifier: processIdentifier
  });
  return {
    type: constants.WORKFLOW_CHOOSE_PROCESS,
    process: process
  };
}
function setJobs (jobs) {
  return {
    type: constants.MONITOR_SET_JOBS,
    jobs: jobs
  };
}
function setProcesses (processes) {
  return {
    type: constants.WORKFLOW_SET_PROCESSES,
    processes: processes
  };
}
function setProviders (providers) {
  providers.map(provider => {
    provider.identifier = provider.url.replace('/processes/list?wps=', '');
  });
  return {
    type: constants.WORKFLOW_SET_PROVIDERS,
    items: providers
  };
}
function setWpsProvider (provider) {
  return {
    type: constants.WORKFLOW_SET_WPS_PROVIDER,
    provider: provider
  };
}
function setProcessInputs (inputs) {
  return {
    type: constants.WORKFLOW_SET_ACTIVE_PROCESS_INPUTS,
    inputs: inputs
  };
}
function setSelectedProcessValues (key, value) {
  return {
    type: constants.WORKFLOW_SET_ACTIVE_PROCESS_VALUES,
    key: key,
    value: value
  };
}
function setSection (section) {
  return {
    type: constants.PLATFORM_SET_SECTION,
    section: section
  };
}
export function chooseStep (step) {
  return {
    type: constants.WORKFLOW_CHANGE_STEP,
    step: step
  };
}
export function goToSection (section) {
  return dispatch => dispatch(setSection(section));
}
export function handleSelectedProcessValueChange (key, value) {
  return dispatch => {
    dispatch(setSelectedProcessValues(key, value));
  };
}
export function fetchProcessInputs (provider, process) {
  return dispatch => {
    return fetch(`/phoenix/inputs?provider=${provider}&process=${process}`)
      .then(response => response.json())
      .then(json => {
        dispatch(setProcessInputs(json.inputs));
      })
      .catch(err => {
        console.log(err);
      });
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
    dispatch(setSelectedProcess(process));
    dispatch(chooseStep(constants.WORKFLOW_STEP_INPUTS));
  };
}
export function fetchJobs () {
  return (dispatch) => {
    return fetch('/phoenix/jobs')
      .then(response => response.json())
      .then(json => dispatch(setJobs(json.jobs)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function fetchProcesses (provider) {
  return (dispatch) => {
    return fetch(`/phoenix/processesList?provider=${provider}`)
      .then(response => response.json())
      .then(json => dispatch(setProcesses(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function fetchProviders () {
  return (dispatch) => {
    return fetch('/phoenix/processes')
      .then(response => response.json())
      .then(json => dispatch(setProviders(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}
export function executeProcess (provider, process, inputValues) {
  return () => {
    console.log(inputValues);
    let array = [];
    for (let key in inputValues) {
      if (inputValues.hasOwnProperty(key)) {
        array.push(encodeURIComponent(key) + '=' + encodeURIComponent(inputValues[key]));
      }
    }
    let string = array.join(';');
    return fetch(`/phoenix/execute?wps=${provider}&process=${process}&inputs=${string}`)
      .then(response => {
        console.log('received:', response);
      })
      .catch(error => {
        console.log('problem', error);
      });
  };
}
export const WORKFLOW_WIZARD_HANDLERS = {
  [constants.WORKFLOW_SET_WPS_PROVIDER]: (state, action) => {
    return Object.assign({}, state, {
      providers: Object.assign({}, state.providers, {
        selectedProvider: action.provider
      })
    });
  },
  [constants.WORKFLOW_CHOOSE_PROCESS]: (state, action) => {
    return {...state, selectedProcess: action.process};
  },
  [constants.WORKFLOW_SET_ACTIVE_PROCESS_INPUTS]: (state, action) => {
    return {...state, selectedProcessInputs: action.inputs};
  },
  [constants.WORKFLOW_SET_ACTIVE_PROCESS_VALUES]: (state, action) => {
    return Object.assign({}, state, {
      selectedProcessValues: Object.assign({}, state.selectedProcessValues, {
        [action.key]: action.value
      })
    });
  },
  [constants.WORKFLOW_CHANGE_STEP]: (state, action) => {
    return {...state, currentStep: action.step};
  },
  [constants.WORKFLOW_SET_PROCESSES]: (state, action) => {
    return {...state, processes: action.processes};
  },
  [constants.WORKFLOW_SET_PROVIDERS]: (state, action) => {
    return Object.assign({}, state, {
      providers: {...state.providers, items: action.items}
    });
  }
};

const PLATFORM_HANDLERS = {
  [constants.PLATFORM_SET_SECTION]: (state, action) => {
    return {...state, section: action.section};
  }
};

const MONITOR_HANDLERS = {
  [constants.MONITOR_SET_JOBS]: (state, action) => {
    return {...state, jobs: action.jobs};
  }
};

function workflowWizardReducer (state, action) {
  const handler = WORKFLOW_WIZARD_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

function platformReducer (state, action) {
  const handler = PLATFORM_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

function monitorReducer (state, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

function pavicsReducer (state = initialState, action) {
  return {
    workflowWizard: workflowWizardReducer(state.workflowWizard, action),
    platform: platformReducer(state.platform, action),
    monitor: monitorReducer(state.monitor, action)
  };
}

export default pavicsReducer;
