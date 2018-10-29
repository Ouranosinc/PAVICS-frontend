
import myHttp from '../../util/http';
import {InputDefinition} from '../../components/WpsProcessFormInput/InputDefinition';
// Constants
export const constants = {
  CHANGE_STEP: 'WORKFLOW.CHANGE_STEP',
  SET_PROCESSES: 'WORKFLOW.SET_PROCESSES',
  SET_PROVIDERS: 'WORKFLOW.SET_PROVIDERS',
  CHOOSE_PROCESS: 'WORKFLOW.CHOOSE_PROCESS',
  GET_FIRST_STEP: 'WORKFLOW.GET_FIRST_STEP',
  GET_LAST_STEP: 'WORKFLOW.GET_LAST_STEP',
  GET_NEXT_STEP: 'WORKFLOW.GET_NEXT_STEP',
  STEP_PROCESS: 'WORKFLOW.STEP_PROCESS',
  STEP_INPUTS: 'WORKFLOW.STEP_INPUTS',
  STEP_RUN: 'WORKFLOW.STEP_RUN',
  SET_WPS_PROVIDER: 'WORKFLOW.SET_WPS_PROVIDER',
  SET_ACTIVE_PROCESS_INPUTS: 'WORKFLOW.SET_ACTIVE_PROCESS_INPUTS',
  SET_ACTIVE_PROCESS_VALUES: 'WORKFLOW.SET_ACTIVE_PROCESS_VALUES',
  FETCH_WPS_JOBS_REQUEST: 'WORKFLOW.FETCH_WPS_JOBS_REQUEST',
  FETCH_WPS_JOBS_FAILURE: 'WORKFLOW.FETCH_WPS_JOBS_FAILURE',
  FETCH_WPS_JOBS_SUCCESS: 'WORKFLOW.FETCH_WPS_JOBS_SUCCESS'
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
  providers.map(provider => {
    provider.identifier = provider.url.replace('/processes/list?wps=', '');
  });
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
    return myHttp.get(`/phoenix/inputs?provider=${provider}&process=${process}`)
      .then(response => response.json())
      .then(json => {
        let inputDefinitions = [];
        json.inputs.map((input) => {
          inputDefinitions.push(new InputDefinition(
            input.name,
            input.dataType,
            input.title,
            input.description,
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

function fetchProcesses (provider) {
  return (dispatch) => {
    return myHttp.get(`/phoenix/processesList?provider=${provider}`)
      .then(response => response.json())
      .then(json => dispatch(setProcesses(json.items)))
      .catch(err => {
        console.log(err);
      });
  };
}

function fetchProviders () {
  return (dispatch) => {
    return myHttp.get('/phoenix/processes')
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
    return myHttp.get(`/phoenix/execute?wps=${provider}&process=${process}&inputs=${string}`)
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
  }
};

// Reducer
export const initialState = {
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
