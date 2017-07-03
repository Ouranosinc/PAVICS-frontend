import {createActions} from 'redux-rest-resource/src/actions';
import {createReducers} from './custom-reducers';
import {createTypes} from 'redux-rest-resource/src/types';

const mergeObjects = (object, ...sources) => {
  const concat = Array.prototype.concat;
  const uniqueKeys = concat.apply(Object.keys(object), sources.map(Object.keys))
    .filter((value, index, self) => self.indexOf(value) === index);
  return uniqueKeys.reduce((soFar, key) => {
    soFar[key] = Object.assign(soFar[key] || {}, ...sources.map(source => source[key] || {})); // eslint-disable-line no-param-reassign
    return soFar;
  }, object);
};

export function createResource({name, url, actions = {}, pick = [], ...args}) {
  let actionsOpts = mergeObjects({}, defaultActions, actions);
  if (pick.length) {
    actionsOpts = pick.reduce((soFar, key) => ({...soFar, [key]: actionsOpts[key]}), {});
  }
  return {
    actions: createActions({name, url, actions: actionsOpts, ...args}),
    reducers: createReducers({name, ...args}),
    types: createTypes({name, actions: actionsOpts, ...args})
  };
}
