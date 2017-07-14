// Constants
export const constants = {
  MONITOR_FETCH_WPS_JOBS_REQUEST: 'MONITOR_FETCH_WPS_JOBS_REQUEST',
  MONITOR_FETCH_WPS_JOBS_FAILURE: 'MONITOR_FETCH_WPS_JOBS_FAILURE',
  MONITOR_FETCH_WPS_JOBS_SUCCESS: 'MONITOR_FETCH_WPS_JOBS_SUCCESS',
  MONITOR_FETCH_WPS_JOBS_COUNT_REQUEST: 'MONITOR_FETCH_WPS_JOBS_COUNT_REQUEST',
  MONITOR_FETCH_WPS_JOBS_COUNT_FAILURE: 'MONITOR_FETCH_WPS_JOBS_COUNT_FAILURE',
  MONITOR_FETCH_WPS_JOBS_COUNT_SUCCESS: 'MONITOR_FETCH_WPS_JOBS_COUNT_SUCCESS'
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

function requestWPSJobsCount () {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_COUNT_REQUEST,
    jobsCount: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {}
    }
  };
}

function receiveWPSJobsCountFailure (error) {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_COUNT_FAILURE,
    jobsCount: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}

function receiveWPSJobsCount (count) {
  return {
    type: constants.MONITOR_FETCH_WPS_JOBS_COUNT_SUCCESS,
    jobsCount: {
      receivedAt: Date.now(),
      isFetching: false,
      data: count,
      error: null
    }
  };
}

function fetchWPSJobs (limit = 5, page = 1, sort = 'created') {
  return function (dispatch) {
    dispatch(requestWPSJobs());
    return fetch(`/phoenix/jobs?limit=${limit}&page=${page}&sort=${sort}`)
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

function fetchWPSJobsCount () {
  return function (dispatch) {
    dispatch(requestWPSJobsCount());
    return fetch(`/phoenix/jobsCount`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWPSJobsCount(json))
      )
      .catch(error => {
        console.log(error);
        dispatch(receiveWPSJobsCountFailure(error));
      });
  };
}

// Exported Action Creators
export const actions = {
  fetchWPSJobs: fetchWPSJobs,
  fetchWPSJobsCount: fetchWPSJobsCount
};

export const initialState = {
  jobs: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    error: null
  },
  jobsCount: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
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
  [constants.MONITOR_FETCH_WPS_JOBS_COUNT_REQUEST]: (state, action) => {
    return ({...state, jobsCount: action.jobsCount});
  },
  [constants.MONITOR_FETCH_WPS_JOBS_COUNT_FAILURE]: (state, action) => {
    return ({...state, jobsCount: action.jobsCount});
  },
  [constants.MONITOR_FETCH_WPS_JOBS_COUNT_SUCCESS]: (state, action) => {
    return ({...state, jobsCount: action.jobsCount});
  },
};

export default function (state = initialState, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
