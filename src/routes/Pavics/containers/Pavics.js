import React from 'react';
import {connect} from 'react-redux';
import {WorkflowWizard} from './../../../containers';
class Pavics extends React.Component {
  static propTypes = {
    processes: React.PropTypes.array.isRequired
  };
  render () {
    return (
      <WorkflowWizard processes={this.props.processes} />
    );
  }
}
const mapActionCreators = {};
const mapStateToProps = (state) => {
  console.log('Pavics route state:', state);
  return {
    processes: state.pavics.processes
  };
};
export default connect(mapStateToProps, mapActionCreators)(Pavics);
