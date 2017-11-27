// import {createResource, mergeReducers} from 'redux-rest-resource';
import {createResource, mergeReducers} from './../../lib/redux-rest-resource';

const research = createResource({
  name: 'project',
  url: `${__LOOPBACK_API_PATH__}/Projects/:id?filter=:filter`
});
const projectDatasets = createResource({
  name: 'projectDatasets',
  pluralName: 'projectDatasets',
  url: `${__LOOPBACK_API_PATH__}/Projects/:projectId/datasets`
});
const projectResearchs = createResource({
  name: 'projectResearchs',
  pluralName: 'projectResearchs',
  url: `${__LOOPBACK_API_PATH__}/Projects/:projectId/researchs`
});

const types = {
  ...research.types,
  ...projectDatasets.types,
  ...projectResearchs.types
};
const actions = {
  ...research.actions,
  ...projectDatasets.actions,
  ...projectResearchs.actions
};
const reducers = mergeReducers(research.reducers, {
  datasets: projectDatasets.reducers,
  researchs: projectResearchs.reducers
});
export {types, actions, reducers};
