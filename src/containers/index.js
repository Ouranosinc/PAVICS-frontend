import AccountManagement from './AccountManagement';
import ExperienceManagement from './ExperienceManagement';
import SearchCatalog from './SearchCatalog';
import SearchCatalogResults from './SearchCatalogResults';
import TimeSlider from './TimeSlider';
import {ClimateIndicators, Visualize} from './Visualize';
import WorkflowWizard from './WorkflowWizard';
import ProcessMonitoring from './ProcessMonitoring';

export {
  AccountManagement,
  ExperienceManagement,
  SearchCatalog,
  SearchCatalogResults,
  ClimateIndicators,
  ProcessMonitoring,
  TimeSlider,
  Visualize,
  WorkflowWizard
};
export default () => {
  throw new Error('you must import a specific container');
};
