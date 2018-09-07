import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProjectManagement from './../../components/ProjectManagement';
import { actions as datasetAPIActions } from '../../redux/modules/DatasetAPI';
import { actions as projectActions } from './../../redux/modules/Project';
import { actions as projectAPIActions } from '../../redux/modules/ProjectAPI';
import { actions as researchActions } from './../../redux/modules/Research';
import { actions as researchAPIActions } from '../../redux/modules/ResearchAPI';
import { actions as sectionActions } from '../../redux/modules/Section';
import { actions as visualizeActions } from '../../redux/modules/Visualize';

const mapStateToProps = (state) => {
  return {
    datasetAPI: state.datasetAPI,
    research: state.research,
    researchAPI: state.researchAPI,
    project: state.project,
    projectAPI: state.projectAPI,
    session: state.session,
    visualize: state.visualize,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    datasetAPIActions: bindActionCreators({...datasetAPIActions}, dispatch),
    projectActions: bindActionCreators({...projectActions}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActions}, dispatch),
    researchActions: bindActionCreators({...researchActions}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActions}, dispatch),
    sectionActions: bindActionCreators({...sectionActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectManagement)
