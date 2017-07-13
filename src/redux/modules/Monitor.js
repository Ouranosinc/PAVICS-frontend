// Constants
export const constants = {
  MONITOR_FETCH_WPS_JOBS_REQUEST: 'MONITOR_FETCH_WPS_JOBS_REQUEST',
  MONITOR_FETCH_WPS_JOBS_FAILURE: 'MONITOR_FETCH_WPS_JOBS_FAILURE',
  MONITOR_FETCH_WPS_JOBS_SUCCESS: 'MONITOR_FETCH_WPS_JOBS_SUCCESS'
};

//Actions Creators
function requestWPSJobs () {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_REQUEST,
    jobs: {
      requestedAt: Date.now(),
      isFetching: true,
      items: []
    }
  };
}

function receiveWPSJobsFailure (error) {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_FAILURE,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      error: error
    }
  };
}

function receiveWPSJobs (jobs) {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: jobs,
      error: null
    }
  };
}

function fetchWPSJobs () {
  return function (dispatch) {
    dispatch(requestWPSJobs());
    return fetch('/phoenix/jobs')
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWPSJobs(json.jobs))
      )
      .catch(error => {
        console.log(error);
        dispatch(receiveWPSJobsFailure(error));
      });
  };
}

// Exported Action Creators
export const actions = {
  fetchWPSJobs: fetchWPSJobs
};

export const initialState = {
  jobs: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
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
};

export default function (state = initialState, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
