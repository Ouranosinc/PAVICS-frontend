import {createResource, mergeReducers} from './../../static/lib/redux-rest-resource';

const researcher = createResource({
  name: 'researcher',
  url: `${__PAVICS_PROJECT_API_PATH__}/Researchers/:id?filter=:filter`
});
const researcherProjects= createResource({
  name: 'researcherProjects',
  pluralName: 'researcherProjects',
  url: `${__PAVICS_PROJECT_API_PATH__}/Researchers/:researcherId/projects`
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
