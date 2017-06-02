import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ExperienceManagement from './../../components/ExperienceManagement';
import { actions as projectActionsCreators } from './../../redux/modules/Project';
import { actions as projectAPIActionsCreators } from '../../redux/modules/ProjectAPI';
import { actions as researchActionsCreators } from './../../redux/modules/Research';
import { actions as researchAPIActionsCreators } from '../../redux/modules/ResearchAPI';

export class ExperienceManagementContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <ExperienceManagement {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    research: state.research,
    researchAPI: state.researchAPI,
    project: state.project,
    projectAPI: state.projectAPI
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActionsCreators}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperienceManagementContainer)
