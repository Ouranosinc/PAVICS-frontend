import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import MonitoringWorkflowListItem from './../MonitoringWorkflowListItem'
import StatusElement from './../../components/ProcessMonitoring/StatusElement';
import LoadingScreen from './../LoadingScreen';
import ProcessListItem from './../../components/ProcessMonitoring/ProcessListItem';
import PersistResultDialog from './../../components/ProcessMonitoring/PersistResultDialog';
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

class MonitoringJobsList extends React.Component {
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
    pageNumber: 0,
    numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
    loadingScreen: null
  };

  constructor (props) {
    super(props);
    this.loop = null;
    this.props.monitorActions.fetchTwitcherJobs(this.props.project.currentProject.id, constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX], 0);
  }

  componentWillReceiveProps (nextProps) {
    const { jobs, visualizedTempDatasets } = nextProps.monitor;

    if (jobs && jobs.length) {
      // Removed previous launched timeout if any
      clearTimeout(this.loop);

      // Launch polling only if any job is UNKNOWN, ACCEPTED or IN_PROGRESS
      if(jobs.find(job =>
          !job.status ||
          job.status === constants.JOB_PAUSED_STATUS ||
          job.status === constants.JOB_ACCEPTED_STATUS ||
          job.status === constants.JOB_STARTED_STATUS
        )){
        this.pollTwitcherJobs();
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
    }
  }

  pollTwitcherJobs () {
    this.loop = setTimeout( () => {
      this.props.monitorActions.pollTwitcherJobs(this.props.project.currentProject.id, this.state.numberPerPage, this.state.pageNumber);
    }, 3000);
  }

  onRefreshResults = () => {
    this.props.monitorActions.fetchTwitcherJobs(this.props.project.currentProject.id, this.state.numberPerPage, this.state.pageNumber);
  };

  onPageChanged = (pageNumber, numberPerPage) => {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
    this.props.monitorActions.fetchTwitcherJobs(this.props.project.currentProject.id, numberPerPage, pageNumber);
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

  onShowLogDialog = (logs) =>{
    this.onMenuClosed();
    this.setState({
      logDialogOpened: true,
      logDialogArray: logs
    });
  };

  onCloseLogDialog = () => {
    this.setState({
      logDialogOpened: false,
      logDialogArray: []
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
        total={this.props.monitor.jobsCount}
        initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
        perPageOptions={constants.PER_PAGE_OPTIONS}
        onChange={this.onPageChanged} />;
    if (this.props.monitor.jobs.isFetching) {
      mainComponent =
        <Loader name="wps jobs" />;
    } else {
      if (this.props.monitor.jobs.length && this.props.monitor.jobsCount) {
        mainComponent =
          <List>
            <ListSubheader>Launched Jobs</ListSubheader>
            {this.props.monitor.jobs.map((job, i) => {

              // TODO Rework worst if ever made
                if(job.status === null ||
                  job.status === constants.JOB_ACCEPTED_STATUS ||
                  (job.status === constants.JOB_FAILED_STATUS && job.process_id !== __PAVICS_RUN_WORKFLOW_IDENTIFIER__) ||
                  job.status === constants.JOB_STARTED_STATUS ||
                  job.status === constants.JOB_PAUSED_STATUS ||
                  job.status === constants.JOB_STARTED_STATUS ||
                  job.status === constants.JOB_DISMISSED_STATUS ||
                  job.status === constants.JOB_RUNNING_STATUS){
                  // Threat UNKNOWN process & workflow
                  //        PAUSED process & workflow
                  //        PENDING process & workflow
                  //        STARTED process & workflow
                  //        FAILED process
                  return <ProcessListItem job={job}
                                          key={i}
                                          onShowLogDialog={this.onShowLogDialog}
                                          onShowPersistDialog={this.onShowPersistDialog}
                                          onVisualiseDatasets={this.onVisualiseDatasets}/>;
                }else {
                  // Threat SUCCESSFULL and FINISHED jobs (process & workflow)
                  if (job.processId === __PAVICS_RUN_WORKFLOW_IDENTIFIER__) {
                    //Threat FAILED and SUCCESSFULL workflow (both are expandable)

                    return <MonitoringWorkflowListItem
                              job={job}
                              key={i}
                              onShowLogDialog={this.onShowLogDialog}
                              onShowPersistDialog={this.onShowPersistDialog}
                              onVisualiseDatasets={this.onVisualiseDatasets}/>
                  } else {
                    //Threat  SUCCESSFULL process
                    return <ProcessListItem
                      job={job}
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

export default MonitoringJobsList;
