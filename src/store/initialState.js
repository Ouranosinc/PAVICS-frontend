import * as constants from './../constants';
const initialState = {
  workflowWizard: {
    selectedProcess: {},
    selectedProcessInputs: [],
    selectedProcessValues: {},
    currentStep: constants.WORKFLOW_STEP_PROCESS,
    processes: [],
    providers: {
      items: [],
      selectedProvider: null
    }
  },
  platform: {
    section: constants.PLATFORM_SECTION_WORKFLOWS
  },
  monitor: {
    jobs: []
  },
  currentSelectedKey: constants.DEFAULT_SELECTED_KEY,
  currentSelectedValue: '',
  currentOpenedDataset: '',
  currentOpenedDatasetWMSFile: '',
  currentOpenedWMSLayer: '',
  loadedWmsDatasets: [],
  selectedFacets: [],
  selectedDatasets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  selectedWMSLayers: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  selectedWMSLayer: {
    layerDetails: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      data: {},
      error: null
    },
    timesteps: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      data: {},
      error: null
    }
  },
  facets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  climateIndicators: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  datasets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  plotlyData: {
    isFecthing: false,
    receivedAt: null,
    requestedAt: null,
    data: [],
    layout: {},
    error: null
  },
  panelControls: {
    [constants.PANEL_SEARCH_CATALOG]: {
      show: true
    },
    [constants.PANEL_DATASET_DETAILS]: {
      show: false
    },
    [constants.PANEL_DATASET_WMS_LAYERS]: {
      show: false
    },
    [constants.PANEL_CLIMATE_INDICATORS]: {
      show: false
    },
    [constants.PANEL_PLOTLY]: {
      show: false
    }
  }
};
export default initialState;
