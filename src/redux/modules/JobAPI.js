import {createResource, mergeReducers} from './../../static/lib/redux-rest-resource';

const job = createResource({
  name: 'job',
  url: `${__PAVICS_PROJECT_API_PATH__}Projects/:projectId/jobs/:id?filter=:filter`
});

const types = {
  ...job.types
};
const actions = {
  ...job.actions
};
const reducers = mergeReducers(job.reducers);
export {types, actions, reducers};
