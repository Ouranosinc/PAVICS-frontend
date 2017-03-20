import React from 'react';
import * as constants from './../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import VisualizeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';

const successStyle = {
  color: '#4caf50'
};
const errorStyle = {
  color: '#f44336'
};
const infoStyle = {
  color: '#03a9f4'
};
const PER_PAGE_INITIAL_INDEX = 1;

class ProcessMonitoring extends React.Component {
  static propTypes = {
    fetchWPSJobs: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[PER_PAGE_INITIAL_INDEX]
    };
    this.props.fetchWPSJobs();
    this._onRefreshResults = this._onRefreshResults.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
  }

  _onRefreshResults () {
    this.setState({
      pageNumber: 1
    });
    this.props.fetchWPSJobs();
  }

  _onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  }

  render () {
    let mainComponent;
    if (this.props.monitor.jobs.isFetching) {
      mainComponent =
        <Paper style={{ marginTop: 20 }}>
          <Loader name="wps jobs" />
        </Paper>;
    } else {
      if (this.props.monitor.jobs.items.length) {
        let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
        let paginated = this.props.monitor.jobs.items.slice(start, start + this.state.numberPerPage);
        mainComponent =
          <div>
            <Paper style={{ marginTop: 20 }}>
              <List>
                <Subheader>Launched Jobs</Subheader>
                {paginated.map((x, i) => {
                  let status = null;
                  switch (x.status) {
                    case constants.JOB_SUCCESS_STATUS:
                      status = <strong style={successStyle}>COMPLETED</strong>;
                      break;
                    case constants.JOB_FAILED_STATUS:
                      status = <strong style={errorStyle}>FAILED</strong>;
                      break;
                    default:
                      status = <strong style={infoStyle}>IN PROGRESS ({(x.progress) ? x.progress : 0}%)</strong>;
                      break;
                  }
                  return <ListItem
                    key={i}
                    primaryText={x.title + ': ' + x.abstract}
                    secondaryText={
                      <p>
                        <span
                          style={{color: darkBlack}}>Launched on <strong>{x.created}</strong> using service <strong>{x.service}</strong>.</span><br />
                        <strong>Status: </strong>{status}
                      </p>
                    }
                    secondaryTextLines={2}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltipPosition="bottom-left">
                          <MoreVertIcon color={grey400} />
                        </IconButton>}>
                        <MenuItem
                          primaryText="Visualize (TODO)"
                          onTouchTap={(event) => alert('visualize result')}
                          leftIcon={<VisualizeIcon />} />
                        <MenuItem
                          primaryText="Show XML Status File"
                          onTouchTap={(event) => window.open(x.status_location, '_blank')}
                          leftIcon={<FileIcon />} />
                        <MenuItem
                          primaryText="Download"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => window.open(x.response_to_json['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'][1]['wps:Reference'][0]['$']['href'], '_blank')}
                          leftIcon={<DownloadIcon />} />
                        <MenuItem
                          primaryText="Share (TODO)"
                          onTouchTap={(event) => alert('share: launch crawler')}
                          leftIcon={<PersonAddIcon />} />
                      </IconMenu>
                    }
                  />;
                }
                )}
              </List>
              <Pagination
                total={this.props.monitor.jobs.items.length}
                initialPerPageOptionIndex={PER_PAGE_INITIAL_INDEX}
                perPageOptions={constants.PER_PAGE_OPTIONS}
                onChange={this._onPageChanged} />
            </Paper>
          </div>;
      } else {
        mainComponent =
          <Paper style={{ marginTop: 20 }}>
            <List>
              <Subheader>No results found.</Subheader>
            </List>
          </Paper>;
      }
    }
    return (
      <div>
        <div className="container">
          {mainComponent}
          <RaisedButton
            onClick={(event) => this._onRefreshResults()}
            label="Refresh"
            icon={<RefreshIcon />}
            style={{marginTop: 20}} />
        </div>
      </div>
    );
  }
}
export default ProcessMonitoring;
