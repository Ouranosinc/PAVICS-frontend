import { NotificationManager } from 'react-notifications';
import myHttp from '../../util/http';
import { JOB_PROJECT_PREFIX } from './../../constants';

// Constants
export const constants = {
  AGGREGATE_PROJECT_TWITCHER_JOBS: 'MONITOR.AGGREGATE_PROJECT_TWITCHER_JOBS',
  FETCH_TWITCHER_JOBS_REQUEST: 'MONITOR.FETCH_TWITCHER_JOBS_REQUEST',
  FETCH_TWITCHER_JOBS_FAILURE: 'MONITOR.FETCH_TWITCHER_JOBS_FAILURE',
  FETCH_TWITCHER_JOBS_SUCCESS: 'MONITOR.FETCH_TWITCHER_JOBS_SUCCESS',
  FETCH_PROJECT_JOBS_REQUEST: 'MONITOR.FETCH_PROJECT_JOBS_REQUEST',
  FETCH_PROJECT_JOBS_FAILURE: 'MONITOR.FETCH_PROJECT_JOBS_FAILURE',
  FETCH_PROJECT_JOBS_SUCCESS: 'MONITOR.FETCH_PROJECT_JOBS_SUCCESS',
  POLL_WPS_JOBS_SUCCESS: 'MONITOR.POLL_WPS_JOBS_SUCCESS',
  PERSIST_TEMPORARY_RESULT_REQUEST: 'MONITOR.PERSIST_TEMPORARY_RESULT_REQUEST',
  PERSIST_TEMPORARY_RESULT_FAILURE: 'MONITOR.PERSIST_TEMPORARY_RESULT_FAILURE',
  PERSIST_TEMPORARY_RESULT_SUCCESS: 'MONITOR.PERSIST_TEMPORARY_RESULT_SUCCESS',
  VISUALIZE_TEMPORARY_RESULT_REQUEST: 'MONITOR.VISUALIZE_TEMPORARY_RESULT_REQUEST',
  VISUALIZE_TEMPORARY_RESULT_FAILURE: 'MONITOR.VISUALIZE_TEMPORARY_RESULT_FAILURE',
  VISUALIZE_TEMPORARY_RESULT_SUCCESS: 'MONITOR.VISUALIZE_TEMPORARY_RESULT_SUCCESS'
};

//Actions Creators
function requestProjectJobs () {
  return {
    type: constants.FETCH_PROJECT_JOBS_REQUEST,
    jobs: {
      requestedAt: Date.now(),
      isFetching: true,
      items: [],
      count: 0
    }
  };
}

function receiveProjectJobsFailure (error) {
  NotificationManager.error(`Failed at fetching Phoenix Jobs at address ${error.url}. Returned Status ${error.status}: ${error.message}`, 'Error', 10000);
  return {
    type: constants.FETCH_PROJECT_JOBS_FAILURE,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      count: 0,
      error: error
    }
  };
}

function receiveProjectJobs (data) {
  return {
    type: constants.FETCH_PROJECT_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: data.jobs,
      count: data.count,
      error: null
    }
  };
}
function requestTwitcherJobs () {
  return {
    type: constants.FETCH_TWITCHER_JOBS_REQUEST,
    jobs: {
      requestedAt: Date.now(),
      isFetching: true,
      items: [],
      count: 0
    }
  };
}

function receiveTwitcherJobsFailure (error) {
  NotificationManager.error(`Failed at fetching Phoenix Jobs at address ${error.url}. Returned Status ${error.status}: ${error.message}`, 'Error', 10000);
  return {
    type: constants.FETCH_TWITCHER_JOBS_FAILURE,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: [],
      count: 0,
      error: error
    }
  };
}

function receiveTwitcherJobs (data) {
  /*data.jobs =[{
    status	:	'finished',
    logs	:	'https://hirondelle.crim.ca/twitcher/jobs/29536171-acc5-4662-837d-df87393029c4/logs',
    results	:	'https://hirondelle.crim.ca/twitcher/jobs/29536171-acc5-4662-837d-df87393029c4/results',
    progress	:	100,
    message	:	'Job finished',
    id	:	'29536171-acc5-4662-837d-df87393029c4'
  }];*/
  NotificationManager.success('Mocking server returned jobs');
  let jobs = data.jobs.map(id => {
    return {
      status:	'succeeded',
      logs:	`https://hirondelle.crim.ca/twitcher/jobs/${id}/logs`,
      results: `https://hirondelle.crim.ca/twitcher/jobs/${id}/results`,
      progress: 100,
      message: 'Job mocked',
      id:	id
    };
  });
  return {
    type: constants.FETCH_TWITCHER_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: jobs,
      count: data.count,
      error: null
    }
  };
  /*return {
   type: constants.FETCH_TWITCHER_JOBS_SUCCESS,
   jobs: {
   receivedAt: Date.now(),
   isFetching: false,
   items: data.jobs,
   count: data.count,
   error: null
   }
   };*/
}

