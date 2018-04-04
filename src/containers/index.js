import AccountManagementContainer from './AccountManagement';
import ProjectManagementContainer from './ProjectManagement';
import ResearchContainer from './Research';
import VisualizeContainer from './Visualize';
import WorkflowWizardContainer from './WorkflowWizard';
import ProcessMonitoringContainer from './ProcessMonitoring';

export {
  AccountManagementContainer,
  ProjectManagementContainer,
  ResearchContainer,
  ProcessMonitoringContainer,
  VisualizeContainer,
  WorkflowWizardContainer
};
export default () => {
  throw new Error('you must import a specific container');
};
