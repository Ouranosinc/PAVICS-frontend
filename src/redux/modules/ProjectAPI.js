// import {createResource, mergeReducers} from 'redux-rest-resource';
import {createResource, mergeReducers} from './../../static/lib/redux-rest-resource';

const research = createResource({
  name: 'project',
  url: `${__PAVICS_PROJECT_API_PATH__}/Projects/:id?filter=:filter`,
  actions: {
    byMagpieAccess: {
      url: `${__PAVICS_PROJECT_API_PATH__}/Projects/projectsByMagpieAccess`,
      method: 'GET',
      gerundName: 'fetching',
      reduce: (state, action) => {
        let projects = [];
        let isFetching = true;
        if(action.code && action.code === 200 && action.body && action.body.projects.length) {
          projects = action.body.projects;
          isFetching = false;
        }
        return ({...state, items: projects, isFetching: isFetching});
      },
      isArray: true
    },
    share: {
      url: `${__PAVICS_PROJECT_API_PATH__}/Projects/share`,
      method: 'POST',
      gerundName: 'sharing'
    }
  }
});
const projectDatasets = createResource({
  name: 'projectDatasets',
  pluralName: 'projectDatasets',
  url: `${__PAVICS_PROJECT_API_PATH__}/Projects/:projectId/datasets/:fk`
});
const projectResearchs = createResource({
  name: 'projectResearchs',
  pluralName: 'projectResearchs',
  url: `${__PAVICS_PROJECT_API_PATH__}/Projects/:projectId/researchs/:fk`
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
