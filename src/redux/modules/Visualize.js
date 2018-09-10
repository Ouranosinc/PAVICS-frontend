import myHttp from '../../util/http';
import { GeoJSON, WMSCapabilities } from 'ol/format';
import { NotificationManager } from 'react-notifications';
import { VISUALIZE_DRAW_MODES, VISUALIZE_SET_MAP_MANIPULATION_MODE, VISUALIZE_MODE_GRID_VALUES} from './../../constants';

// Constants
export const constants = {
  // SYNC
  RESET_VISUALIZE_STATE: 'Visualize.RESET_VISUALIZE_STATE',
  ADD_SEARCH_CRITERIAS_TO_PROJECTS: 'Visualize.ADD_SEARCH_CRITERIAS_TO_PROJECTS',
  REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS: 'Visualize.REMOVE_SEARCH_CRITERIAS_FROM_PROJECTS',
  ADD_DATASETS_TO_PROJECTS: 'Visualize.ADD_DATASETS_TO_PROJECTS',
  CLICK_TOGGLE_PANEL: 'Visualize.CLICK_TOGGLE_PANEL',
  // ASYNC
  FETCH_PLOTLY_DATA_REQUEST: 'Visualize.FETCH_PLOTLY_DATA_REQUEST',
  FETCH_PLOTLY_DATA_FAILURE: 'Visualize.FETCH_PLOTLY_DATA_FAILURE',
  FETCH_PLOTLY_DATA_SUCCESS: 'Visualize.FETCH_PLOTLY_DATA_SUCCESS',
  FETCH_SCALAR_VALUE_REQUEST: 'Visualize.FETCH_SCALAR_VALUE_REQUEST',
  FETCH_SCALAR_VALUE_FAILURE: 'Visualize.FETCH_SCALAR_VALUE_FAILURE',
  FETCH_SCALAR_VALUE_SUCCESS: 'Visualize.FETCH_SCALAR_VALUE_SUCCESS'
};

// Action Creators
function resetVisualizeState() {
  return {
    type: constants.RESET_VISUALIZE_STATE,
    visualizeInitialState: initialState
  };
}
function requestPlotlyData () {
  return {
    type: constants.FETCH_PLOTLY_DATA_REQUEST,
    plotlyData: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
function receivePlotlyDataFailure (error) {
  return {
    type: constants.FETCH_PLOTLY_DATA_FAILURE,
    plotlyData: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function receivePlotlyData (json) {
  let data = json.data;
  let layout = json.layout;
  return {
    type: constants.FETCH_PLOTLY_DATA_SUCCESS,
    plotlyData: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data,
      layout: layout
    }
  };
}
function requestScalarValue () {
  return {
    type: constants.FETCH_SCALAR_VALUE_REQUEST,
    currentScalarValue: {
      requestedAt: Date.now(),
      isFetching: true
    }
  };
}
function receiveScalarValueFailure (error) {
  return {
    type: constants.FETCH_SCALAR_VALUE_FAILURE,
    currentScalarValue: {
      receivedAt: Date.now(),
      isFetching: false,
      error: error
    }
  };
}
function receiveScalarValue (data) {
  return {
    type: constants.FETCH_SCALAR_VALUE_SUCCESS,
    currentScalarValue: {
      receivedAt: Date.now(),
      isFetching: false,
      data: data
    }
  };
}

export const actions = {
  resetVisualizeState: resetVisualizeState,
  fetchScalarValue: function (opendapUrl, lat, lon, time, variable) {
    return function (dispatch) {
      dispatch(requestScalarValue());
      return myHttp.get(`/wps/getpoint?opendapUrl=${opendapUrl}&lat=${lat}&lon=${lon}&time=${time}&variable=${variable}`)
        .then(response => response.json())
        .then(json => {
          // Removing black magic from application
          json['variable'] = json[variable];
          delete json[variable];
          dispatch(receiveScalarValue(json));
        })
        .catch(error => dispatch(receiveScalarValueFailure(error)));
    };
  },
  fetchPlotlyData: function (
    opendapUrl,
    variableName,
    timeInitialIndice,
    timeFinalIndice,
    spatial1InitialIndice,
    spatial1FinalIndice,
    spatial2InitialIndice,
    spatial2FinalIndice
  ) {
    return function (dispatch) {
      dispatch(requestPlotlyData());
      let url = `/wps/plotly?opendap_url=${opendapUrl}&variable_name=${variableName}&time_initial_indice=${timeInitialIndice}` +
        `&time_final_indice=${timeFinalIndice}&spatial1_initial_indice=${spatial1InitialIndice}` +
        `&spatial1_final_indice=${spatial1FinalIndice}&spatial2_initial_indice=${spatial2InitialIndice}` +
        `&spatial2_final_indice=${spatial2FinalIndice}`;
      return myHttp.get(url)
        .then((response) => {
          console.log('variable name: ', variableName);
          return response.json();
        })
        .then(
          json => {
            dispatch(receivePlotlyData(json));
          },
          err => {
            dispatch(receivePlotlyDataFailure(err));
          }
        );
    };
  },
  selectMapManipulationMode: function (mode) {
    return {
      type: VISUALIZE_SET_MAP_MANIPULATION_MODE,
      mode: mode
    };
  }
};

// Handlers
const HANDLERS = {
  [constants.RESET_VISUALIZE_STATE]: (state, action) => {
    return {...action.visualizeInitialState};
  },
  [VISUALIZE_SET_MAP_MANIPULATION_MODE]: (state, action) => {
    return {...state, mapManipulationMode: action.mode};
  },
  [constants.ADD_SEARCH_CRITERIAS_TO_PROJECTS]: (state, action) => {
    let newSearchCriterias = state.currentProjectSearchCriterias.concat(action.searchCriterias);
    return ({...state, currentProjectSearchCriterias: newSearchCriterias});
  },
  [constants.ADD_DATASETS_TO_PROJECTS]: (state, action) => {
    let newDatasets = state.currentProjectDatasets.concat(action.datasets);
    return ({...state, currentProjectDatasets: newDatasets});
  },
  [constants.FETCH_PLOTLY_DATA_REQUEST]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [constants.FETCH_PLOTLY_DATA_FAILURE]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [constants.FETCH_PLOTLY_DATA_SUCCESS]: (state, action) => {
    return ({...state, plotlyData: Object.assign({}, state.plotlyData, action.plotlyData)});
  },
  [constants.FETCH_SCALAR_VALUE_REQUEST]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [constants.FETCH_SCALAR_VALUE_FAILURE]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  },
  [constants.FETCH_SCALAR_VALUE_SUCCESS]: (state, action) => {
    return ({...state, currentScalarValue: action.currentScalarValue});
  }
};

// Reducer
export const initialState = {
  mapManipulationMode: VISUALIZE_MODE_GRID_VALUES,
  selectedFacets: [],
  currentProjectSearchCriterias: [],
  currentProjectDatasets: [],
  currentScalarValue: {
    requestedAt: null,
    receivedAt: null,
    isFetching: false,
    data: {},
    error: null
  },
  plotlyData: {
    isFetching: false,
    receivedAt: null,
    requestedAt: null,
    data: [],
    layout: {},
    error: null
  }
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
