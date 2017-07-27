import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducers as jobAPIReducer } from '../redux/modules/JobAPI';
import monitorReducer from './../redux/modules/Monitor';
import projectReducer from './../redux/modules/Project';
import { reducers as projectAPIReducer } from '../redux/modules/ProjectAPI';
import researchReducer from './../redux/modules/Research';
import { reducers as ResearchAPIReducer } from '../redux/modules/ResearchAPI';
import researcherReducer from './../redux/modules/Researcher';
import { reducers as researcherAPIReducer } from '../redux/modules/ResearcherAPI';
import workflowReducer from './../redux/modules/Workflow';
import { reducers as workflowAPIReducer } from '../redux/modules/WorkflowAPI';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    'router': router,
    'jobAPI': jobAPIReducer,
    'monitor': monitorReducer,
    'project': projectReducer,
    'projectAPI': projectAPIReducer,
    'research': researchReducer,
    'researchAPI': ResearchAPIReducer,
    'researcher': researcherReducer,
    'researcherAPI': researcherAPIReducer,
    'workflow': workflowReducer,
    'workflowAPI': workflowAPIReducer,
    // Add async reducers here
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
