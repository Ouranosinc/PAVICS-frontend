import {createResource, mergeReducers} from 'redux-rest-resource';
const TOKEN = 'xvDjirE9MCIi800xMxi4EKeTm8e9FUBR';

const research = createResource({
  name: 'research',
  url: `${__LOOPBACK_API_PATH__}/Researchs/:id?filter=%7B%22where%22%3A%7B%22:projectId%22%3A2%7D%7D`
});
const researchDataset = createResource({
  name: 'researchDatasets',
  pluralName: 'researchDatasets',
  url: `${__LOOPBACK_API_PATH__}/Researchs/:researchId/datasets`
});
const researchFacet = createResource({
  name: 'researchAssets',
  pluralName: 'researchAssets',
  url: `${__LOOPBACK_API_PATH__}/Researchs/:researchId/facets`
});

const types = {
  ...research.types,
  ...researchDataset.types,
  ...researchFacet.types
};
const actions = {
  ...research.actions,
  ...researchDataset.actions,
  ...researchFacet.actions
};
const reducers = mergeReducers(research.reducers, {
  facets: researchFacet.reducers,
  datasets: researchDataset.reducers
});
export {types, actions, reducers};
