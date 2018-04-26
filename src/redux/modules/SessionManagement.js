import myHttp from './../../../lib/http';
import cookie from 'react-cookies';
import { NotificationManager } from 'react-notifications';

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
        NotificationManager.success(`You have been logged out of the platform.`, 'Success', 4000);
        dispatch(sessionLogoutSuccess());
        dispatch(resetSessionInformation());
      })
      .catch(err => {
        NotificationManager.error(`An error occurred when logging you out of the platform: ${JSON.stringify(err)}`, 'Error', 10000);
        console.log('error during logout: %o', err);
        dispatch(sessionLogoutFailure());
      });
  };
}

function sendCredentialsToZiggurat(username, password) {
  return (dispatch) => {
    dispatch(zigguratLoginRequest());
    myHttp.postUrlEncodedForm('/login', {
      'user_name': username,
      password: password,
      'provider_name': 'ziggurat',
    })
      .then(response => {
        console.log('this shit was actually considered as a sendCredentialsToZiggurat success %o', response);
        if (response.status === 401) {
          dispatch(zigguratLoginFailure());
          NotificationManager.error(`The user ${username} is not authorized on the platform.`, 'Error', 10000);
        } else {
          dispatch(zigguratLoginSuccess());
          dispatch(checkLogin());
        }
      })
      .catch(err => {
        dispatch(zigguratLoginFailure());
        NotificationManager.error(`An error occurred when trying to send credentials to Ziggurat: ${JSON.stringify(err)}`, 'Error', 10000);
        console.log('error in sendCredentialsToZiggurat: %o', err);
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
          NotificationManager.success('You have been logged in to the platform.', 'Success', 4000);
          dispatch(setSessionInformations(session['user_name'], session['authenticated'], session['user_email'], session['group_names']));
        }
      })
      .catch(err => {
        NotificationManager.error(`An error occurred when trying to login: ${JSON.stringify(err)}`, 'Error', 10000);
        console.log('error login: %o', err);
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
