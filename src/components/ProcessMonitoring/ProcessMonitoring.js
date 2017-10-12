import React from 'react';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import StatusElement from './StatusElement';
import ProcessListItem from './ProcessListItem';
import PersistResultDialog from './PersistResultDialog';
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
import VisualizeIcon from 'material-ui/svg-icons/image/remove-red-eye';

class ProcessMonitoring extends React.Component {
  static propTypes = {
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired,
    monitor: React.PropTypes.object.isRequired,
    monitorActions: React.PropTypes.object.isRequired,
    project: React.PropTypes.object.isRequired,
    sessionManagement: React.PropTypes.object.isRequired,
    fetchVisualizableData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.loop = null;
    this.state = {
      logDialogArray: [],
      logDialogOpened: false,
      persistDialogOutput: {},
      persistDialogOpened: false,
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
    this.props.monitorActions.fetchWPSJobs(this.props.project.currentProject.id, constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX], 1);
    this._closeLogDialog = this._closeLogDialog.bind(this);
    this._onShowLogDialog = this._onShowLogDialog.bind(this);
    this._closePersistDialog = this._closePersistDialog.bind(this);
    this._onPersistOutputClicked = this._onPersistOutputClicked.bind(this);
    this._onShowPersistDialog = this._onShowPersistDialog.bind(this);
    this._onRefreshResults = this._onRefreshResults.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
    this._onVisualiseDatasets = this._onVisualiseDatasets.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.monitor.jobs && nextProps.monitor.jobs.items.length) {
      // Removed previous launched timeout if any
      clearTimeout(this.loop);

      // Launch polling only if any job is UNKNOWN, ACCEPTED or IN_PROGRESS
      if(nextProps.monitor.jobs.items.find(job =>
          !job.status || job.status === constants.JOB_PAUSED_STATUS ||
          job.status === constants.JOB_ACCEPTED_STATUS || job.status === constants.JOB_STARTED_STATUS
        )){
        this.pollWPSJobs();
      }
    }
  }

  pollWPSJobs () {
    this.loop = setTimeout( () => {
      // console.log(moment());
      this.props.monitorActions.pollWPSJobs(this.props.project.currentProject.id, this.state.numberPerPage, this.state.pageNumber);
    }, 3000);
  }

  _onRefreshResults () {
    this.props.monitorActions.fetchWPSJobs(this.props.project.currentProject.id, this.state.numberPerPage, this.state.pageNumber);
  }

  _onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
    this.props.monitorActions.fetchWPSJobs(this.props.project.currentProject.id, numberPerPage, pageNumber);
  }

  _onVisualiseDatasets (urlArray) {
    // TODO Remove hardcoded path
    console.log('TODO: Call Visualize WPS, temporary built WMS URL so the result can be seen but TimeSlider and other features won\'t work');
    urlArray.forEach((url) => {
      let prefix = __PAVICS_NCWMS_PATH__ + '?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0&DATASET=outputs/wps_outputs/';
      let index = url.indexOf('flyingpigeon');
      let suffix = url.substring(index, url.length);
      this.props.addDatasetLayersToVisualize([
        {
          wms_url: prefix + suffix,
          dataset_id: suffix
        }
      ]);
    });
  }

  _onShowLogDialog (log) {
    this.setState({
      logDialogOpened: true,
      logDialogArray: log
    });
  }

  _closeLogDialog () {
    this.setState({
      logDialogOpened: false,
      logDialogArray: ''
    });
  }

  _onShowPersistDialog (output) {
    this.setState({
      persistDialogOpened: true,
      persistDialogOutput: output
    });
  }

  _onPersistOutputClicked () {
    alert('called WPS');
    this._closePersistDialog();
  }

  _closePersistDialog () {
    this.setState({
      persistDialogOpened: false,
      persistDialogOutput: {}
    });
  }

  render () {
    let mainComponent;
    // Ensure pagination component doesn't get destroyed or we lost pageIndex and perPageIndex values that are in the component
    let pagination =
      <Pagination
        total={this.props.monitor.jobs.count}
        initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
        perPageOptions={constants.PER_PAGE_OPTIONS}
        onChange={this._onPageChanged} />;
    if (this.props.monitor.jobs.isFetching) {
      mainComponent =
        <Loader name="wps jobs" />;
    } else {
      if (this.props.monitor.jobs.items.length && this.props.monitor.jobs.count) {
        // Backend Phoenix pagination now
        // let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
        // let paginated = this.props.monitor.jobs.items.slice(start, start + this.state.numberPerPage);
        mainComponent =
          <List>
            <Subheader>Launched Jobs</Subheader>
            {this.props.monitor.jobs.items.map((x, i) => {

              if(x.status === null ||
                x.status === constants.JOB_PAUSED_STATUS ||
                x.status === constants.JOB_ACCEPTED_STATUS ||
                x.status === constants.JOB_STARTED_STATUS ||
                (x.status === constants.JOB_FAILED_STATUS && x.process_id !== __PAVICS_RUN_WORKFLOW_IDENTIFIER__)){
                // Threat UNKNOWN process & workflow
                //        PAUSED process & workflow
                //        PENDING process & workflow
                //        STARTED process & workflow
                //        FAILED process
                return <ProcessListItem job={x}
                                        key={i}
                                        onShowLogDialog={this._onShowLogDialog}
                                        onShowPersistDialog={this._onShowPersistDialog}
                                        onVisualiseDatasets={this._onVisualiseDatasets}/>;
              }else {
                if (x.process_id === __PAVICS_RUN_WORKFLOW_IDENTIFIER__) {
                  //Threat FAILED and SUCCESSFULL workflow (both are expandable)
                  let tasks = [];
                  let logMenu = <MenuItem
                    primaryText="Show Logs"
                    onTouchTap={(event) => this._onShowLogDialog(x.log)}
                    leftIcon={<LogIcon />}/>;

                  tasks = x.tasks;

                  // If an output is a json array of netcdf urls, we must generate new output for every listed url
                  tasks.forEach(task => {
                    let newOutputs = [];
                    let taskName = Object.keys(task)[0];
                    task[taskName].forEach( parralelTask => {
                      if(parralelTask.outputs) {

                        parralelTask.outputs.forEach(output => {
                          if (output.mimeType === 'application/json' && output.data) {
                            if (Array.isArray(output.data) && typeof output.data[0] === 'string' &&
                              output.data[0].startsWith('http://') && output.data[0].endsWith('.nc')) {
                              output.data.forEach((url, index) => {
                                newOutputs.push({
                                  dataType: "ComplexData",
                                  identifier: output.identifier,
                                  mimeType: 'application/x-netcdf',
                                  reference: url,
                                  title: `${output.title} (${index + 1}/${output.data.length})`,
                                  abstract: ''
                                });
                              });
                            } else {
                              newOutputs.push({
                                dataType: output.dataType,
                                identifier: output.identifier,
                                mimeType: output.mimeType,
                                reference: output.reference,
                                title: output.title,
                                abstract: ''
                              });
                            }
                          } else {
                            newOutputs.push({
                              dataType: output.dataType,
                              identifier: output.identifier,
                              mimeType: output.mimeType,
                              reference: output.reference,
                              title: output.title,
                              abstract: ''
                            });
                          }
                        });
                        parralelTask.outputs = newOutputs;
                      }
                    });
                  });

                  if(x.status === constants.JOB_SUCCESS_STATUS) {
                    let LogFileURL = x["response_to_json"]['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'][1]['wps:Reference'][0]['$']['xlink:href'];
                    logMenu = <MenuItem
                      primaryText="Browse Log File"
                      onTouchTap={(event) => window.open(LogFileURL, '_blank')}
                      leftIcon={<FileIcon />}/>
                  }

                  return <ListItem
                    key={i}
                    primaryText={x.title + ': ' + x.abstract}
                    secondaryText={
                      <p>
                      <span
                        style={{color: darkBlack}}>Launched on <strong>{moment(x.created).format(constants.PAVICS_DATE_FORMAT)}</strong> using provider <strong>{x.service}</strong>.</span><br />
                        <StatusElement job={x} />, <strong>Duration: </strong>{x.duration}
                      </p>
                    }
                    secondaryTextLines={2}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltipPosition="bottom-left">AoN
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
                              onShowPersistDialog={this._onShowPersistDialog}
                              onVisualiseDatasets={this._onVisualiseDatasets} />
                          );
                        }else{
                          // No actions
                          let completedTasks = parrallelTasks.filter(x => x.status === constants.JOB_SUCCESS_STATUS);
                          let visualizableOutputs = [];
                          parrallelTasks.forEach((task)=> {
                            if(task.outputs) {
                              task.outputs.forEach((output) => {
                                if(output.mimeType === 'application/x-netcdf') {
                                  visualizableOutputs.push(output.reference);
                                }
                              });
                            }
                          });
                          // TODO Visualize all for subtasks
                          return  (
                          <ListItem
                            key={j}
                            primaryText={taskName}
                            secondaryText={
                              <p>
                                Parallel tasks completed with success: <strong>{completedTasks.length} / {parrallelTasks.length}</strong>
                              </p>
                            }
                            secondaryTextLines={2}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            leftIcon={<ExpandableIcon />}
                            rightIcon={
                              <IconMenu iconButtonElement={
                                <IconButton
                                  touch={true}
                                  tooltipPosition="bottom-left">
                                  <MoreVertIcon color={grey400}/>
                                </IconButton>
                              }>
                                <MenuItem
                                  primaryText="Visualize All"
                                  disabled={!visualizableOutputs.length}
                                  onTouchTap={(event) => this._onVisualiseDatasets(visualizableOutputs)}
                                  leftIcon={<VisualizeIcon />}/>
                              </IconMenu>
                            }
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
                                  onShowPersistDialog={this._onShowPersistDialog}
                                  onVisualiseDatasets={this._onVisualiseDatasets} />
                              })
                            }
                            />
                          );
                        }

                      })
                    }
                  />;
                } else {
                  //Threat  SUCCESSFULL process
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
                    for(let i = 0; i < outputs.length; ++i){
                      try {
                        let output = outputs[i];
                        if (output['wps:Reference']) {
                          if (output['wps:Reference'][0]['$']['mimeType'] === 'application/json') {
                            // We might have to generate multiple outputs
                            let json = JSON.parse(x.outputs_to_json[i]);
                            if (Array.isArray(json) && typeof json[0] === 'string' &&
                              json[0].startsWith('http://') && json[0].endsWith('.nc') ) {
                              json.forEach(json => {
                                x.outputs.push({
                                  dataType: "ComplexData",
                                  identifier: output['ows:Identifier'][0],
                                  mimeType: 'application/x-netcdf',
                                  reference: json,
                                  title: output['ows:Title'][0],
                                  abstract: output['ows:Abstract'][0]
                                });
                              });
                            } else {
                              x.outputs.push({
                                dataType: "ComplexData",
                                identifier: output['ows:Identifier'][0],
                                mimeType: output['wps:Reference'][0]['$']['mimeType'],
                                reference: output['wps:Reference'][0]['$']['xlink:href'] || output['wps:Reference'][0]['$']['href'],
                                title: output['ows:Title'][0],
                                abstract: output['ows:Abstract'][0]
                              });
                            }
                          } else {
                            x.outputs.push({
                              dataType: "ComplexData",
                              identifier: output['ows:Identifier'][0],
                              mimeType: output['wps:Reference'][0]['$']['mimeType'],
                              reference: output['wps:Reference'][0]['$']['xlink:href'] || output['wps:Reference'][0]['$']['href'],
                              title: output['ows:Title'][0],
                              abstract: output['ows:Abstract'][0]
                            });
                          }
                        } else {
                          NotificationManager.error("ComplexData inline should not happen anymore");
                        }
                      } catch(error){
                        console.error(error);
                        NotificationManager.error("Bad WPS XML Status Output format");
                      }
                    }
                  }
                  return <ProcessListItem job={x}
                                          key={i}
                                          onShowLogDialog={this._onShowLogDialog}
                                          onShowPersistDialog={this._onShowPersistDialog}
                                          onVisualiseDatasets={this._onVisualiseDatasets}/>
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
                onTouchTap={this._closeLogDialog} />
            }
            autoScrollBodyContent={true}>
            {
              (this.state.logDialogArray.length) ?
              this.state.logDialogArray.map((log, i) => {
                return <p key={i}>{log}</p>
              }) : null
            }
          </Dialog>
          <PersistResultDialog
            output={this.state.persistDialogOutput}
            isOpen={this.state.persistDialogOpened}
            monitorActions={this.props.monitorActions}
            onPersistConfirmed={this._onPersistOutputClicked}
            closePersistDialog={this._closePersistDialog}
            username={this.props.sessionManagement.sessionStatus.user.username}>
          </PersistResultDialog>
        </div>
      </div>
    );
  }
}
export default ProcessMonitoring;
