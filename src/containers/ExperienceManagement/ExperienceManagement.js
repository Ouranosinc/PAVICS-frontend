import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ExperienceManagement from './../../components/ExperienceManagement';
import { actions as projectActionsCreators } from './../../redux/modules/Project';
import { actions as researchAPIActionsCreators } from '../../redux/modules/ResearchAPI';
import { actions as researchActionsCreators } from './../../redux/modules/Research';


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

  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    researchAPIActions: bindActionCreators({...researchAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperienceManagementContainer)
