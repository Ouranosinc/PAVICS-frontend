import { NotificationManager } from 'react-notifications';
import myHttp from './../../../lib/http';

// Constants
export const constants = {
  MONITOR_FETCH_WPS_JOBS_REQUEST: 'MONITOR_FETCH_WPS_JOBS_REQUEST',
  MONITOR_FETCH_WPS_JOBS_FAILURE: 'MONITOR_FETCH_WPS_JOBS_FAILURE',
  MONITOR_FETCH_WPS_JOBS_SUCCESS: 'MONITOR_FETCH_WPS_JOBS_SUCCESS',
  MONITOR_POLL_WPS_JOBS_SUCCESS: 'MONITOR_POLL_WPS_JOBS_SUCCESS',
  MONITOR_PERSIST_TEMPORARY_RESULT_REQUEST: 'MONITOR_PERSIST_TEMPORARY_RESULT_REQUEST',
  MONITOR_PERSIST_TEMPORARY_RESULT_FAILURE: 'MONITOR_PERSIST_TEMPORARY_RESULT_FAILURE',
  MONITOR_PERSIST_TEMPORARY_RESULT_SUCCESS: 'MONITOR_PERSIST_TEMPORARY_RESULT_SUCCESS',
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

function requestPersistTemporaryResult () {
  return {
    type: constants.MONITOR_PERSIST_TEMPORARY_RESULT_REQUEST,
    persist: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {},
      count: 0

    }
  };
}

function receivePersistTemporaryResultFailure (error) {
  NotificationManager.error(`Failed at persisting a temporary result. Returned Status ${error.status}: ${error.message}`);
  return {
    type: constants.MONITOR_PERSIST_TEMPORARY_RESULT_FAILURE,
    persist: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}

function receivePersistTemporaryResult (data) {
  NotificationManager.success(`Persisted file with success at ${data.url}`);
  return {
    type: constants.MONITOR_PERSIST_TEMPORARY_RESULT_SUCCESS,
    persist: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
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
export function persistTemporaryResult (resource, location, overwrite, defaultFacets) {
  return (dispatch) => {
    dispatch(requestPersistTemporaryResult());
    return fetch(`/wps/persist?resource=${resource}&location=${location}&overwrite=${overwrite}&default_facets=${JSON.stringify(defaultFacets)}`)
      .then(response => {
        if(!response.ok){
          // Real msg is there: response.body.message; but not working as intended
          dispatch(receivePersistTemporaryResultFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        }else{
          return response.json();
        }
      })
      .then(json => {
        if(json) dispatch(receivePersistTemporaryResult(json));
      }, err => {
        // Not sure it'll ever happen
      });
  };
}


// Exported Action Creators
export const actions = {
  fetchWPSJobs: fetchWPSJobs,
  pollWPSJobs: pollWPSJobs,
  persistTemporaryResult: persistTemporaryResult
};

export const initialState = {
  jobs: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    count: 0,
    error: null
  },
  persist: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
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
