import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducers as datasetAPIReducer } from '../redux/modules/DatasetAPI';
import { reducers as jobAPIReducer } from '../redux/modules/JobAPI';
import layerBasemapReducer from '../redux/modules/LayerBasemap';
import layerCustomFeatureReducer from '../redux/modules/LayerCustomFeature';
import layerDatasetReducer from '../redux/modules/LayerDataset';
import layerRegionReducer from '../redux/modules/LayerRegion';
import monitorReducer from './../redux/modules/Monitor';
import projectReducer from './../redux/modules/Project';
import { reducers as projectAPIReducer } from '../redux/modules/ProjectAPI';
import researchReducer from './../redux/modules/Research';
import { reducers as ResearchAPIReducer } from '../redux/modules/ResearchAPI';
import { reducers as researcherAPIReducer } from '../redux/modules/ResearcherAPI';
import sectionReducer from '../redux/modules/Section';
import workflowReducer from './../redux/modules/Workflow';
import visualizeReducer from '../redux/modules/Visualize';
import sessionReducer from '../redux/modules/Session';
import widgetsReducer from '../redux/modules/Widgets';
import { reducers as workflowAPIReducer } from '../redux/modules/WorkflowAPI';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    'router': router,
    'datasetAPI': datasetAPIReducer,
    'jobAPI': jobAPIReducer,
    'layerBasemap': layerBasemapReducer,
    'layerCustomFeature': layerCustomFeatureReducer,
    'layerDataset': layerDatasetReducer,
    'layerRegion': layerRegionReducer,
    'monitor': monitorReducer,
    'project': projectReducer,
    'projectAPI': projectAPIReducer,
    'research': researchReducer,
    'researchAPI': ResearchAPIReducer,
    'researcherAPI': researcherAPIReducer,
    'workflow': workflowReducer,
    'workflowAPI': workflowAPIReducer,
    'section': sectionReducer,
    'session': sessionReducer,
    'visualize': visualizeReducer,
    'widgets': widgetsReducer,
    // Add async reducers here
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
