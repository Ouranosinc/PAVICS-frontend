import React from 'react';
import moment from 'moment';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import StatusElement from './StatusElement';
import ProcessListItem from './ProcessListItem';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import LogIcon from 'material-ui/svg-icons/action/receipt';
import ExpandableIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import NotExpandableIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import NoActionIcon from 'material-ui/svg-icons/av/not-interested';

const dateFormat = moment().format('YYYY-MM-DD HH:mm:ss');

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
      LogDialogArray: [],
      logDialogOpened: false,
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
    this.props.monitorActions.fetchWPSJobs(constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX], 1);
    this.props.monitorActions.fetchWPSJobsCount();
    this._closeDialog = this._closeDialog.bind(this);
    this._onShowLogDialog = this._onShowLogDialog.bind(this);
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

  _onShowLogDialog (log) {
    this.setState({
      logDialogOpened: true,
      LogDialogArray: log
    });
  }

  _closeDialog () {
    this.setState({
      logDialogOpened: false,
      LogDialogArray: ''
    });
  }


  buildNotCompletedListItem(job, index) {
    return <ListItem
      key={index}
      primaryText={x.title + ': ' + x.abstract}
      secondaryText={
        <p>
                      <span
                        style={{color: darkBlack}}>Launched on <strong>{moment(x.created).format(dateFormat)}</strong> using provider <strong>{x.service}</strong>.</span><br />
          <StatusElement job={x} />, <strong>Duration: </strong>{x.duration}
        </p>
      }
      secondaryTextLines={2} />;
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
              if(x.status === constants.JOB_ACCEPTED_STATUS ||
                x.status === constants.JOB_STARTED_STATUS ||
                (x.status === constants.JOB_FAILED_STATUS && x.process_id !== __PAVICS_RUN_WORKFLOW_IDENTIFIER__)){
                // These status are not expandable and show a minimum set of actions
                // Note that failed workflow are expandable.
                let secondaryText =
                  <p>
                    <span style={{color: darkBlack}}>
                      Launched on <strong>{moment(x.created).format(dateFormat)}</strong> using provider <strong>{x.service}</strong>.
                    </span><br />
                    <StatusElement job={x} />, <strong>Duration: </strong>{x.duration}
                  </p>;
                let logMenuItem = <MenuItem
                  primaryText="Show Logs"
                  onTouchTap={(event) => this._onShowLogDialog(x.log)}
                  leftIcon={<LogIcon />}/>;
                if(x.status === constants.JOB_ACCEPTED_STATUS){
                  secondaryText =
                    <p>
                      <span style={{color: darkBlack}}>
                        Will be launched soon using provider <strong>{x.service}</strong>.
                      </span><br />
                      <StatusElement job={x} />
                    </p>;
                  logMenuItem = null
                }
                return <ListItem
                  key={i}
                  primaryText={x.title + ': ' + x.abstract}
                  leftIcon={<NotExpandableIcon />}
                  secondaryText={secondaryText}
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
                        primaryText="Browse XML Status File"
                        onTouchTap={(event) => window.open(x.status_location, '_blank')}
                        leftIcon={<FileIcon />}/>
                      {logMenuItem}
                    </IconMenu>
                  }/>
              }else {
                if (x.process_id === __PAVICS_RUN_WORKFLOW_IDENTIFIER__) {
                  //Threat as a Workflow
                  let tasks = [];
                  let logMenu = <MenuItem
                    primaryText="Show Logs"
                    onTouchTap={(event) => this._onShowLogDialog(x.log)}
                    leftIcon={<LogIcon />}/>;

                  if(x.status === constants.JOB_SUCCESS_STATUS) {
                    let outputs = x["response_to_json"]['wps:ExecuteResponse']['wps:ProcessOutputs'];
                    tasks = [];
                    if (outputs) {
                      let data = outputs[0]['wps:Output'][0]['wps:Data'];
                      if (data) {
                        tasks = JSON.parse(data[0]['wps:ComplexData'][0]['_']);
                      }
                    }

                    let LogFileURL = outputs[0]['wps:Output'][1]['wps:Reference'][0]['$']['xlink:href'];
                    logMenu = <MenuItem
                      primaryText="Browse Log File"
                      onTouchTap={(event) => window.open(LogFileURL, '_blank')}
                      leftIcon={<FileIcon />}/>
                  }else if(x.status === constants.JOB_FAILED_STATUS){
                    let exception = x["response_to_json"]['wps:ExecuteResponse']['wps:Status'][0]['wps:ProcessFailed'][0]['wps:ExceptionReport'][0]['ows:Exception'][0]['ows:ExceptionText'][0];
                    let searchvalue = 'Workflow result:';
                    let startIndex = exception.indexOf(searchvalue) + searchvalue.length;
                    let toBeParsed = exception.substring(startIndex);
                    tasks = JSON.parse(toBeParsed);
                  }else{
                    // Should never happen
                  }


                  return <ListItem
                    key={i}
                    primaryText={x.title + ': ' + x.abstract}
                    secondaryText={
                      <p>
                      <span
                        style={{color: darkBlack}}>Launched on <strong>{moment(x.created).format(dateFormat)}</strong> using service <strong>{x.service}</strong>.</span><br />
                        <StatusElement job={x} />, <strong>Duration: </strong>{x.duration}
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
                          primaryText="Browse XML Status File"
                          onTouchTap={(event) => window.open(x.status_location, '_blank')}
                          leftIcon={<FileIcon />}/>
                        {logMenu}
                      </IconMenu>
                    }
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    autoGenerateNestedIndicator={true}
                    leftIcon={<ExpandableIcon />}
                    onNestedListToggle={ (event) => {

                      }
                    }
                    nestedItems={
                      tasks.map((task, j) => {
                        let taskName = Object.keys(task)[0];
                        let parrallelTasks = task[taskName];
                        if(parrallelTasks.length <= 1){
                          let taskDetails = parrallelTasks[0];
                          taskDetails.title = taskName;
                          taskDetails.abstract = "";
                          taskDetails.progress = 100;
                          return (
                            <ProcessListItem
                              indentationLevel={1}
                              isWorkflowTask={true}
                              key={j}
                              job={taskDetails}
                              onShowLogDialog={this._onShowLogDialog}
                              onVisualiseDataset={this._onVisualiseDataset} />
                          );
                        }else{
                          // No actions
                          let completedTasks = parrallelTasks.filter(x => x.status === constants.JOB_SUCCESS_STATUS);
                          return  (
                          <ListItem
                            key={j}
                            primaryText={taskName}
                            secondaryText={
                              <p>
                                Parallel tasks completed with success: <strong>{completedTasks.length} / {parrallelTasks.length}</strong>
                              </p>
                            }
                            secondaryTextLines={1}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            leftIcon={<ExpandableIcon />}
                            rightIcon={<NoActionIcon />}
                            nestedItems={
                              parrallelTasks.map((task, k) => {
                                task.title = taskName;
                                task.abstract = task.data_id;
                                return <ProcessListItem
                                  indentationLevel={2}
                                  isWorkflowTask={true}
                                  key={k}
                                  job={task}
                                  onShowLogDialog={this._onShowLogDialog}
                                  onVisualiseDataset={this._onVisualiseDataset} />
                              })
                            }
                            />
                          );
                        }

                      })
                    }
                  />;
                } else {
                  //Threat as a Single Process
                  let job = {
                    data_id: 0,
                    outputs: [],
                    process_id: x.process_id,
                    status: x.status,
                    status_location: x.status_location
                  };
                  x.outputs = [];
                  let wpsProcessOutputs = x.response_to_json['wps:ExecuteResponse']['wps:ProcessOutputs'];
                  if(wpsProcessOutputs){
                    let outputs = wpsProcessOutputs[0]['wps:Output'];
                    outputs.forEach(function(output){
                      try {
                        x.outputs.push({
                          dataType: "ComplexData",
                          identifier: output['ows:Identifier'][0],
                          mimeType: output['wps:Reference'][0]['$']['mimeType'],
                          reference: output['wps:Reference'][0]['$']['href'],
                          title: output['ows:Title'][0],
                          abstract: output['ows:Abstract'][0]
                        });
                      }catch(error){
                        throw new Error("Bad WPS XML Status Output format");
                      }
                    });
                  }
                  return <ProcessListItem job={x}
                                          key={i}
                                          onShowLogDialog={this._onShowLogDialog}
                                          onVisualiseDataset={this._onVisualiseDataset}/>
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
          <Dialog
            title="Log informations"
            modal={false}
            open={this.state.logDialogOpened}
            onRequestClose={this._closeLogDialog}
            actions={
              <RaisedButton
                label="Close"
                primary={false}
                keyboardFocused={true}
                onTouchTap={this._closeDialog} />
            }
            autoScrollBodyContent={true}>
            {
              (this.state.LogDialogArray.length) ?
              this.state.LogDialogArray.map((log, i) => {
                return <p key={i}>{log}</p>
              }) : null
            }
          </Dialog>
        </div>
      </div>
    );
  }
}
export default ProcessMonitoring;