function requestPersistTemporaryResult () {
  return {
    type: constants.PERSIST_TEMPORARY_RESULT_REQUEST,
    persistedTempDataset: {
      requestedAt: Date.now(),
      isFetching: true,
      data: {},
      count: 0
    }
  };
}

function receivePersistTemporaryResultFailure (error) {
  NotificationManager.error(`Failed at persisting a temporary result. Returned Status ${error.status}: ${error.message}`, 'Error', 10000);
  return {
    type: constants.PERSIST_TEMPORARY_RESULT_FAILURE,
    persistedTempDataset: {
      receivedAt: Date.now(),
      isFetching: false,
      data: {},
      error: error
    }
  };
}

function receivePersistTemporaryResult (data) {
  NotificationManager.success(`Persisted file with success at ${data.url}`, 'Success', 4000);
  return {
    type: constants.PERSIST_TEMPORARY_RESULT_SUCCESS,
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
    type: constants.VISUALIZE_TEMPORARY_RESULT_REQUEST,
    visualizedTempDatasets: {
      requestedAt: Date.now(),
      isFetching: true,
      items: [],
      count: 0

    }
  };
}

function receiveVisualizeTemporaryResultFailure (error) {
  NotificationManager.error(`Failed at visualizing a temporary result. Returned Status ${error.status}: ${error.message}`, 'Error', 10000);
  return {
    type: constants.VISUALIZE_TEMPORARY_RESULT_FAILURE,
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
    type: constants.VISUALIZE_TEMPORARY_RESULT_SUCCESS,
    visualizedTempDatasets: {
      receivedAt: Date.now(),
      isFetching: false,
      items: datasets,
      error: null
    }
  };
}

function aggregateProjectTwitcherJobs(jobs, count) {
  return {
    type: constants.AGGREGATE_PROJECT_TWITCHER_JOBS,
    jobs: jobs,
    count: count
  };

}

