import React from 'react';
import { connect } from 'react-redux';
import WorkflowWizard from './../../components/WorkflowWizard';

export class WorkflowWizardContainer extends React.Component {
  static propTypes = {}

  constructor(props) {
    super(props);
  }


  render () {
    return (
      <WorkflowWizard {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
};
const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkflowWizardContainer)
