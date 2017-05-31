import {createResource, mergeReducers} from 'redux-rest-resource';
const TOKEN = 'xvDjirE9MCIi800xMxi4EKeTm8e9FUBR';

const research = createResource({
  name: 'research',
  url: `${__LOOPBACK_API_PATH__}/Researchs/:id?access_token=${TOKEN}`
});
const researchDataset = createResource({
  name: 'researchDataset',
  url: `${__LOOPBACK_API_PATH__}/Researchs/:researchId/datasets`
});
const researchFacet = createResource({
  name: 'researchAsset',
  url: `${__LOOPBACK_API_PATH__}/Researchs/:researchId/facets`
});

const types = {...research.types, ...researchDataset.types, ...researchFacet.types};
const actions = {...research.actions, ...researchDataset.actions, ...researchFacet.actions};
const reducers = mergeReducers(research.reducers, {facets: researchFacet.reducers, datasets: researchDataset.reducers});
export {types, actions, reducers};
