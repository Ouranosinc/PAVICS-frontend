import {createResource, mergeReducers} from './../../static/lib/redux-rest-resource';

const workflow = createResource({
  name: 'workflow',
  url: `${__PAVICS_PROJECT_API_PATH__}/Projects/:projectId/workflows/:id?filter=:filter`
});

const types = {
  ...workflow.types
};
const actions = {
  ...workflow.actions
};
const reducers = mergeReducers(workflow.reducers);
export {types, actions, reducers};
