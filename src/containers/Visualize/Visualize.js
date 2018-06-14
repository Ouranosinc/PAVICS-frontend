import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as projectActionsCreators } from '../../redux/modules/Project';
import { actions as projectAPIActionsCreators } from '../../redux/modules/ProjectAPI';
import { actions as researchActionsCreators } from '../../redux/modules/Research';
import { actions as visualizeActions } from '../../redux/modules/Visualize';
import { Visualize }from './../../components/Visualize';

export class VisualizeContainer extends React.Component {
  static propTypes = {

  };

  render () {
    return (
      <Visualize {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project,
    projectAPI: state.projectAPI,
    research: state.research,
    visualize: state.visualize
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActionsCreators}, dispatch),
    researchActions: bindActionCreators({...researchActionsCreators}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizeContainer);
