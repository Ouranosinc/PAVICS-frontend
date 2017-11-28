import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as projectActionsCreators } from '../../redux/modules/Project';
import { actions as projectAPIActionsCreators } from '../../redux/modules/ProjectAPI';
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
    visualize: state.visualize
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch),
    projectAPIActions: bindActionCreators({...projectAPIActionsCreators}, dispatch),
    visualizeActions: bindActionCreators({...visualizeActions}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizeContainer);
