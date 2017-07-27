import React from 'react';
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
    job: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render () {
    let status = null;
    switch (this.props.job.status) {
      case constants.JOB_ACCEPTED_STATUS:
        status = <strong style={warningStyle}>PENDING</strong>;
        break;
      case constants.JOB_STARTED_STATUS:
        status = <strong style={infoStyle}>IN PROGRESS ({(this.props.job.progress) ? this.props.job.progress : 0}%)</strong>;
        break;
      case constants.JOB_SUCCESS_STATUS:
        status = <strong style={successStyle}>COMPLETED</strong>;
        break;
      case constants.JOB_FAILED_STATUS:
        status = <strong style={errorStyle}>FAILED</strong>;
        break;
      case constants.JOB_PAUSED_STATUS:
        status = <strong style={warningStyle}>PAUSED</strong>;
        break;
      default:
        status = <strong >UNKNOWN STATUS</strong>;
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
