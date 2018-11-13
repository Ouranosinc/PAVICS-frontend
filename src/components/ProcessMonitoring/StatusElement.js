import React from 'react';
import PropTypes from 'prop-types';
import * as constants from '../../constants';

const successStyle = {
  color: '#51a351'
};
const errorStyle = {
  color: '#bd362f'
};
const infoStyle = {
  color: '#2f96b4'
};
const warningStyle = {
  color: '#f89406'
};


export class StatusElement extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render () {
    let status = null;
    switch (this.props.job.status) {
      case constants.JOB_ACCEPTED_STATUS:
        status = <strong className="cy-monitoring-status" style={warningStyle}>PENDING</strong>;
        break;
      case constants.JOB_RUNNING_STATUS:
      case constants.JOB_STARTED_STATUS:
        status = <strong style={infoStyle}><span className="cy-monitoring-status">IN PROGRESS</span>
          ({(this.props.job.progress) ? this.props.job.progress : 0}%)</strong>;
        break;
      case constants.JOB_FINISHED_STATUS:
      case constants.JOB_SUCCESS_STATUS:
        status = <strong className="cy-monitoring-status" style={successStyle}>COMPLETED</strong>;
        break;
      case constants.JOB_FAILED_STATUS:
        status = <strong className="cy-monitoring-status" style={errorStyle}>FAILED</strong>;
        break;
      case constants.JOB_DISMISSED_STATUS:
        status = <strong className="cy-monitoring-status" style={warningStyle}>DISMISSED</strong>;
        break;
      case constants.JOB_PAUSED_STATUS:
        status = <strong className="cy-monitoring-status" style={warningStyle}>PAUSED</strong>;
        break;
      default:
        status = <strong className="cy-monitoring-status">UNKNOWN</strong>;
        break;
    }
    return (<span>
        <strong>Status: </strong>
        {status}
      </span>
    );
  }
}

export default StatusElement
