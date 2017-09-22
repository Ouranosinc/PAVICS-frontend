import myHttp from './../../../lib/http';

// Constants
export const constants = {
  ZIGGURAT_LOGIN_REQUEST: 'ZIGGURAT_LOGIN_REQUEST',
  ZIGGURAT_LOGIN_FAILURE: 'ZIGGURAT_LOGIN_FAILURE',
  ZIGGURAT_LOGIN_SUCCESS: 'ZIGGURAT_LOGIN_SUCCESS',
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
    tpe: constants.ZIGGURAT_LOGIN_FAILURE,
  };
}

function sendCredentialsToZiggurat(username, password) {
  return (dispatch) => {
    dispatch(zigguratLoginRequest());
    // use json, not form data, to send data to our sane koa backend
    myHttp.postFormData('/login', {
      'user_name': username,
      password: password,
      'provider_name': 'ziggurat',
    })
      .then(data => {
        console.log('SessionManagement handler received from login!: %o', data);
        dispatch(zigguratLoginSuccess());
        console.log(data);
      })
      .catch(err => {
        dispatch(zigguratLoginFailure());
        console.log(err);
      });
  };
}

// Action Creators
export const actions = {
  sendCredentialsToZiggurat,
};

// Handlers
const HANDLERS = {
  [constants.ZIGGURAT_LOGIN_REQUEST]: (state, action) => { return state; },
  [constants.ZIGGURAT_LOGIN_SUCCESS]: (state, action) => { return state; },
  [constants.ZIGGURAT_LOGIN_FAILURE]: (state, action) => { return state; },
};

// Reducer
export const initialState = {
  sessionStatus: {
    user: {
      'user_name': 'anonymous',
      authenticated: false,
      'user_email': '',
      'group_names': ['anonymous'],
    },
  },
};

export default function(state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
