import DatasetWMSLayers from './DatasetWMSLayers';
import SearchCatalog from './SearchCatalog';
import SearchCatalogResults from './SearchCatalogResults';
import {TimeSlider} from './TimeSlider'
import {ClimateIndicators, MapNavBar, Visualize} from './Visualize';
import WorkflowWizard from './WorkflowWizard';
import Monitor from './Monitor';

export {
  DatasetWMSLayers,
  SearchCatalog,
  SearchCatalogResults,
  ClimateIndicators,
  MapNavBar,
  WorkflowWizard,
  Monitor,
  Visualize
  TimeSlider
}
export default () => {
  throw new Error('you must import a specific container')
}
