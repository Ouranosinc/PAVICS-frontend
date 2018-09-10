// Constants
export const constants = {
  SET_SELECTED_BASEMAP: 'LAYER_BASEMAP.SET_SELECTED_BASEMAP',
};

// Action Creators
export const actions = {
  selectBasemap: function (basemap) {
    return {
      type: constants.SET_SELECTED_BASEMAP,
      basemap: basemap
    };
  }
};

// Reducer
const HANDLERS = {
  [constants.SET_SELECTED_BASEMAP]: (state, action) => {
    return {...state, selectedBasemap: action.basemap};
  },
};

// Initial State
export const initialState = {
  selectedBasemap: '',
  baseMaps: [
    'Aerial',
    'Road',
    'AerialWithLabels'
  ],
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
