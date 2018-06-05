import {createResource, mergeReducers} from './../../static/lib/redux-rest-resource';

const dataset = createResource({
  name: 'dataset',
  url: `${__PAVICS_PROJECT_API_PATH__}/Projects/:projectId/datasets/:id?filter=:filter`
});

const types = {
  ...dataset.types
};
const actions = {
  ...dataset.actions
};
const reducers = mergeReducers(dataset.reducers);
export {types, actions, reducers};
