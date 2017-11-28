import myHttp from './../../../lib/http';
// Constants
export const constants = {
  RESEARCHER_SET_CURRENT_RESEARCHER: 'RESEARCHER_SET_CURRENT_RESEARCHER',
  RESEARCHER_LOGIN_REQUEST: 'RESEARCHER_LOGIN_REQUEST',
  RESEARCHER_LOGIN_SUCCESS: 'RESEARCHER_LOGIN_SUCCESS',
  RESEARCHER_LOGIN_FAILURE: 'RESEARCHER_LOGIN_FAILURE',
};

// Actions
function loginResearcherRequest() {
  return {
    type: constants.RESEARCHER_LOGIN_REQUEST,
    researcherProjects: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {}
    }
  };
}
function loginResearcherSuccess (session) {
  return {
    type: constants.RESEARCHER_LOGIN_SUCCESS,
    researcherProjects: {
      receivedAt: Date.now(),
      isFetching: false,
      data: session,
      error: null
    }
  };
}
function loginResearcherFailure (error) {
  return {
    type: constants.RESEARCHER_LOGIN_FAILURE,
    session: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}
export function login (credentials) {
  return dispatch => {
    dispatch(loginResearcherRequest());
    myHttp.postJson(__PAVICS_PROJECT_API_PATH__ + '/Researcher/login', credentials)
      .then(res => res.json())
      .then(json => dispatch(loginResearcherSuccess(json)))
      .catch(err => dispatch(loginResearcherFailure(err)));
  };
}

// Exported Action Creators
export const actions = {
  login
};

// Handlers
const RESEARCHER_HANDLERS = {

};

// Reducer
const initialState = {
  currentResearcher: {
    email: 'renaud.hebert-legault@crim.ca',
    id: 1,
    username: 'renaud',
    password: 'qwerty'
  },
  session: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  }
};
export default function (state = initialState, action) {
  const handler = RESEARCHER_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
