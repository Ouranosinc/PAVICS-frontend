// Constants
export const constants = {
  TOGGLE_WIDGET: 'WIDGET.TOGGLE_WIDGET',
  WIDGET_INFO_KEY: 'info',
  WIDGET_MAP_CONTROLS_KEY: 'mapControls',
  WIDGET_CHART_KEY: 'chart',
  WIDGET_LAYER_SWITCHER_KEY: 'layerSwitcher',
  WIDGET_TIME_SLIDER_KEY: 'timeSlider',
  WIDGET_CUSTOM_REGIONS_KEY: 'customRegions',
};

// Actions


// Action Creators
export const actions = {
  toggleWidget: function (key) {
    return {
      type: constants.TOGGLE_WIDGET,
      key: key
    };
  }
};

// Reducer
const HANDLERS = {
  [constants.TOGGLE_WIDGET]: (state, action) => {
    const newState = {};
    newState[action.key] = !state[action.key];
    return {...state, ...newState};
  }
};

// Initial State
export const initialState = {
  chart: false,
  customRegions: true,
  info: false,
  mapControls: true,
  timeSlider: false,
  layerSwitcher: true
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
