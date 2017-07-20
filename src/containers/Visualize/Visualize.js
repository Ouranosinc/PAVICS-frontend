import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as projectActionsCreators } from '../../redux/modules/Project';
import { Visualize }from './../../components/Visualize';

export class VisualizeContainer extends React.Component {
  static propTypes = {

  };

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <Visualize {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    projectActions: bindActionCreators({...projectActionsCreators}, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisualizeContainer)
