import {createResource, mergeReducers} from './../../lib/redux-rest-resource';

const researcher = createResource({
  name: 'researcher',
  url: `${__LOOPBACK_API_PATH__}/Researchers/:id?filter=:filter`
});
const researcherProjects= createResource({
  name: 'researcherProjects',
  pluralName: 'researcherProjects',
  url: `${__LOOPBACK_API_PATH__}/Researchers/:researcherId/projects`
});

const types = {
  ...researcher.types,
  ...researcherProjects.types
};
const actions = {
  ...researcher.actions,
  ...researcherProjects.actions
};
const reducers = mergeReducers(researcher.reducers, {
  projects: researcherProjects.reducers
});
export {types, actions, reducers};