function aggregateProjectJobsInfo (projectId) {
  return (dispatch, getState) => {
    const twitcherJobs = getState().monitor.twitcherJobs.items;
    const jobsCount = getState().monitor.twitcherJobs.count;
    dispatch(requestProjectJobs());

    // Project-API stores all needed information about launched job from the platform
    myHttp.get(`${__PAVICS_PROJECT_API_PATH__}/Projects/${projectId}/jobs/`)
      .then(response => {
        if(!response.ok){
          dispatch(receiveProjectJobsFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        }else{
          return response.json();
        }
      })
      .then(jobs => {
        dispatch(receiveProjectJobs(jobs));
        let aggJobs = [];
        twitcherJobs.forEach(job => {
          let twitcherJob = Object.assign({},job);
          const projectJob = jobs.find(j => j.twitcherJobId === job.id);
          if(projectJob) {
            twitcherJob.name = projectJob.name;
            twitcherJob.createdOn = projectJob.createdOn;
            twitcherJob.processId = projectJob.twitcherProcessId;
            twitcherJob.providerId = projectJob.twitcherProviderId;
          } else {
            twitcherJob.name = 'desync';
            twitcherJob.createdOn = '2018-11-08T14:57:25.547Z';
            twitcherJob.processId = 'desync';
            twitcherJob.providerId = 'desync';
          }
          aggJobs.push(twitcherJob);
        });
        dispatch(aggregateProjectTwitcherJobs(aggJobs, jobsCount));

      }, err => {
        dispatch(receiveProjectJobsFailure({
          status: 200,
          message: err.message,
          stack: err.stack
        }));
      })
  }
}


function fetchTwitcherJobs (projectId, limit = 5, page = 0, sort = 'created') {
  const tag = `${JOB_PROJECT_PREFIX}${projectId}`;
  return (dispatch) => {
    dispatch(requestTwitcherJobs());
    return myHttp.get(`${__PAVICS_TWITCHER_API_PATH__}/jobs?access=all&detail=true&tags=${tag}&page=${page}&limit=${limit}&sort=${sort}`)
    // return myHttp.get(`/phoenix/jobs?projectId=${projectId}&limit=${limit}&page=${page}&sort=${sort}`)
      .then(response => {
        if(!response.ok){
          dispatch(receiveTwitcherJobsFailure({
            status: response.status,
            message: response.statusText,
            url: response.url
          }));
        }else{
          return response.json();
        }
      })
      .then(json => {
        dispatch(receiveTwitcherJobs(json));
        if(json.jobs.length) {
          dispatch(aggregateProjectJobsInfo(projectId));
        }
      }, err => {
        throw new Error(err);
        dispatch(receiveTwitcherJobsFailure({
          status: 200,
          message: err.message,
          stack: err.stack
        }));
      });
  };
}

function receivePollWPSJobs (data) {
  return {
    type: constants.FETCH_TWITCHER_JOBS_SUCCESS,
    jobs: {
      receivedAt: Date.now(),
      isFetching: false,
      items: data.jobs,
      count: data.count,
      error: null
    }
  };
}

function pollTwitcherJobs (projectId, limit = 5, page = 0, sort = 'created') {
  const tag = `${JOB_PROJECT_PREFIX}${projectId}`;
  return (dispatch) => {
    return myHttp.get(`${__PAVICS_TWITCHER_API_PATH__}/jobs?access=all&detail=true&tags=${tag}&page=${page}&limit=${limit}&sort=${sort}`)
      .then(response => {
        if(response.ok){
          return response.json();
        }
      })
      .then(json => {
        dispatch(receivePollWPSJobs(json));
        if(json.jobs.length) {
          dispatch(aggregateProjectJobsInfo(projectId));
        }
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
  fetchTwitcherJobs: fetchTwitcherJobs,
  pollTwitcherJobs: pollTwitcherJobs,
  persistTemporaryResult: persistTemporaryResult,
  visualizeTemporaryResult: visualizeTemporaryResult
};

export const initialState = {
  jobs: [], // Aggregation by Ids of twitcherJobs and projectJobs
  jobsCount: 0,
  twitcherJobs: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    items: [],
    count: 0,
    error: null
  },
  projectJobs: {
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
  [constants.FETCH_TWITCHER_JOBS_REQUEST]: (state, action) => {
    return ({...state, twitcherJobs: action.jobs});
  },
  [constants.FETCH_TWITCHER_JOBS_FAILURE]: (state, action) => {
    return ({...state, twitcherJobs: action.jobs});
  },
  [constants.FETCH_TWITCHER_JOBS_SUCCESS]: (state, action) => {
    return ({...state, twitcherJobs: action.jobs});
  },
  [constants.AGGREGATE_PROJECT_TWITCHER_JOBS]: (state, action) => {
    return ({...state, jobs: action.jobs, jobsCount: action.count});
  },
  [constants.FETCH_PROJECT_JOBS_REQUEST]: (state, action) => {
    return ({...state, projectJobs: action.jobs});
  },
  [constants.FETCH_PROJECT_JOBS_FAILURE]: (state, action) => {
    return ({...state, projectJobs: action.jobs});
  },
  [constants.FETCH_PROJECT_JOBS_SUCCESS]: (state, action) => {
    return ({...state, projectJobs: action.jobs});
  },
  [constants.POLL_WPS_JOBS_SUCCESS]: (state, action) => {
    return ({...state, jobs: action.jobs});
  },
  [constants.PERSIST_TEMPORARY_RESULT_REQUEST]: (state, action) => {
    return ({...state, persistedTempDataset: action.persistedTempDataset});
  },
  [constants.PERSIST_TEMPORARY_RESULT_FAILURE]: (state, action) => {
    return ({...state, persistedTempDataset: action.persistedTempDataset});
  },
  [constants.PERSIST_TEMPORARY_RESULT_SUCCESS]: (state, action) => {
    return ({...state, persistedTempDataset: action.persistedTempDataset});
  },
  [constants.VISUALIZE_TEMPORARY_RESULT_REQUEST]: (state, action) => {
    return ({...state, visualizedTempDatasets: action.visualizedTempDatasets});
  },
  [constants.VISUALIZE_TEMPORARY_RESULT_FAILURE]: (state, action) => {
    return ({...state, visualizedTempDatasets: action.visualizedTempDatasets});
  },
  [constants.VISUALIZE_TEMPORARY_RESULT_SUCCESS]: (state, action) => {
    return ({...state, visualizedTempDatasets: action.visualizedTempDatasets});
  },
};

export default function (state = initialState, action) {
  const handler = MONITOR_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
