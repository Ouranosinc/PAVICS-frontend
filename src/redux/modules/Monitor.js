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
  MONITOR_VISUALIZE_TEMPORARY_RESULT_REQUEST: 'MONITOR_VISUALIZE_TEMPORARY_RESULT_REQUEST',
  MONITOR_VISUALIZE_TEMPORARY_RESULT_FAILURE: 'MONITOR_VISUALIZE_TEMPORARY_RESULT_FAILURE',
  MONITOR_VISUALIZE_TEMPORARY_RESULT_SUCCESS: 'MONITOR_VISUALIZE_TEMPORARY_RESULT_SUCCESS'
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
    persistedTempDataset: {
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
    persistedTempDataset: {
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
    persistedTempDataset: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      error: null
    }
  };
}

function requestVisualizeTemporaryResult () {
  return {
    type: constants.MONITOR_VISUALIZE_TEMPORARY_RESULT_REQUEST,
    visualizedTempDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: [],
      count: 0

    }
  };
}

function receiveVisualizeTemporaryResultFailure (error) {
  NotificationManager.error(`Failed at visualizing a temporary result. Returned Status ${error.status}: ${error.message}`);
  return {
    type: constants.MONITOR_VISUALIZE_TEMPORARY_RESULT_FAILURE,
    visualizedTempDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}

function receiveVisualizeTemporaryResult (datasets) {
  return {
    type: constants.MONITOR_VISUALIZE_TEMPORARY_RESULT_SUCCESS,
    visualizedTempDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
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
    return myHttp.get(`/wps/persist?resource=${resource}&location=${location}&overwrite=${overwrite}&default_facets=${JSON.stringify(defaultFacets)}`)
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
export function visualizeTemporaryResult (resources, aggregate = false) {
  return (dispatch) => {
    dispatch(requestVisualizeTemporaryResult());
    let url = `/wps/visualize?`;
    resources.forEach(res => {
      url += `resource=${res}&`
    });
    url += `aggregate=${aggregate}`;
    return myHttp.get(url)
      .then(response => {
        if(!response.ok){
          // Real msg is there: response.body.message; but not working as intended
          dispatch(receiveVisualizeTemporaryResultFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        }else{
          return response.json();
        }
      })
      .then(json => {
        if(json) dispatch(receiveVisualizeTemporaryResult(json.response.docs));
      }, err => {
        // Not sure it'll ever happen
      });
  };
}


// Exported Action Creators
export const actions = {
  fetchWPSJobs: fetchWPSJobs,
  pollWPSJobs: pollWPSJobs,
  persistTemporaryResult: persistTemporaryResult,
  visualizeTemporaryResult: visualizeTemporaryResult
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
  persistedTempDataset: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  visualizedTempDatasets: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
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
  [constants.MONITOR_PERSIST_TEMPORARY_RESULT_REQUEST]: (state, action) => {
    return ({...state, persistedTempDataset: action.persistedTempDataset});
  },
  [constants.MONITOR_PERSIST_TEMPORARY_RESULT_FAILURE]: (state, action) => {
    return ({...state, persistedTempDataset: action.persistedTempDataset});
  },
  [constants.MONITOR_PERSIST_TEMPORARY_RESULT_SUCCESS]: (state, action) => {
    return ({...state, persistedTempDataset: action.persistedTempDataset});
  },
  [constants.MONITOR_VISUALIZE_TEMPORARY_RESULT_REQUEST]: (state, action) => {
    return ({...state, visualizedTempDatasets: action.visualizedTempDatasets});
  },
  [constants.MONITOR_VISUALIZE_TEMPORARY_RESULT_FAILURE]: (state, action) => {
    return ({...state, visualizedTempDatasets: action.visualizedTempDatasets});
  },
  [constants.MONITOR_VISUALIZE_TEMPORARY_RESULT_SUCCESS]: (state, action) => {
    return ({...state, visualizedTempDatasets: action.visualizedTempDatasets});
  },
};

export default function (state = initialState, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
