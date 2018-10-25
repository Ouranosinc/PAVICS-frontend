import { Mode } from 'ol/interaction/Draw'

// platform
export const PLATFORM_SECTION_ACCOUNT_MANAGEMENT = 'Account Management';
export const PLATFORM_SECTION_PROJECT_MANAGEMENT = 'Project Management';
export const PLATFORM_SECTION_MONITOR = 'Processes Monitoring';
export const PLATFORM_SECTION_SEARCH_DATASETS = 'Search Datasets';
export const PLATFORM_SECTION_WORKFLOWS = 'Data Processing';
// Visualize
export const VISUALIZE_SET_MAP_MANIPULATION_MODE = 'Visualize.VISUALIZE_SET_MAP_MANIPULATION_MODE';
export const VISUALIZE_MODE_GRID_VALUES = 'VISUALIZE.MODE_VISUALIZE';
export const VISUALIZE_MODE_REGION_SELECTION = 'VISUALIZE.MODE_REGION_SELECTION';
export const CHART_WIDGET_TITLE = 'Time Series Chart';
export const CUSTOM_REGIONS_WIDGET_TITLE = 'Customize Regions';
export const LAYER_SWITCHER_WIDGET_TITLE = 'Layer Switcher';
export const INFO_WIDGET_TITLE = 'Point Informations';
export const MAP_CONTROLS_WIDGET_TITLE = 'Controls';
export const TIME_SLIDER_WIDGET_TITLE = 'Temporal Slider';

export const JOB_PROJECT_PREFIX = 'project-';
export const JOB_PLATFORM_TAG = 'platform-pavics';

// Not exported as expected
// import { Mode } from 'ol/interaction/Draw'
export const VISUALIZE_DRAW_MODES = {
  BBOX: {
    value: 'Bbox',
    label: 'Bounding Box (hold alt-shift key)'
  },
  // DEPRECATED: Circle feature geometry will be empty when transformed into GeoJSON format
  /*CIRCLE: {
    value: 'Circle',
    label: 'Circle (hold alt-shift key)'
  },*/
  HEXAGON: {
    value: 'Hexagon',
    label: 'Hexagon (hold alt-shift keys)'
  },
  LINE_STRING: {
    value: 'LineString',
    label: 'Line (hold alt key or alt-shift keys for freehand)'
  },
  SQUARE: {
    value: 'Square',
    label: 'Square (hold alt-shift keys)'
  },
  // TODO: Nothing appears on map after click... so disabled for now
  /* POINT: {
    value: 'Point',
    label: 'Point'
  },*/
  POLYGON: {
    value: 'Polygon',
    label: 'Polygon (hold alt key or alt-shift keys for freehand)'
  }
  // TODO: https://github.com/Ouranosinc/PAVICS-frontend/issues/134#issuecomment-416724206
  // Should be able to define a zonal or meridional globe-wide with only x1/x2 or y1/y2
  /*,
  ZONAL: {
    value: 'Zonal',
    label: 'Zonal'
  },
  MERIDIONAL: {
    value: 'Meridional',
    label: 'Meridional'
  }*/
};

// monitor
export const JOB_ACCEPTED_STATUS = 'ProcessAccepted';
export const JOB_FAILED_STATUS = 'ProcessFailed';
export const JOB_SUCCESS_STATUS = 'ProcessSucceeded';
export const JOB_STARTED_STATUS = 'ProcessStarted';
export const JOB_PAUSED_STATUS = 'ProcessPaused';
export const PAVICS_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// Pagination
export const PER_PAGE_OPTIONS = [5, 10, 25];
export const PER_PAGE_INITIAL_INDEX = 0;
// WPS processes and forms
export const INPUT_DATETIME = 'dateTime';
export const BOOLEAN = 'boolean';
export const STRING = 'string';
export const COMPLEX_DATA = 'ComplexData';
export const LABEL_NETCDF = 'ComplexData.resource';
export const LABEL_OPENDAP = 'string.resource';
export const LABEL_SHAPEFILE = 'string.typename';
export const LABEL_FEATURE_IDS = 'string.featureids';
// session
export const AUTH_COOKIE = 'auth_tkt';
// variable preferences
export const VARIABLE_PR = 'pr';
export const VARIABLE_PCP = 'pcp';
export const VARIABLE_BOUNDARY_MAX = 'max';
export const VARIABLE_BOUNDARY_MIN = 'min';
// keys
export const KEY_ENTER = 'Enter';
