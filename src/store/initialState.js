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
    selectedProvider: ''
  },
  platform: {
    section: ''
  },
  monitor: {
    jobs: []
  },
  visualize: {
    publicShapeFiles: [
      {
        title: 'topp:states',
        wmsUrl: 'http://demo.boundlessgeo.com/geoserver/wms',
        wmsParams: {
          LAYERS: 'topp:states',
          TILED: true
        }
      },
      {
        title: 'WATERSHEDS:BV_N1_S',
        wmsUrl: 'http://outarde.crim.ca:8087/geoserver/wms',
        wmsParams: {
          LAYERS: 'WATERSHEDS:BV_N1_S',
          TILED: true,
          FORMAT: 'image/png'
        }
      },
      {
        title: 'WATERSHEDS:BV_N2_S',
        wmsUrl: 'http://outarde.crim.ca:8087/geoserver/wms',
        wmsParams: {
          LAYERS: 'WATERSHEDS:BV_N2_S',
          TILED: true,
          FORMAT: 'image/png'
        }
      },
      {
        title: 'WATERSHEDS:BV_N3_S',
        wmsUrl: 'http://outarde.crim.ca:8087/geoserver/wms',
        wmsParams: {
          LAYERS: 'WATERSHEDS:BV_N3_S',
          TILED: true,
          FORMAT: 'image/png'
        }
      },
      {
        title: 'ADMINBOUNDARIES:canada_admin_boundaries',
        wmsUrl: 'http://outarde.crim.ca:8087/geoserver/wms',
        wmsParams: {
          LAYERS: 'ADMINBOUNDARIES:canada_admin_boundaries',
          TILED: true,
          FORMAT: 'image/png'
        }
      },
      {
        title: 'opengeo:countries',
        wmsUrl: 'http://outarde.crim.ca:8087/geoserver/wms',
        wmsParams: {
          LAYERS: 'opengeo:countries',
          TILED: true,
          FORMAT: 'image/png'
        }
      }
    ],
    baseMaps: [
      'Aerial',
      'Road',
      'AerialWithLabels'
    ],
    layer: {},
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
