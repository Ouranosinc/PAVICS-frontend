import * as constants from './../constants'
// ------------------------------------
// Constants
// These should go in the constants.js file as well at some point
// ------------------------------------
export const COUNTER_INCREMENT = 'MapViewer.COUNTER_INCREMENT';

export const CLICK_TOGGLE_PANEL = 'MapViewer.CLICK_TOGGLE_PANEL';

// ------------------------------------
// Actions
// ------------------------------------

export function clickTogglePanel(panel, show) {
  return {
    type: CLICK_TOGGLE_PANEL,
    panel: panel,
    show: show
  }
}



export const actions = {
  //Sync Panels
  clickTogglePanel,

};
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {

  [CLICK_TOGGLE_PANEL]: (state, action) => {
    let panelControls = JSON.parse(JSON.stringify(state.panelControls)); //TODO: deepcopy With Immutable.js or something like that
    panelControls[action.panel].show = action.show;
    return ({...state, panelControls: panelControls});
  }
};
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  currentSelectedKey: constants.DEFAULT_SELECTED_KEY
};
export default function visualizeReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state
}
