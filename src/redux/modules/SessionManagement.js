import myHttp from './../../../lib/http';
import cookie from 'react-cookies';

// Constants
export const constants = {
  ZIGGURAT_LOGIN_REQUEST: 'ZIGGURAT_LOGIN_REQUEST',
  ZIGGURAT_LOGIN_FAILURE: 'ZIGGURAT_LOGIN_FAILURE',
  ZIGGURAT_LOGIN_SUCCESS: 'ZIGGURAT_LOGIN_SUCCESS',
  SESSION_LOGOUT_REQUEST: 'SESSION_LOGOUT_REQUEST',
  SESSION_LOGOUT_FAILURE: 'SESSION_LOGOUT_FAILURE',
  SESSION_LOGOUT_SUCCESS: 'SESSION_LOGOUT_SUCCESS',
  SESSION_CHECK_LOGIN_REQUEST: 'SESSION_CHECK_LOGIN_REQUEST',
  SESSION_CHECK_LOGIN_FAILURE: 'SESSION_CHECK_LOGIN_FAILURE',
  SESSION_CHECK_LOGIN_SUCCESS: 'SESSION_CHECK_LOGIN_SUCCESS',
  SET_SESSION_INFORMATIONS: 'SET_SESSION_INFORMATIONS',
  RESET_SESSION_INFORMATIONS: 'RESET_SESSION_INFORMATIONS',
  SESSION_LOGOUT: 'SESSION_LOGOUT',
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
    type: constants.SESSION_CHECK_LOGIN_REQUEST,
  };
}

function checkLoginSuccess() {
  return {
    type: constants.SESSION_CHECK_LOGIN_SUCCESS,
  };
}

function checkLoginFailure() {
  return {
    type: constants.SESSION_CHECK_LOGIN_FAILURE,
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

function sessionLogoutRequest() {
  return {
    type: constants.SESSION_LOGOUT_REQUEST,
  };
}

function sessionLogoutSuccess() {
  return {
    type: constants.SESSION_LOGOUT_SUCCESS,
  };
}

function sessionLogoutFailure() {
  return {
    type: constants.SESSION_LOGOUT_FAILURE,
  };
}

function resetSessionInformation() {
  return {
    type: constants.RESET_SESSION_INFORMATIONS,
  };
}

function logout() {
  return dispatch => {
    dispatch(sessionLogoutRequest());
    cookie.remove('auth_tkt');
    myHttp.get('/logout')
      .then(res => {
        dispatch(sessionLogoutSuccess());
        dispatch(resetSessionInformation());
      })
      .catch(err => {
        console.log(err);
        dispatch(sessionLogoutFailure());
      });
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
        dispatch(checkLogin());
      })
      .catch(err => {
        dispatch(zigguratLoginFailure());
        console.log(err);
      });
  };
}

function checkLogin() {
  return (dispatch) => {
    console.log('in actual checking login');
    dispatch(checkLoginRequest());
    myHttp.get('/session')
      .then(res => res.json())
      .then(session => {
        console.log('received session status: %o', session);
        dispatch(checkLoginSuccess());
        if (session.authenticated === true) {
          dispatch(setSessionInformations(session['user_name'], session['authenticated'], session['user_email'], session['group_names']));
        }
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
  logout,
};

// Handlers
const HANDLERS = {
  [constants.ZIGGURAT_LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.ZIGGURAT_LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.ZIGGURAT_LOGIN_FAILURE]: (state, action) => { return state; },
  [constants.SESSION_CHECK_LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.SESSION_CHECK_LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.SESSION_CHECK_LOGIN_FAILURE]: (state, action) => { return state; },
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
  [constants.RESET_SESSION_INFORMATIONS]: (state, action) => {
    return ({...state, sessionStatus: initialState.sessionStatus});
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
