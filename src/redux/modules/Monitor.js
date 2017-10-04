import { NotificationManager } from 'react-notifications';
import myHttp from './../../../lib/http';

// Constants
export const constants = {
  MONITOR_FETCH_WPS_JOBS_REQUEST: 'MONITOR_FETCH_WPS_JOBS_REQUEST',
  MONITOR_FETCH_WPS_JOBS_FAILURE: 'MONITOR_FETCH_WPS_JOBS_FAILURE',
  MONITOR_FETCH_WPS_JOBS_SUCCESS: 'MONITOR_FETCH_WPS_JOBS_SUCCESS',
  MONITOR_POLL_WPS_JOBS_REQUEST: 'MONITOR_POLL_WPS_JOBS_REQUEST',
  MONITOR_POLL_WPS_JOBS_FAILURE: 'MONITOR_POLL_WPS_JOBS_FAILURE',
  MONITOR_POLL_WPS_JOBS_SUCCESS: 'MONITOR_POLL_WPS_JOBS_SUCCESS',
};

//Actions Creators
function requestWPSJobs () {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_REQUEST,
    jobs: {
      requestedAt: Date.now(),
      isFetching: true,
      items: [],
      count: 0

    }
  };
}

function receiveWPSJobsFailure (error) {
  NotificationManager.error(`Failed at fetching Phoenix Jobs at address ${error.url}. Returned Status ${error.status}: ${error.message}`);
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_FAILURE,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      count: 0,
      error: error
    }
  };
}

function receiveWPSJobs (data) {
  // NotificationManager.success('Test Success');
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: data.jobs,
      count: data.count,
      error: null
    }
  };
}

function fetchWPSJobs (projectId, limit = 5, page = 1, sort = 'created') {
  // Error handling as intended EXAMPLE !!
  return (dispatch) => {
    dispatch(requestWPSJobs());
    return myHttp.get(`/phoenix/jobs?projectId=${projectId}&limit=${limit}&page=${page}&sort=${sort}`)
      .then(response => {
        if(!response.ok){
          dispatch(receiveWPSJobsFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        }else{
          return response.json();
        }
      })
      .then(json => {
        if(json) dispatch(receiveWPSJobs(json));
      }, err => {
        // Not sure it'll ever happen
        // throw new Error(err);
        // dispatch(receiveWPSJobsFailure({
        //   status: 200,
        //   message: err.message,
        //   stack: err.stack
        // }));
      });
  };
}

function receivePollWPSJobs (data) {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: data.jobs,
      count: data.count,
      error: null
    }
  };
}

function pollWPSJobs (projectId, limit = 5, page = 1, sort = 'created') {
  return (dispatch) => {
    return myHttp.get(`/phoenix/jobs?projectId=${projectId}&limit=${limit}&page=${page}&sort=${sort}`)
      .then(response => {
        if(response.ok){
          return response.json();
        }
      })
      .then(json => {
        if(json) dispatch(receivePollWPSJobs(json));
      });
  };
}

// Exported Action Creators
export const actions = {
  fetchWPSJobs: fetchWPSJobs,
  pollWPSJobs: pollWPSJobs
};

export const initialState = {
  jobs: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    count: 0,
    error: null
  }
};

// Reducer
const MONITOR_HANDLERS = {
  [constants.MONITOR_FETCH_WPS_JOBS_REQUEST]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
  [constants.MONITOR_FETCH_WPS_JOBS_FAILURE]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
    [constants.MONITOR_FETCH_WPS_JOBS_SUCCESS]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
  [constants.MONITOR_POLL_WPS_JOBS_SUCCESS]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
};

export default function (state = initialState, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
