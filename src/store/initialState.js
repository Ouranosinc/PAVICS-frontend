import * as constants from './../constants';

const initialState = {
  workflowWizard: {
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
    selectedProvider: '',
    workflows: {
      isFetching: false,
      isSaving: false,
      isDeleting: false,
      items: []
    }
  },
  platform: {
    section: ''
  },
  monitor: {
    jobs: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      items: [],
      error: null
    }
  },
  visualize: {
    mapManipulationMode: constants.VISUALIZE_MODE_VISUALIZE,
    selectedColorPalette: {
      url: '',
      name: ''
    },
    selectedShapefile: {},
    selectedBasemap: '',
    selectedDatasetLayer: {
      opacity: 0.8
    },
    publicShapeFiles: [],
    baseMaps: [
      'Aerial',
      'Road',
      'AerialWithLabels'
    ],
    layer: {},
    selectedFacets: [],
    selectedRegions: [],
    currentDateTime: '1900-01-01T00:00:00.000Z',
    currentProjectSearchCriterias: [],
    currentProjectDatasets: [],
    currentScalarValue: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      data: {},
      error: null
    },
    currentVisualizedDatasetLayers: [],
    selectedDatasetCapabilities: {},
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
    esgfDatasets: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      items: [],
      error: null
    },
    pavicsDatasets: {
      requestedAt: null,
      receivedAt: null,
      isFetching: false,
      items: [],
      error: null
    },
    plotlyData: {
      isFetching: false,
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
