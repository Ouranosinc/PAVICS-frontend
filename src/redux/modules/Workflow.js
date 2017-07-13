// Constants
export const constants = {
  WORKFLOW_CHANGE_STEP: 'WORKFLOW_CHANGE_STEP',
  WORKFLOW_SET_PROCESSES: 'WORKFLOW_SET_PROCESSES',
  WORKFLOW_SET_PROVIDERS: 'WORKFLOW_SET_PROVIDERS',
  WORKFLOW_CHOOSE_PROCESS: 'WORKFLOW_CHOOSE_PROCESS',
  WORKFLOW_GET_FIRST_STEP: 'WORKFLOW_GET_FIRST_STEP',
  WORKFLOW_GET_LAST_STEP: 'WORKFLOW_GET_LAST_STEP',
  WORKFLOW_GET_NEXT_STEP: 'WORKFLOW_GET_NEXT_STEP',
  WORKFLOW_STEP_PROCESS: 'WORKFLOW_STEP_PROCESS',
  WORKFLOW_STEP_INPUTS: 'WORKFLOW_STEP_INPUTS',
  WORKFLOW_STEP_RUN: 'WORKFLOW_STEP_RUN',
  WORKFLOW_SET_WPS_PROVIDER: 'WORKFLOW_SET_WPS_PROVIDER',
  WORKFLOW_SET_ACTIVE_PROCESS_INPUTS: 'WORKFLOW_SET_ACTIVE_PROCESS_INPUTS',
  WORKFLOW_SET_ACTIVE_PROCESS_VALUES: 'WORKFLOW_SET_ACTIVE_PROCESS_VALUES',
  WORKFLOW_FETCH_WPS_JOBS_REQUEST: 'WORKFLOW_FETCH_WPS_JOBS_REQUEST',
  WORKFLOW_FETCH_WPS_JOBS_FAILURE: 'WORKFLOW_FETCH_WPS_JOBS_FAILURE',
  WORKFLOW_FETCH_WPS_JOBS_SUCCESS: 'WORKFLOW_FETCH_WPS_JOBS_SUCCESS'
};

// Actions
function setSelectedProcess (process) {
  // TODO remove the boilerplate when api provides the identifier
  // TODO uplicated in WpsProviderSelector to make executing easier
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
    value: valuefv
  };
}

function chooseStep (step) {
  return {
    type: constants.WORKFLOW_CHANGE_STEP,
    step: step
  };
}

function getFirstStep () {
  return {
    type: constants.WORKFLOW_GET_FIRST_STEP
  };
}

function getLastStep () {
  return {
    type: constants.WORKFLOW_GET_LAST_STEP
  };
}

function getNextStep () {
  return {
    type: constants.WORKFLOW_GET_NEXT_STEP
  };
}

function handleSelectedProcessValueChange (key, value) {
  return dispatch => {
    dispatch(setSelectedProcessValues(key, value));
  };
}

function fetchProcessInputs (provider, process) {
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

function fetchProcesses (provider) {
  return (dispatch) => {
    return fetch(`/phoenix/processesList?provider=${provider}`)
      .then(response => response.json())
      .then(json => dispatch(setProcesses(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}

function fetchProviders () {
  return (dispatch) => {
    return fetch('/phoenix/processes')
      .then(response => response.json())
      .then(json => dispatch(setProviders(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}

function executeProcess (provider, process, inputValues) {
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
  executeProcess : executeProcess
};

// Handlers
const WORKFLOW_HANDLERS = {
  [constants.WORKFLOW_SET_WPS_PROVIDER]: (state, action) => {
    return {...state, selectedProvider: action.provider};
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
  [constants.WORKFLOW_GET_FIRST_STEP]: (state) => {
    return {...state, stepIndex: 0};
  },
  [constants.WORKFLOW_GET_LAST_STEP]: (state) => {
    return {...state, stepIndex: (state.stepIndex - 1)};
  },
  [constants.WORKFLOW_GET_NEXT_STEP]: (state) => {
    return {...state, stepIndex: (state.stepIndex + 1)};
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

// Reducer
const initialState = {
  selectedProcess: {
    url: '',
    identifier: '',
    description: '',
    title: ''
  },
  stepIndex: 0,
  selectedProcessInputs: [],
  selectedProcessValues: {},
  currentStep: constants.WORKFLOW_STEP_PROCESS,
  processes: [],
  providers: {
    items: []
  },
  selectedProvider: ''
};
export default function (state = initialState, action) {
  const handler = WORKFLOW_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
