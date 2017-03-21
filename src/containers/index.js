import AccountManagement from './AccountManagement';
import DatasetWMSLayers from './DatasetWMSLayers';
import ExperienceManagement from './ExperienceManagement';
import SearchCatalog from './SearchCatalog';
import SearchCatalogResults from './SearchCatalogResults';
import TimeSlider from './TimeSlider';
import {ClimateIndicators, Visualize} from './Visualize';
import WorkflowWizard from './WorkflowWizard';
import ProcessMonitoring from './ProcessMonitoring';

export {
  AccountManagement,
  DatasetWMSLayers,
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
