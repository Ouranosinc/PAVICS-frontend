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
import ShareIcon from 'material-ui/svg-icons/social/person-add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import VisualizeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import AddToProjectIcon from 'material-ui/svg-icons/av/playlist-add';

const successStyle = {
  color: '#4caf50'
};
const errorStyle = {
  color: '#f44336'
};
const infoStyle = {
  color: '#03a9f4'
};

class ProcessMonitoring extends React.Component {
  static propTypes = {
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired,
    fetchWPSJobs: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
    this.props.fetchWPSJobs();
    this._onRefreshResults = this._onRefreshResults.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
    this._onVisualiseDataset = this._onVisualiseDataset.bind(this);
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

  _onVisualiseDataset (url) {
    // TODO Remove hardcoded path
    let prefix = 'http://hirondelle.crim.ca:8080/ncWMS2/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/wps_outputs/';
    let index = url.indexOf('flyingpigeon');
    let suffix = url.substring(index, url.length);
    this.props.addDatasetLayersToVisualize([
      {
        wms_url: prefix + suffix,
        dataset_id: suffix
      }
    ]);
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
                  let netcdfUrl = '';
                  try {
                    netcdfUrl = x.response_to_json['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'][1]['wps:Reference'][0]['$']['href'];
                    console.log(netcdfUrl);
                  } catch (error) {

                  }
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
                          primaryText="Show XML Status File"
                          onTouchTap={(event) => window.open(x.status_location, '_blank')}
                          leftIcon={<FileIcon />} />
                        <MenuItem
                          primaryText="Visualize"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => this._onVisualiseDataset(netcdfUrl)}
                          leftIcon={<VisualizeIcon />} />
                        <MenuItem
                          primaryText="Download"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => window.open(netcdfUrl, '_blank')}
                          leftIcon={<DownloadIcon />} />
                        <MenuItem
                          primaryText="Share (TODO)"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => alert('share: launch crawler')}
                          leftIcon={<ShareIcon />} />
                        <MenuItem
                          primaryText="Add to current project (TODO)"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => alert('add to current project')}
                          leftIcon={<AddToProjectIcon />} />
                      </IconMenu>
                    }
                  />;
                }
                )}
              </List>
              <Pagination
                total={this.props.monitor.jobs.items.length}
                initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
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
