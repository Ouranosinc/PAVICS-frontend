import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProjectManagement from './../../components/ProjectManagement';
import { actions as datasetAPIActions } from '../../redux/modules/DatasetAPI';
import { actions as layerDatasetActions } from '../../redux/modules/LayerDataset';
import { actions as projectActions } from './../../redux/modules/Project';
import { actions as projectAPIActions } from '../../redux/modules/ProjectAPI';
import { actions as researchActions } from './../../redux/modules/Research';
import { actions as researchAPIActions } from '../../redux/modules/ResearchAPI';
import { actions as sectionActions } from '../../redux/modules/Section';

const mapStateToProps = (state) => {
  return {
    datasetAPI: state.datasetAPI,
    layerDataset: state.layerDataset,
    research: state.research,
    researchAPI: state.researchAPI,
    project: state.project,
    projectAPI: state.projectAPI,
    session: state.session,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    layerDatasetActions: bindActionCreators({...layerDatasetActions}, dispatch),
    datasetAPIActions: bindActionCreators({...datasetAPIActions}, dispatch),
    projectActions: bindActionCreators({...projectActions}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActions}, dispatch),
    researchActions: bindActionCreators({...researchActions}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActions}, dispatch),
    sectionActions: bindActionCreators({...sectionActions}, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectManagement)
