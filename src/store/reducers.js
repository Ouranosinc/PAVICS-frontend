import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import projectReducer from './../redux/modules/Project';
import { reducers as ResearchAPIReducer } from '../redux/modules/ResearchAPI';
import researchReducer from './../redux/modules/Research';
import researcherReducer from './../redux/modules/Researcher';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    'router': router,
    'project': projectReducer,
    'researcher': researcherReducer,
    'researchAPI': ResearchAPIReducer,
    'research': researchReducer,
    // Add sync reducers here
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
