import {createResource, mergeReducers} from './../../static/lib/redux-rest-resource';

const research = createResource({
  name: 'research',
  url: `${__PAVICS_PROJECT_API_PATH__}/Projects/:projectId/researchs/:id?filter=:filter`
});

const types = {
  ...research.types
};
const actions = {
  ...research.actions
};
const reducers = mergeReducers(research.reducers);
export {types, actions, reducers};
