import myHttp from '../../util/http';
import {NotificationManager} from 'react-notifications';

// Constants
export const constants = {
  LOGIN_REQUEST: 'SESSION.LOGIN_REQUEST',
  LOGIN_FAILURE: 'SESSION.LOGIN_FAILURE',
  LOGIN_SUCCESS: 'SESSION.LOGIN_SUCCESS',
  LOGOUT_REQUEST: 'SESSION.LOGOUT_REQUEST',
  LOGOUT_FAILURE: 'SESSION.LOGOUT_FAILURE',
  LOGOUT_SUCCESS: 'SESSION.LOGOUT_SUCCESS',
  CHECK_LOGIN_REQUEST: 'SESSION.CHECK_LOGIN_REQUEST',
  CHECK_LOGIN_FAILURE: 'SESSION.CHECK_LOGIN_FAILURE',
  CHECK_LOGIN_SUCCESS: 'SESSION.CHECK_LOGIN_SUCCESS',
  SET_SESSION_INFORMATIONS: 'SESSION.SET_SESSION_INFORMATIONS',
  RESET_SESSION_INFORMATIONS: 'SESSION.RESET_SESSION_INFORMATIONS',
  LOGOUT: 'SESSION.LOGOUT',
};

function zigguratLoginRequest () {
  return {
    type: constants.LOGIN_REQUEST,
  };
}

function zigguratLoginSuccess () {
  return {
    type: constants.LOGIN_SUCCESS,
  };
}

function zigguratLoginFailure () {
  return {
    type: constants.LOGIN_FAILURE,
  };
}

function checkLoginRequest () {
  return {
    type: constants.CHECK_LOGIN_REQUEST,
  };
}

function checkLoginSuccess () {
  return {
    type: constants.CHECK_LOGIN_SUCCESS,
  };
}

function checkLoginFailure () {
  return {
    type: constants.CHECK_LOGIN_FAILURE,
  };
}

function setSessionInformations (user, authenticated, email, groups) {
  return {
    type: constants.SET_SESSION_INFORMATIONS,
    user: user,
    authenticated: authenticated,
    email: email,
    groups: groups,
  };
}

function sessionLogoutRequest () {
  return {
    type: constants.LOGOUT_REQUEST,
  };
}

function sessionLogoutSuccess () {
  return {
    type: constants.LOGOUT_SUCCESS,
  };
}

function sessionLogoutFailure () {
  return {
    type: constants.LOGOUT_FAILURE,
  };
}

function resetSessionInformation () {
  return {
    type: constants.RESET_SESSION_INFORMATIONS,
  };
}

function logout () {
  return dispatch => {
    dispatch(sessionLogoutRequest());
    myHttp.get(`${__PAVICS_MAGPIE_PATH__}/signout`)
      .then(() => {
        NotificationManager.success('You have been logged out of the platform.', 'Success', 10000);
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
  return dispatch => {
    dispatch(zigguratLoginRequest());
    myHttp.postUrlEncodedForm(`${__PAVICS_MAGPIE_PATH__}/signin`, {
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
    myHttp.get(`${__PAVICS_MAGPIE_PATH__}/session`)
      .then(res => res.json())
      .then(session => {
        console.log('received session status: %o', session);
        dispatch(checkLoginSuccess());
        if (session.authenticated === true) {
          NotificationManager.success('You have been logged in to the platform.', 'Success', 10000);
          dispatch(setSessionInformations(
            session['user']['user_name'],
            session['authenticated'],
            session['user']['user_email'],
            session['user']['group_names']
          ));
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
  [constants.LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.LOGIN_FAILURE]: (state, action) => { return state; },
  [constants.CHECK_LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.CHECK_LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.CHECK_LOGIN_FAILURE]: (state, action) => { return state; },
  [constants.SET_SESSION_INFORMATIONS]: (state, action) => {
    return ({
      ...state, sessionStatus: {
        user: {
          username: action.user,
          authenticated: action.authenticated,
          email: action.email,
          groups: action.groups,
        },
      }
    });
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

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
