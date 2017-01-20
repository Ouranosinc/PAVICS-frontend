import * as constants from './../constants';
const initialState = {
  workflowWizard: {
    selectedProcess: {},
    stepIndex: 0,
    selectedProcessInputs: [],
    selectedProcessValues: {},
    currentStep: constants.WORKFLOW_STEP_PROCESS,
    processes: [],
    providers: {
      items: []
    },
    selectedProvider: ''
  },
  platform: {
    section: ''
  },
  monitor: {
    jobs: []
  },
  visualize: {
    layer: {},
    currentSelectedKey: constants.DEFAULT_SELECTED_KEY,
    currentSelectedValue: '',
    currentOpenedDataset: '',
    currentOpenedDatasetWMSFile: '',
    currentOpenedWMSLayer: '',
    currentDateTime: '1900-01-01T00:00:00.000Z',
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
    selectedWMSLayerDetails: {
        requestedAt: null,
        receivedAt: null,
        isFetching: false,
        data: {},
        error: null
    },
    selectedWMSLayerTimesteps: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      data: {},
      error: null
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
  }
};
export default initialState;
