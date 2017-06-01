// Constants
export const constants = {
  RESEARCH_ADD_SELECTION_TO_PROJECT: 'RESEARCH_ADD_SELECTION_TO_PROJECT',
  RESEARCH_ADD_FACET_KEY_VALUE_PAIR: 'RESEARCH_ADD_FACET_KEY_VALUE_PAIR',
  RESEARCH_REMOVE_FACET_KEY_VALUE_PAIR: 'RESEARCH_REMOVE_FACET_KEY_VALUE_PAIR',
  RESEARCH_REMOVE_ALL_FACET_KEY_VALUE: 'RESEARCH_REMOVE_ALL_FACET_KEY_VALUE'
};

// Actions
function addSelectionToProject () {
  return {
    type: constants.RESEARCH_ADD_SELECTION_TO_PROJECT
  };
}
function addFacetKeyValuePair (key, value) {
  return {
    type: constants.RESEARCH_ADD_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  };
}
function removeFacetKeyValuePair (key, value) {
  return {
    type: constants.RESEARCH_REMOVE_FACET_KEY_VALUE_PAIR,
    key: key,
    value: value
  };
}
function clearFacetKeyValuePairs () {
  return {
    type: constants.RESEARCH_REMOVE_ALL_FACET_KEY_VALUE
  };
}

// Exported Action Creators
export const actions = {
  addSelectionToProject,
  addFacetKeyValuePair,
  removeFacetKeyValuePair,
  clearFacetKeyValuePairs
};

// Handlers
const RESEARCH_HANDLERS = {
  //??
  [constants.RESEARCH_ADD_SELECTION_TO_PROJECT]: (state, action) => {
    return ({...state, currentProject: action.currentProject});
  },
  [constants.RESEARCH_ADD_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let facets = state.selectedFacets.concat({key: action.key, value: action.value});
    facets.sort(function (a, b) {
      if (a.key + a.value < b.key + b.value) {
        return -1;
      }
      if (a.key + a.value > b.key + b.value) {
        return 1;
      }
      return 0;
    });
    return ({...state, selectedFacets: facets});
  },
  [constants.RESEARCH_REMOVE_FACET_KEY_VALUE_PAIR]: (state, action) => {
    let selectedFacets = state.selectedFacets.slice();
    let index = selectedFacets.findIndex(x => x.key === action.key && x.value === action.value);
    if (index > -1) {
      selectedFacets.splice(index, 1);
    }
    return ({...state, selectedFacets: selectedFacets});
  },
  [constants.RESEARCH_REMOVE_ALL_FACET_KEY_VALUE]: (state, action) => {
    return ({...state, selectedFacets: []});
  },
};

// Reducer
const initialState = {
  selectedFacets: [],
};
export default function (state = initialState, action) {
  const handler = RESEARCH_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
