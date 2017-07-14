import React from 'react';
import moment from 'moment';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import PublishIcon from 'material-ui/svg-icons/social/public';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import VisualizeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import PersistIcon from 'material-ui/svg-icons/content/save';
import InputIcon from 'material-ui/svg-icons/action/input';

const dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');
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
    monitor: React.PropTypes.object.isRequired,
    monitorActions: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
    this.props.monitorActions.fetchWPSJobs(constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX], 1);
    this.props.monitorActions.fetchWPSJobsCount();
    this._onRefreshResults = this._onRefreshResults.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
    this._onVisualiseDataset = this._onVisualiseDataset.bind(this);
  }

  _onRefreshResults () {
    this.props.monitorActions.fetchWPSJobs(this.state.numberPerPage, this.state.pageNumber);
    this.props.monitorActions.fetchWPSJobsCount();
  }

  _onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
    this.props.monitorActions.fetchWPSJobs(numberPerPage, pageNumber);
    this.props.monitorActions.fetchWPSJobsCount();
  }

  _onVisualiseDataset (url) {
    // TODO Remove hardcoded path
    alert('TODO: Call Visualize WPS, temporary built WMS URL so the result can be seen but TimeSlider and other features won\'t work');
    let prefix = __PAVICS_NCWMS_PATH__ + '?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/wps_outputs/';
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
    // Ensure pagination component doesn't get destroyed or we lost pageIndex and perPageIndex values that are in the component
    let pagination =
      <Pagination
        total={this.props.monitor.jobsCount.data.count}
        initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
        perPageOptions={constants.PER_PAGE_OPTIONS}
        onChange={this._onPageChanged} />;
    if (this.props.monitor.jobs.isFetching || this.props.monitor.jobsCount.isFetching) {
      mainComponent =
        <Loader name="wps jobs" />;
    } else {
      if (this.props.monitor.jobs.items.length && this.props.monitor.jobsCount.data.count) {
        // Backend Phoenix pagination now
        // let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
        // let paginated = this.props.monitor.jobs.items.slice(start, start + this.state.numberPerPage);
        mainComponent =
          <List>
            <Subheader>Launched Jobs</Subheader>
            {this.props.monitor.jobs.items.map((x, i) => {
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
              if(x.status === constants.JOB_STARTED_STATUS) {
                // No actions available if in progress
                return <ListItem
                  key={i}
                  primaryText={x.title + ': ' + x.abstract}
                  secondaryText={
                    <p>
                      <span
                        style={{color: darkBlack}}>Launched on <strong>{moment(x.created).format(dateFormat)}</strong> using service <strong>{x.service}</strong>.</span><br />
                      <strong>Status: </strong>{status}, <strong>Duration: </strong>{x.duration}
                    </p>
                  }
                  secondaryTextLines={2} />;
              }else {
                if (x.process_id === __PAVICS_RUN_WORKFLOW_IDENTIFIER__) {
                  //Threat as a Workflow
                  let tasks = JSON.parse(x["response_to_json"]['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'][0]['wps:Data'][0]['wps:ComplexData'][0]['_'])

                  return <ListItem
                    key={i}
                    primaryText={x.title + ': ' + x.abstract}
                    secondaryText={
                      <p>
                      <span
                        style={{color: darkBlack}}>Launched on <strong>{moment(x.created).format(dateFormat)}</strong> using service <strong>{x.service}</strong>.</span><br />
                        <strong>Status: </strong>{status}, <strong>Duration: </strong>{x.duration}
                      </p>
                    }
                    secondaryTextLines={2}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    nestedItems={
                      tasks.map((task, j) => {
                        let taskName = Object.keys(task)[0];
                        let taskDetails = task[taskName][0];
                        let status = null;
                        if(taskDetails.status === constants.JOB_SUCCESS_STATUS) {
                          status = <strong style={successStyle}>COMPLETED</strong>;
                        }else if(taskDetails.status === constants.JOB_FAILED_STATUS) {
                          status = <strong style={errorStyle}>FAILED</strong>;
                        }
                        let types = "";
                        let isMapVisualisable = false;
                        let netcdfUrl = "";
                        let isGraphVisualisable = false;
                        let isDownloadable = false;
                        taskDetails.outputs.forEach((output) => {
                          types += output.mimeType + " ";
                          if(output.mimeType === "application/x-netcdf"){
                            isMapVisualisable = true;
                            netcdfUrl = output.reference;
                          }
                          if(output.mimeType === "application/json") {
                            // TODO
                          }
                        });

                        return (
                          <ListItem
                            style={{width: '98%'}}
                            key={j}
                            primaryText={taskName + ": " + taskDetails.outputs[0].title}
                            secondaryText={
                              <p>
                                <span
                                  style={{color: darkBlack}}>Output types ({taskDetails.outputs.length}): <strong>{types}</strong>
                                </span><br />
                                <strong>Status: </strong>{status}
                              </p>
                            }
                            secondaryTextLines={2}
                            rightIconButton={
                              <IconMenu iconButtonElement={
                                <IconButton
                                  touch={true}
                                  tooltipPosition="bottom-left">
                                  <MoreVertIcon color={grey400}/>
                                </IconButton>
                              }>
                                <MenuItem
                                  primaryText="Show XML Status File"
                                  onTouchTap={(event) => window.open(taskDetails.status_location, '_blank')}
                                  leftIcon={<FileIcon />}/>
                                <MenuItem
                                  primaryText="Visualize"
                                  disabled={!isMapVisualisable}
                                  onTouchTap={(event) => this._onVisualiseDataset(netcdfUrl)}
                                  leftIcon={<VisualizeIcon />}/>
                                <MenuItem
                                  primaryText="Download"
                                  disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                                  onTouchTap={(event) => window.open(netctaskDetails.output[0].reference, '_blank')}
                                  leftIcon={<DownloadIcon />}/>
                                <MenuItem
                                  primaryText="Publish (TODO)"
                                  disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                                  onTouchTap={(event) => alert('TODO: Publish')}
                                  leftIcon={<PublishIcon />}/>
                                <MenuItem
                                  primaryText="Persist (TODO)"
                                  disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                                  onTouchTap={(event) => alert('TODO: Persist')}
                                  leftIcon={<PersistIcon />}/>
                              </IconMenu>
                            }
                          />
                        );
                      })
                    }
                  />;
                } else {
                  //Threat as a Single Process
                  return <ListItem
                    key={i}
                    primaryText={x.title + ': ' + x.abstract}
                    secondaryText={
                      <p>
                      <span
                        style={{color: darkBlack}}>Launched on <strong>{moment(x.created).format(dateFormat)}</strong> using service <strong>{x.service}</strong>.</span><br />
                        <strong>Status: </strong>{status}
                      </p>
                    }
                    secondaryTextLines={2}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltipPosition="bottom-left">
                          <MoreVertIcon color={grey400}/>
                        </IconButton>}>
                        <MenuItem
                          primaryText="Show XML Status File"
                          onTouchTap={(event) => window.open(x.status_location, '_blank')}
                          leftIcon={<FileIcon />}/>
                        <MenuItem
                          primaryText="Visualize"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => this._onVisualiseDataset(netcdfUrl)}
                          leftIcon={<VisualizeIcon />}/>
                        <MenuItem
                          primaryText="Download"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => window.open(netcdfUrl, '_blank')}
                          leftIcon={<DownloadIcon />}/>
                        <MenuItem
                          primaryText="Publish (TODO)"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => alert('TODO: Call Publish WPS')}
                          leftIcon={<PublishIcon />}/>
                        <MenuItem
                          primaryText="Persist (TODO)"
                          disabled={x.status !== constants.JOB_SUCCESS_STATUS}
                          onTouchTap={(event) => alert('TODO: Call Persist WPS')}
                          leftIcon={<PersistIcon  />}/>
                      </IconMenu>
                    }
                  />;
                }
              }
            }
            )}
          </List>;
      } else {
        mainComponent =
            <List>
              <Subheader>No results found.</Subheader>
            </List>;
      }
    }
    return (
      <div>
        <div className="container">
          <Paper style={{ marginTop: 20 }}>
            {mainComponent}
            {pagination}
          </Paper>
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
