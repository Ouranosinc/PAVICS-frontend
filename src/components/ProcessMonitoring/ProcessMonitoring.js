import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import StatusElement from './StatusElement';
import LoadingScreen from './../LoadingScreen';
import ProcessListItem from './ProcessListItem';
import PersistResultDialog from './PersistResultDialog';
import Dialog from'@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from'@material-ui/core/List';
import ListSubheader from'@material-ui/core/ListSubheader';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from'@material-ui/core/Paper';
import MenuItem from'@material-ui/core/MenuItem';
import Button from'@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import LogIcon from '@material-ui/icons/Receipt';
import VisualizeIcon from '@material-ui/icons/RemoveRedEye';
import Menu from '@material-ui/core/Menu';
import IconButton from'@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import CollapseNestedList from '../CollapseNestedList';

class ProcessMonitoring extends React.Component {
  static propTypes = {
    layerDatasetActions: PropTypes.object.isRequired,
    monitor: PropTypes.object.isRequired,
    monitorActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  };

  state = {
    anchor: null,
    logDialogArray: [],
    logDialogOpened: false,
    persistDialogOutput: {},
    persistDialogOpened: false,
    pageNumber: 1,
    numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
    loadingScreen: null
  };

  constructor (props) {
    super(props);
    this.loop = null;
    this.props.monitorActions.fetchWPSJobs(this.props.project.currentProject.id, constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX], 1);
  }

  componentWillReceiveProps (nextProps) {
    const { jobs, visualizedTempDatasets } = nextProps.monitor;

    if (jobs && jobs.items.length) {
      // Removed previous launched timeout if any
      clearTimeout(this.loop);

      // Launch polling only if any job is UNKNOWN, ACCEPTED or IN_PROGRESS
      if(jobs.items.find(job =>
          !job.status || job.status === constants.JOB_PAUSED_STATUS ||
          job.status === constants.JOB_ACCEPTED_STATUS || job.status === constants.JOB_STARTED_STATUS
        )){
        this.pollWPSJobs();
      }
    }
    if(visualizedTempDatasets &&
      visualizedTempDatasets.items.length &&
      visualizedTempDatasets !== this.props.monitor.visualizedTempDatasets){
      this.props.layerDatasetActions.addDatasetsToVisualize(visualizedTempDatasets.items);
      this.props.layerDatasetActions.selectCurrentDisplayedDataset({
        ...visualizedTempDatasets.items[0],
        currentFileIndex: 0,
        opacity: 0.8
      });
      this.setState({loadingScreen: null});
      // NotificationManager.info("Dataset has been added the Layer Switcher, data is being loaded on the map...", 'Information', 10000);
    }
  }

  pollWPSJobs () {
    this.loop = setTimeout( () => {
      // console.log(moment());
      this.props.monitorActions.pollWPSJobs(this.props.project.currentProject.id, this.state.numberPerPage, this.state.pageNumber);
    }, 3000);
  }

  onRefreshResults = () => {
    this.props.monitorActions.fetchWPSJobs(this.props.project.currentProject.id, this.state.numberPerPage, this.state.pageNumber);
  };

  onPageChanged = (pageNumber, numberPerPage) => {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
    this.props.monitorActions.fetchWPSJobs(this.props.project.currentProject.id, numberPerPage, pageNumber);
  };

  onVisualiseDatasets = (httpURLArray, aggregate = false) => {
    if(httpURLArray.length){
      this.onMenuClosed();
      this.props.monitorActions.visualizeTemporaryResult(httpURLArray, aggregate);
      this.setState({
        loadingScreen: <LoadingScreen />
      });
    }
  };

  onShowLogDialog = (log)  =>{
    this.onMenuClosed();
    this.setState({
      logDialogOpened: true,
      logDialogArray: log
    });
  };

  onCloseLogDialog = () => {
    this.setState({
      logDialogOpened: false,
      logDialogArray: ''
    });
  };

  onShowPersistDialog = (output) => {
    this.setState({
      persistDialogOpened: true,
      persistDialogOutput: output
    });
  };

  onPersistOutputClicked = () => {
    this.onClosePersistDialog();
  };

  onClosePersistDialog = () => {
    this.setState({
      persistDialogOpened: false,
      persistDialogOutput: {}
    });
  };

  onMenuClosed = event => {
    this.setState({ anchor: null });
    if(event) event.stopPropagation();
  };

  onMenuClicked = event => {
    this.setState({ anchor: event.currentTarget });
    event.stopPropagation();
  };

  render () {
    const { anchor } = this.state;
    let mainComponent;
    // Ensure pagination component doesn't get destroyed or we lost pageIndex and perPageIndex values that are in the component
    let pagination =
      <Pagination
        total={this.props.monitor.jobs.count}
        initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
        perPageOptions={constants.PER_PAGE_OPTIONS}
        onChange={this.onPageChanged} />;
    if (this.props.monitor.jobs.isFetching) {
      mainComponent =
        <Loader name="wps jobs" />;
    } else {
      if (this.props.monitor.jobs.items.length && this.props.monitor.jobs.count) {
        mainComponent =
          <List>
            <ListSubheader>Launched Jobs</ListSubheader>
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
                                        onShowLogDialog={this.onShowLogDialog}
                                        onShowPersistDialog={this.onShowPersistDialog}
                                        onVisualiseDatasets={this.onVisualiseDatasets}/>;
              }else {
                if (x.process_id === __PAVICS_RUN_WORKFLOW_IDENTIFIER__) {
                  //Threat FAILED and SUCCESSFULL workflow (both are expandable)
                  let tasks = x.tasks;

                  // If an output is a json array of netcdf urls, we must generate new output for every listed url
                  tasks.forEach(task => {
                    let taskName = Object.keys(task)[0];
                    task[taskName].forEach( parralelTask => {
                      if(parralelTask.outputs) {
                        let newOutputs = [];
                        parralelTask.outputs.forEach(output => {
                          newOutputs = [];
                          // TODO: No idea ATM why output.data is sometimes parsed sometimes not
                          if(output.mimeType === 'application/json' && typeof output.data === 'string') {
                            output.data = JSON.parse(output.data);
                          }
                          if (output.mimeType === 'application/json' && output.data) {
                            if (Array.isArray(output.data) && typeof output.data[0] === 'string' &&
                              (output.data[0].startsWith('http://') || output.data[0].startsWith('https://')) && output.data[0].endsWith('.nc')) {
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

                  let logMenu = null;
                  if(x.status === constants.JOB_SUCCESS_STATUS) {
                    let LogFileURL = x["response_to_json"]['wps:ExecuteResponse']['wps:ProcessOutputs'][0]['wps:Output'][1]['wps:Reference'][0]['$']['xlink:href'];
                    logMenu = <MenuItem
                      id="cy-logs-item"
                      onClick={(event) => window.open(LogFileURL, '_blank')}>
                      <ListItemIcon>
                        <FileIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Browse Log File" />
                    </MenuItem>
                  }else {
                    logMenu = <MenuItem
                      id="cy-logs-item"
                      onClick={(event) => this.onShowLogDialog(x.log)}>
                      <ListItemIcon>
                        <LogIcon />
                      </ListItemIcon>
                      <ListItemText inset primary="Show Logs" />
                    </MenuItem>
                  }

                  return (
                    <CollapseNestedList
                      key={i}
                      rootListItemClass={`cy-monitoring-list-item cy-monitoring-level-0`}
                      rootListItemText={
                        <ListItemText
                          inset
                          primary={(x.name && x.name.length)? x.name: `${x.title}: ${x.abstract}`}
                          secondary={
                            <span>
                              <span>Launched on <strong>{moment(x.created).format(constants.PAVICS_DATE_FORMAT)}</strong> using provider <strong>{x.service}</strong>.</span><br/>
                              <StatusElement job={x} />, <strong>Duration: </strong>{x.duration}
                            </span>
                          }/>
                      }
                      rootListItemSecondaryActions={
                        <ListItemSecondaryAction >
                          <IconButton
                            className="cy-actions-btn"
                            aria-label="Actions"
                            aria-owns={anchor ? "ouput-menu-actions" : null}
                            aria-haspopup="true"
                            onClick={this.onMenuClicked}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="ouput-menu-actions"
                            anchorEl={anchor}
                            open={Boolean(anchor)}
                            onClose={this.onMenuClosed}
                            PaperProps={{
                              style: {
                                width: 200
                              },
                            }}>
                            <MenuItem
                              id="cy-status-item"
                              onClick={(event) => {
                                this.onMenuClosed();
                                window.open(x.status_location, '_blank');
                              }}>
                              <ListItemIcon>
                                <FileIcon />
                              </ListItemIcon>
                              <ListItemText inset primary="Browse XML Status" />
                            </MenuItem>
                            {logMenu}
                          </Menu>
                        </ListItemSecondaryAction>
                      }>
                      {
                        tasks.map((task, j) => {
                          let taskName = Object.keys(task)[0];
                          let parrallelTasks = task[taskName];
                          if (parrallelTasks.length <= 1) {
                            let taskDetails = parrallelTasks[0];
                            taskDetails.title = taskName;
                            taskDetails.abstract = "";
                            taskDetails.progress = 100;
                            return <ProcessListItem
                              indentationLevel={1}
                              isWorkflowTask={true}
                              key={j}
                              job={taskDetails}
                              onShowLogDialog={this.onShowLogDialog}
                              onShowPersistDialog={this.onShowPersistDialog}
                              onVisualiseDatasets={this.onVisualiseDatasets}/>;
                          } else {
                            let completedTasks = parrallelTasks.filter(x => x.status === constants.JOB_SUCCESS_STATUS);
                            let visualizableOutputs = [];
                            parrallelTasks.forEach((task)=> {
                              if (task.outputs) {
                                task.outputs.forEach((output) => {
                                  if (output.mimeType === 'application/x-netcdf') {
                                    visualizableOutputs.push(output.reference);
                                  }
                                });
                              }
                            });
                            // TODO Visualize all for subtasks
                            return (
                              <CollapseNestedList
                                key={j}
                                rootListItemStyle={{marginLeft: "18px"}}
                                rootListItemClass={`cy-monitoring-list-item cy-monitoring-level-parallel`}
                                rootListItemText={
                                  <ListItemText inset
                                    primary={taskName}
                                    secondary={
                                      <span>
                                        Parallel tasks completed with success: <strong>{completedTasks.length}
                                        / {parrallelTasks.length}</strong>
                                      </span>
                                    }/>
                                }
                                rootListItemSecondaryActions={
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      className="cy-actions-btn"
                                      aria-label="Actions"
                                      aria-owns={anchor ? "ouput-menu-actions" : null}
                                      aria-haspopup="true"
                                      onClick={this.onMenuClicked}>
                                      <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                      id="ouput-menu-actions"
                                      anchorEl={anchor}
                                      open={Boolean(anchor)}
                                      onClose={this.onMenuClosed}
                                      PaperProps={{
                                        style: {
                                          width: 200
                                        },
                                      }}>
                                      <MenuItem
                                        id="cy-visualize-all-agg-item"
                                        disabled={!visualizableOutputs.length}
                                        onClick={(event) => this.onVisualiseDatasets(visualizableOutputs, true)}>
                                        <ListItemIcon>
                                          <VisualizeIcon />
                                        </ListItemIcon>
                                        <ListItemText inset primary="Visualize All" secondary="Aggregated"/>
                                      </MenuItem>
                                      <MenuItem
                                        id="cy-visualize-all-split-item"
                                        disabled={!visualizableOutputs.length}
                                        onClick={(event) => this.onVisualiseDatasets(visualizableOutputs, false)}>
                                        <ListItemIcon>
                                          <VisualizeIcon />
                                        </ListItemIcon>
                                        <ListItemText inset primary="Visualize All" secondary="Splitted"/>
                                      </MenuItem>
                                    </Menu>
                                  </ListItemSecondaryAction>
                                }>
                                {
                                  parrallelTasks.map((task, k) => {
                                    task.title = taskName;
                                    task.abstract = task.data_id;
                                    return <ProcessListItem
                                      indentationLevel={2}
                                      isWorkflowTask={true}
                                      key={k}
                                      job={task}
                                      onShowLogDialog={this.onShowLogDialog}
                                      onShowPersistDialog={this.onShowPersistDialog}
                                      onVisualiseDatasets={this.onVisualiseDatasets}/>;
                                  })
                                }
                              </CollapseNestedList>
                            );
                          }
                        })
                      }
                    </CollapseNestedList>
                  );
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
                              (json[0].startsWith('http://') || json[0].startsWith('https://')) && json[0].endsWith('.nc') ) {
                              json.forEach((reference, index) => {
                                x.outputs.push({
                                  dataType: "ComplexData",
                                  identifier: output['ows:Identifier'][0],
                                  mimeType: 'application/x-netcdf',
                                  reference: reference,
                                  title: `${output['ows:Title'][0]} (${index + 1}/${json.length})`,
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
                          x.outputs.push({
                            dataType: output['wps:Data'][0]['wps:LiteralData'][0]['$']['dataType'],
                            identifier: (output['ows:Identifier'])? output['ows:Identifier'][0]: 'None',
                            mimeType: output['wps:Data'][0]['wps:LiteralData'][0]['$']['dataType'],
                            reference: '',
                            title: (output['ows:Title'])? output['ows:Title'][0]: 'None',
                            abstract: (output['ows:Abstract'])? output['ows:Abstract'][0]: 'None'
                          });
                          // console.log(output);
                          // NotificationManager.error("ComplexData inline should not happen anymore", 'Error', 10000);
                        }
                      } catch(error){
                        console.error(error);
                        NotificationManager.error("Unsupported WPS XML Status Output format", 'Error', 10000);
                      }
                    }
                  }
                  return <ProcessListItem job={x}
                                          key={i}
                                          onShowLogDialog={this.onShowLogDialog}
                                          onShowPersistDialog={this.onShowPersistDialog}
                                          onVisualiseDatasets={this.onVisualiseDatasets}/>
                }
              }
            }
            )}
          </List>;
      } else {
        mainComponent =
            <List>
              <ListSubheader>No results found.</ListSubheader>
            </List>;
      }
    }
    console.log('ProcessMonitoring component');
    return (
      <React.Fragment>
        {this.state.loadingScreen}
        <div id="cy-process-monitoring" className="container">
          <Paper style={{ marginTop: 20 }}>
            {mainComponent}
            {pagination}
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => this.onRefreshResults()}>
            <RefreshIcon />Refresh
          </Button>

          <Dialog
            open={this.state.logDialogOpened}
            onClose={this.onCloseLogDialog}>
            <DialogTitle>
              Log informations
            </DialogTitle>
            <DialogContent>
              <Typography>
                {
                  (this.state.logDialogArray.length) ?
                    this.state.logDialogArray.map((log, i) => {
                      return <p key={i}>{log}</p>
                    }) : null
                }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained"
                      color="secondary"
                      onClick={this.onCloseLogDialog}>
                Close
                </Button>
            </DialogActions>
          </Dialog>
          <PersistResultDialog
            output={this.state.persistDialogOutput}
            isOpen={this.state.persistDialogOpened}
            monitorActions={this.props.monitorActions}
            onPersistConfirmed={this.onPersistOutputClicked}
            onClosePersistDialog={this.onClosePersistDialog}
            username={this.props.session.sessionStatus.user.username}>
          </PersistResultDialog>
        </div>
      </React.Fragment>
    );
  }
}

export default ProcessMonitoring;
