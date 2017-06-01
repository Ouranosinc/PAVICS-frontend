import AccountManagementContainer from './AccountManagement';
import ExperienceManagementContainer from './ExperienceManagement';
import ResearchContainer from './Research';
import VisualizeContainer from './Visualize';
import WorkflowWizardContainer from './WorkflowWizard';
import ProcessMonitoringContainer from './ProcessMonitoring';

export {
  AccountManagementContainer,
  ExperienceManagementContainer,
  ResearchContainer,
  ProcessMonitoringContainer,
  VisualizeContainer,
  WorkflowWizardContainer
};
export default () => {
  throw new Error('you must import a specific container');
};
