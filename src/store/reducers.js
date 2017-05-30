import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import projectReducer from './../redux/modules/Project';
// var projectReducer = require('./../redux/modules/Project').default;

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    'router': router,
    'project-management': projectReducer,
    // Add sync reducers here
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
