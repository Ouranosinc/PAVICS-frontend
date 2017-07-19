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
      items: [],
      count: 0

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
      count: 0,
      error: error
    }
  };
}

function receiveWPSJobs (data) {
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

function fetchWPSJobs (limit = 5, page = 1, sort = 'created') {
  return function (dispatch) {
    dispatch(requestWPSJobs());
    return fetch(`/phoenix/jobs?limit=${limit}&page=${page}&sort=${sort}`)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveWPSJobs(json))
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
