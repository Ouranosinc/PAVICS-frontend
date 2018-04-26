import myHttp from './../../../lib/http';
import cookie from 'react-cookies';
import {NotificationManager} from 'react-notifications';
import {
  AUTH_COOKIE,
  ZIGGURAT_LOGIN_REQUEST,
  ZIGGURAT_LOGIN_SUCCESS,
  ZIGGURAT_LOGIN_FAILURE,
  SESSION_CHECK_LOGIN_REQUEST,
  SESSION_CHECK_LOGIN_FAILURE,
  SESSION_CHECK_LOGIN_SUCCESS,
  SESSION_LOGOUT_REQUEST,
  SESSION_LOGOUT_FAILURE,
  SESSION_LOGOUT_SUCCESS,
  SET_SESSION_INFORMATIONS,
  RESET_SESSION_INFORMATIONS,
} from '../../constants';

function zigguratLoginRequest () {
  return {
    type: ZIGGURAT_LOGIN_REQUEST,
  };
}

function zigguratLoginSuccess () {
  return {
    type: ZIGGURAT_LOGIN_SUCCESS,
  };
}

function zigguratLoginFailure () {
  return {
    type: ZIGGURAT_LOGIN_FAILURE,
  };
}

function checkLoginRequest () {
  return {
    type: SESSION_CHECK_LOGIN_REQUEST,
  };
}

function checkLoginSuccess () {
  return {
    type: SESSION_CHECK_LOGIN_SUCCESS,
  };
}

function checkLoginFailure () {
  return {
    type: SESSION_CHECK_LOGIN_FAILURE,
  };
}

function setSessionInformations (user, authenticated, email, groups) {
  return {
    type: SET_SESSION_INFORMATIONS,
    user: user,
    authenticated: authenticated,
    email: email,
    groups: groups,
  };
}

function sessionLogoutRequest () {
  return {
    type: SESSION_LOGOUT_REQUEST,
  };
}

function sessionLogoutSuccess () {
  return {
    type: SESSION_LOGOUT_SUCCESS,
  };
}

function sessionLogoutFailure () {
  return {
    type: SESSION_LOGOUT_FAILURE,
  };
}

function resetSessionInformation () {
  return {
    type: RESET_SESSION_INFORMATIONS,
  };
}

function logout () {
  return dispatch => {
    dispatch(sessionLogoutRequest());
    while (undefined !== cookie.load(AUTH_COOKIE)) {
      cookie.remove(AUTH_COOKIE);
    }
    myHttp.get('/logout')
      .then(() => {
        NotificationManager.success('You have been logged out of the platform.', 'Success', 4000);
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

function sendCredentialsToZiggurat (username, password) {
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

function checkLogin () {
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
  // abusing arrow functions auto return for single lining them
  [ZIGGURAT_LOGIN_REQUEST]: state => state,
  [ZIGGURAT_LOGIN_SUCCESS]: state => state,
  [ZIGGURAT_LOGIN_FAILURE]: state => state,
  [SESSION_CHECK_LOGIN_REQUEST]: state => state,
  [SESSION_CHECK_LOGIN_SUCCESS]: state => state,
  [SESSION_CHECK_LOGIN_FAILURE]: state => state,
  [SET_SESSION_INFORMATIONS]: (state, action) => {
    return ({
      ...state, sessionStatus: {
        user: {
          username: action.user,
          authenticated: action.authenticated,
          email: action.email,
          groupe: action.groups,
        },
      }
    });
  },
  [RESET_SESSION_INFORMATIONS]: (state) => {
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

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
