import React from 'react';
import JobTable from './../../components/Monitor';
class Monitor extends React.Component {
  static propTypes = {
    fetchJobs: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.props.fetchJobs();
  }

  render () {
    return (
      <JobTable jobs={this.props.monitor.jobs} />
    );
  }
}
export default Monitor;
