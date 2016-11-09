import React from 'react';
class ProcessDetails extends React.Component {
  static propTypes = {
    selectedProcess: React.PropTypes.object.isRequired
  };
  render () {
    return (
      <div>
        <h3>{this.props.selectedProcess.title}</h3>
        <p>label: {this.props.selectedProcess.id}</p>
        <p>{this.props.selectedProcess.description}</p>
      </div>
    );
  }
}
export default ProcessDetails;
