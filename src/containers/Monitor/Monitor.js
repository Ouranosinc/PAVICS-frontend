import React from 'react';
import JobTable from './../../components/Monitor';
class Monitor extends React.Component {
  static propTypes = {
    fetchJobs: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.props.fetchJobs();
  }

  render () {
    return (
      <JobTable jobs={this.props.monitor.jobs} fetchVisualizableData={this.props.fetchVisualizableData} />
    );
  }
}
export default Monitor;
