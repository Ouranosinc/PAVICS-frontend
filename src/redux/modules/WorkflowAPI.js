import {createResource, mergeReducers} from './../../lib/redux-rest-resource';

const workflow = createResource({
  name: 'workflow',
  url: `${__PAVICS_PROJECT_API_PATH__}/Workflows/:id?filter=:filter`
});
const workflowTasks = createResource({
  name: 'workflowTasks',
  pluralName: 'workflowTasks',
  url: `${__PAVICS_PROJECT_API_PATH__}/Workflows/:workflowId/tasks`
});
const workflowParallelGroups = createResource({
  name: 'workflowParallelGroups',
  pluralName: 'workflowParallelGroups',
  url: `${__PAVICS_PROJECT_API_PATH__}/Workflows/:workflowId/projects`
});

const types = {
  ...workflow.types,
  ...workflowTasks.types,
  ...workflowParallelGroups.types
};
const actions = {
  ...workflow.actions,
  ...workflowTasks.actions,
  ...workflowParallelGroups.actions
};
const reducers = mergeReducers(workflow.reducers, {
  tasks: workflowTasks.reducers,
  parallel_groups: workflowParallelGroups.reducers
});
export {types, actions, reducers};
