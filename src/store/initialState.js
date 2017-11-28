import * as constants from './../constants';

const initialState = {
  platform: {
    section: ''
  },
  visualize: {
    variablePreferences: {},
    mapManipulationMode: constants.VISUALIZE_MODE_VISUALIZE,
    selectedColorPalette: '',
    selectedShapefile: {},
    selectedBasemap: '',
    currentDisplayedDataset: {
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
    currentVisualizedDatasets: [],
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
    climateIndicators: {
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
