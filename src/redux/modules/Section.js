// Constants
export const constants = {
  PLATFORM_SET_SECTION: 'SECTION.PLATFORM_SET_SECTION'
};

// Action Creators
export const actions = {
  goToSection: function (section) {
    return {
      type: constants.PLATFORM_SET_SECTION,
      openedSection: section
    };
  }
};

// Reducer
const HANDLERS = {
  [constants.PLATFORM_SET_SECTION]: (state, action) => {
    return {...state, openedSection: action.openedSection};
  }
};

// Initial State
export const initialState = {
  openedSection: ''
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
