import {createResource, mergeReducers} from './../../lib/redux-rest-resource';

const dataset = createResource({
  name: 'dataset',
  url: `${__PAVICS_PROJECT_API_PATH__}/Datasets/:id?filter=:filter`
});

const types = {
  ...dataset.types
};
const actions = {
  ...dataset.actions
};
const reducers = mergeReducers(dataset.reducers);
export {types, actions, reducers};
