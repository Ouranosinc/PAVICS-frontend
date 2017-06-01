// Constants
export const constants = {
  PROJECT_SET_CURRENT_PROJECT: 'PROJECT_SET_CURRENT_PROJECT',
  PROJECT_FETCH_RESEACHER_PROJECTS_REQUEST: 'PROJECT_FETCH_RESEACHER_PROJECTS_REQUEST',
  PROJECT_FETCH_RESEACHER_PROJECTS_SUCCESS: 'PROJECT_FETCH_RESEACHER_PROJECTS_SUCCESS',
  PROJECT_FETCH_RESEACHER_PROJECTS_FAILURE: 'PROJECT_FETCH_RESEACHER_PROJECTS_FAILURE',
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
function setCurrentProject (project) {
  return {
    type: constants.PROJECT_SET_CURRENT_PROJECT,
    currentProject: project
  };
}
function fetchResearcherProjects (reseacherId) {
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
export const projectActions = {
  setCurrentProject,
  fetchResearcherProjects
};

// Handlers
const PROJECT_HANDLERS = {
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
  const handler = PROJECT_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
