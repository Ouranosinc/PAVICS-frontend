import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as projectActions } from '../../redux/modules/Project';
import { actions as projectAPIActions } from '../../redux/modules/ProjectAPI';
import { actions as researchActions } from '../../redux/modules/Research';
import { actions as visualizeActions } from '../../redux/modules/Visualize';
import { actions as widgetsActions } from '../../redux/modules/Widgets';
import Visualize from './../../components/Visualize';

const mapStateToProps = (state) => {
  return {
    project: state.project,
    projectAPI: state.projectAPI,
    research: state.research,
    visualize: state.visualize,
    widgets: state.widgets
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActions}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActions}, dispatch),
    researchActions: bindActionCreators({...researchActions}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch),
    widgetsActions: bindActionCreators({...widgetsActions}, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Visualize);
