import myHttp from '../../util/http';
import { WMSCapabilities } from 'ol/format';

// Constants
export const constants = {
  RESET_SELECTED_REGIONS: 'REGION_RESET_SELECTED_REGIONS',
  ADD_FEATURE_TO_SELECTED_REGIONS: 'REGION_ADD_FEATURE_TO_SELECTED_REGIONS',
  REMOVE_FEATURE_FROM_SELECTED_REGIONS: 'REGION_REMOVE_FEATURE_FROM_SELECTED_REGIONS',
  SET_SHAPEFILES: 'REGION_SET_SHAPEFILES',
  SET_SELECTED_SHAPEFILE: 'REGION_SET_SELECTED_SHAPEFILE',
};

// Actions
// TODO ERROR/FETCH/SUCCESS SYNC ACTIONS
function setShapefiles (shapefiles) {
  return {
    type: constants.SET_SHAPEFILES,
    publicShapeFiles: shapefiles
  };
}

// Action Creators
export const actions = {
  selectRegion: function (featureId) {
    return {
      type: constants.ADD_FEATURE_TO_SELECTED_REGIONS,
      featureId: featureId
    };
  },
  unselectRegion: function(featureId) {
    return {
      type: constants.REMOVE_FEATURE_FROM_SELECTED_REGIONS,
      featureId: featureId
    };
  },
  resetSelectedRegions: function() {
    return {
      type: constants.RESET_SELECTED_REGIONS
    };
  },
  selectShapefile: function (shapefile) {
    return {
      type: constants.SET_SELECTED_SHAPEFILE,
      shapefile: shapefile
    };
  },
  fetchShapefiles: function () {
    const parser = new WMSCapabilities();
    return dispatch => {
      return myHttp.get(`${__PAVICS_GEOSERVER_PATH__}/wms?request=GetCapabilities`)
        .then(response => response.text())
        .then(text => {
          return parser.read(text);
        })
        .then(json => {
          let shapefiles = [];
          json.Capability.Layer.Layer.map(layer => {
            shapefiles.push({
              title: layer.Title,
              wmsUrl: `${__PAVICS_GEOSERVER_PATH__}/wms`,
              wmsParams: {
                LAYERS: layer.Name,
                TILED: true,
                FORMAT: 'image/png'
              }
            });
          });
          dispatch(setShapefiles(shapefiles));
        });
    };
  },
};

// Reducer
const HANDLERS = {
  [constants.SET_SHAPEFILES]: (state, action) => {
    return {...state, publicShapeFiles: action.publicShapeFiles};
  },
  [constants.SET_SELECTED_SHAPEFILE]: (state, action) => {
    return {...state, selectedShapefile: action.shapefile};
  },
  [constants.ADD_FEATURE_TO_SELECTED_REGIONS]: (state, action) => {
    const copy = state.selectedRegions.concat([action.featureId]);
    return {...state, selectedRegions: copy};
  },
  [constants.REMOVE_FEATURE_FROM_SELECTED_REGIONS]: (state, action) => {
    let copy = state.selectedRegions.slice();
    copy.splice(copy.indexOf(action.featureId), 1);
    return {...state, selectedRegions: copy};
  },
  [constants.RESET_SELECTED_REGIONS]: (state) => {
    return {...state, selectedRegions: []};
  },
};

// Initial State
export const initialState = {
  selectedRegions: [],
  selectedShapefile: {},
  publicShapeFiles: []
};

export default function (state = initialState, action) {
  const handler = HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
