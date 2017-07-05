import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import projectReducer from './../redux/modules/Project';
import { reducers as projectAPIReducer } from '../redux/modules/ProjectAPI';
import researchReducer from './../redux/modules/Research';
import { reducers as ResearchAPIReducer } from '../redux/modules/ResearchAPI';
import researcherReducer from './../redux/modules/Researcher';
import { reducers as researcherAPIReducer } from '../redux/modules/ResearcherAPI';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    'router': router,
    'project': projectReducer,
    'projectAPI': projectAPIReducer,
    'research': researchReducer,
    'researchAPI': ResearchAPIReducer,
    'researcher': researcherReducer,
    'researcherAPI': researcherAPIReducer,
    // Add async reducers here
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
