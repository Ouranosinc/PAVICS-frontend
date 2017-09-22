import myHttp from './../../../lib/http';

// Constants
export const constants = {
  ZIGGURAT_LOGIN_REQUEST: 'ZIGGURAT_LOGIN_REQUEST',
  ZIGGURAT_LOGIN_FAILURE: 'ZIGGURAT_LOGIN_FAILURE',
  ZIGGURAT_LOGIN_SUCCESS: 'ZIGGURAT_LOGIN_SUCCESS',
  CHECK_LOGIN_REQUEST: 'CHECK_LOGIN_REQUEST',
  CHECK_LOGIN_FAILURE: 'CHECK_LOGIN_FAILURE',
  CHECK_LOGIN_SUCCESS: 'CHECK_LOGIN_SUCCESS',
  SET_SESSION_INFORMATIONS: 'SET_SESSION_INFORMATIONS',
};

function zigguratLoginRequest() {
  return {
    type: constants.ZIGGURAT_LOGIN_REQUEST,
  };
}

function zigguratLoginSuccess() {
  return {
    type: constants.ZIGGURAT_LOGIN_SUCCESS,
  };
}

function zigguratLoginFailure() {
  return {
    type: constants.ZIGGURAT_LOGIN_FAILURE,
  };
}

function checkLoginRequest() {
  return {
    type: constants.ZIGGURAT_LOGIN_REQUEST,
  };
}

function checkLoginSuccess() {
  return {
    type: constants.ZIGGURAT_LOGIN_SUCCESS,
  };
}

function checkLoginFailure() {
  return {
    type: constants.ZIGGURAT_LOGIN_FAILURE,
  };
}

function setSessionInformations(user, authenticated, email, groups) {
  return {
    type: constants.SET_SESSION_INFORMATIONS,
    user: user,
    authenticated: authenticated,
    email: email,
    groups: groups,
  };
}

function sendCredentialsToZiggurat(username, password) {
  return (dispatch) => {
    dispatch(zigguratLoginRequest());
    myHttp.postFormData('/login', {
      'user_name': username,
      password: password,
      'provider_name': 'ziggurat',
    })
      .then(data => {
        dispatch(zigguratLoginSuccess());
        console.log(data);
      })
      .catch(err => {
        dispatch(zigguratLoginFailure());
        console.log(err);
      });
  };
}

function checkLogin() {
  return (dispatch) => {
    dispatch(checkLoginRequest());
    myHttp.get('/session')
      .then(res => res.json())
      .then(session => {
        console.log('received session status: %o', session);
        dispatch(checkLoginSuccess());
        dispatch(setSessionInformations(session['user_name'], session['authenticated'], session['user_email'], session['group_names']));
      })
      .catch(err => {
        console.log(err);
        dispatch(checkLoginFailure());
      });
  };
}

// Action Creators
export const actions = {
  sendCredentialsToZiggurat,
  checkLogin,
};

// Handlers
const HANDLERS = {
  [constants.ZIGGURAT_LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.ZIGGURAT_LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.ZIGGURAT_LOGIN_FAILURE]: (state, action) => { return state; },
  [constants.CHECK_LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.CHECK_LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.CHECK_LOGIN_FAILURE]: (state, action) => { return state; },
  [constants.SET_SESSION_INFORMATIONS]: (state, action) => {
    return ({...state, sessionStatus: {
      user: {
        username: action.user,
        authenticated: action.authenticated,
        email: action.email,
        groupe: action.groups,
      },
    }});
  },
};

// Reducer
export const initialState = {
  sessionStatus: {
    user: {
      username: '',
      authenticated: false,
      email: '',
      groups: [],
    },
  },
};

export default function(state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
