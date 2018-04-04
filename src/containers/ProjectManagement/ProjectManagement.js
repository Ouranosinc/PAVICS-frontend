import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProjectManagement from './../../components/ProjectManagement';
import { actions as datasetAPIActionsCreators } from '../../redux/modules/DatasetAPI';
import { actions as projectActionsCreators } from './../../redux/modules/Project';
import { actions as projectAPIActionsCreators } from '../../redux/modules/ProjectAPI';
import { actions as researchActionsCreators } from './../../redux/modules/Research';
import { actions as researchAPIActionsCreators } from '../../redux/modules/ResearchAPI';

export class ProjectManagementContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <ProjectManagement {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    datasetAPI: state.datasetAPI,
    research: state.research,
    researchAPI: state.researchAPI,
    project: state.project,
    projectAPI: state.projectAPI
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    datasetAPIActions: bindActionCreators({...datasetAPIActionsCreators}, dispatch),
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActionsCreators}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectManagementContainer)
