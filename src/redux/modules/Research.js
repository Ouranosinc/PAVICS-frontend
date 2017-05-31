// Constants
export const constants = {
  // SYNC
  RESEARCH_REMOVE_SEARCH_CRITERIAS_FROM_PROJECT: 'RESEARCH_REMOVE_SEARCH_CRITERIAS_FROM_PROJECT',
  RESEARCH_ADD_DATASETS_TO_PROJECT: 'RESEARCH_ADD_DATASETS_TO_PROJECT',
  RESEARCH_ADD_FACET_KEY_VALUE_PAIR: 'RESEARCH_ADD_FACET_KEY_VALUE_PAIR',
  RESEARCH_REMOVE_FACET_KEY_VALUE_PAIR: 'RESEARCH_REMOVE_FACET_KEY_VALUE_PAIR',
  RESEARCH_REMOVE_ALL_FACET_KEY_VALUE: 'RESEARCH_REMOVE_ALL_FACET_KEY_VALUE',
  // ASYNC
  RESEARCH_CREATE_REQUEST: 'RESEARCH_CREATE_REQUEST',
  RESEARCH_CREATE_SUCCESS: 'RESEARCH_CREATE_SUCCESS',
  RESEARCH_CREATE_FAILURE: 'RESEARCH_CREATE_FAILURE',
  RESEARCH_DELETE_REQUEST: 'RESEARCH_DELETE_REQUEST',
  RESEARCH_DELETE_SUCCESS: 'RESEARCH_DELETE_SUCCESS',
  RESEARCH_DELETE_FAILURE: 'RESEARCH_DELETE_FAILURE',
  RESEARCH_ADD_DATASET_REQUEST: 'RESEARCH_ADD_DATASET_REQUEST',
  RESEARCH_ADD_DATASET_SUCCESS: 'RESEARCH_ADD_DATASET_SUCCESS',
  RESEARCH_ADD_DATASET_FAILURE: 'RESEARCH_ADD_DATASET_FAILURE',
  RESEARCH_ADD_FACET_REQUEST: 'RESEARCH_ADD_FACET_REQUEST',
  RESEARCH_ADD_FACET_SUCCESS: 'RESEARCH_ADD_FACET_SUCCESS',
  RESEARCH_ADD_FACET_FAILURE: 'RESEARCH_ADD_FACET_FAILURE',
};

// Actions
function fetchResearcherProjectsRequest() {
  return {
    type: constants.PROJECT_FETCH_RESEACHER_PROJECTS_REQUEST,
    researcherProjects: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
function fetchResearcherProjectsSuccess (projects) {
  return {
    type: constants.PROJECT_FETCH_RESEACHER_PROJECTS_SUCCESS,
    researcherProjects: {
      receivedAt: Date.now(),
      isFetching: false,
      items: projects,
      error: null
    }
  };
}
function fetchResearcherProjectsFailure (error) {
  return {
    type: constants.PROJECT_FETCH_RESEACHER_PROJECTS_FAILURE,
    researcherProjects: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
function createResearchRequest() {
  return {
    type: constants.PROJECT_FETCH_RESEACHER_PROJECTS_REQUEST,
    researcherProjects: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}
function fetchResearcherProjectsSuccess (projects) {
  return {
    type: constants.PROJECT_FETCH_RESEACHER_PROJECTS_SUCCESS,
    researcherProjects: {
      receivedAt: Date.now(),
      isFetching: false,
      items: projects,
      error: null
    }
  };
}
function fetchResearcherProjectsFailure (error) {
  return {
    type: constants.PROJECT_FETCH_RESEACHER_PROJECTS_FAILURE,
    researcherProjects: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}
export function setCurrentProject (project) {
  return {
    type: constants.PROJECT_SET_CURRENT_PROJECT,
    currentProject: project
  };
}
export function fetchResearcherProjects (reseacherId) {
  return dispatch => {
    dispatch(fetchResearcherProjectsRequest());
    const filter = {
      where: {
        researcherId: reseacherId
      }
    };
    fetch(__LOOPBACK_API_PATH__ + `/Projects?filter=${JSON.stringify(filter)}`)
      .then(res => res.json())
      .then(json => dispatch(fetchResearcherProjectsSuccess(json)))
      .catch(err => dispatch(fetchResearcherProjectsFailure(err)));
  };
}

// Exported Action Creators
export const actions = {
  setCurrentProject,
  fetchResearcherProjects
};

// Handlers
const RESEARCH_HANDLERS = {
  [constants.PROJECT_SET_CURRENT_PROJECT]: (state, action) => {
    return ({...state, currentProject: action.currentProject});
  },
  [constants.PROJECT_FETCH_RESEACHER_PROJECTS_REQUEST]: (state, action) => {
    return ({...state, researcherProjects: action.researcherProjects});
  },
  [constants.PROJECT_FETCH_RESEACHER_PROJECTS_SUCCESS]: (state, action) => {
    return ({...state, researcherProjects: action.researcherProjects});
  },
  [constants.PROJECT_FETCH_RESEACHER_PROJECTS_FAILURE]: (state, action) => {
    return ({...state, researcherProjects: action.researcherProjects});
  },
};

// Reducer
const initialState = {
  currentProject: {},
  researcherProjects: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  }
};
export default function (state = initialState, action) {
  const handler = RESEARCH_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
