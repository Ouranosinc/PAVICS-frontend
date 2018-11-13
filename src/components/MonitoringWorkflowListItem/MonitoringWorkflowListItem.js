import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import StatusElement from './../ProcessMonitoring/StatusElement';
import ProcessListItem from './../ProcessMonitoring/ProcessListItem';
import ProcessOutputListItem from './../ProcessMonitoring/ProcessOutputListItem';
import CustomIconMenu from '../CustomIconMenu';
import CollapseNestedList from '../CollapseNestedList';
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

export class MonitoringWorkflowListItem extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    onShowLogDialog: PropTypes.func.isRequired,
    onShowPersistDialog: PropTypes.func.isRequired,
    onVisualiseDatasets: PropTypes.func.isRequired,
  };

  state = {
    anchor: null,
    results: []
  };

  constructor (props) {
    super(props);
  }

  onMenuClosed = event => {
    this.setState({ anchor: null });
    if(event) event.stopPropagation();
  };

  onMenuClicked = event => {
    this.setState({ anchor: event.currentTarget });
    event.stopPropagation();
  };

  componentDidUpdate(prevProps) {
    if (this.props.job && this.props.job !== prevProps.job) {
      // Only once maybe ...
      fetch(this.props.job.results)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            NotificationManager.error(`Results at URL ${nextProps.job.results} failed at being fetched: ${error}`, 'Error', 10000);
          }
        })
        .then(json => {
          // json[0] => workflow results / json[1] => workflow log file
          let results = json[0];
          const logs = json[1];
          if (json.length === 2 && results.data) {
            this.setState({
              results: results.data,
              logs: logs
            })
          } else {
            // Temporary fix since some birds don't return data object when mimeType === application/json
            fetch(json[0].reference)
              .then(response => response.json())
              .then(json => {
                results.data = json
                this.setState({
                  results: results.data,
                  logs: logs
                })
              })
              .catch(function (error) {
                NotificationManager.error(`Workflow results failed at being fetched: ${error}`, 'Error', 10000);
              });
          }
        })
        .catch(error => {
          NotificationManager.error(`Results at URL ${nextProps.job.results} failed at being fetched: ${error}`, 'Error', 10000);
        });
    }
  }

  buildSuccessfullWorkflowListItem() {
    const { anchor, logs, results } = this.state;
    const { job } = this.props;

    // If an output is a json array of netcdf urls, we must generate new output for every listed url
    results.forEach(task => {
      let taskName = Object.keys(task)[0];
      task[taskName].forEach( parrallelTask => {
        if (parrallelTask.outputs) {
          let newOutputs = [];
          parrallelTask.outputs.forEach(output => {
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
                    title: `${output.title} (${index + 1}/${output.data.length})`
                  });
                });
              } else {
                newOutputs.push({
                  dataType: output.dataType,
                  identifier: output.identifier,
                  mimeType: output.mimeType,
                  reference: output.reference,
                  title: output.title
                });
              }
            } else {
              newOutputs.push({
                dataType: output.dataType,
                identifier: output.identifier,
                mimeType: output.mimeType,
                reference: output.reference,
                title: output.title
              });
            }
          });
          parrallelTask.outputs = newOutputs;

          // Clean up to match Twitcher API status
          switch (parrallelTask.status) {
            case constants.WPS_ACCEPTED_STATUS:
              parrallelTask.status = constants.JOB_ACCEPTED_STATUS;
              break;
            case constants.WPS_FAILED_STATUS:
              parrallelTask.status = constants.JOB_FAILED_STATUS;
              break;
            case constants.WPS_SUCCESS_STATUS:
              parrallelTask.status = constants.JOB_SUCCESS_STATUS;
              break;
            case constants.WPS_STARTED_STATUS:
              parrallelTask.status = constants.JOB_STARTED_STATUS;
              break;
            case constants.WPS_PAUSED_STATUS:
              parrallelTask.status = constants.JOB_PAUSED_STATUS;
              break;
            default:
              break;
          }
        }
      });
    });

    return (
      <CollapseNestedList
        rootListItemClass={`cy-monitoring-list-item cy-monitoring-level-0`}
        rootListItemText={
          <ListItemText
            inset
            primary={job.name}
            secondary={
              <span>
                <span>Launched on <strong>{moment(job.createdOn).format(constants.PAVICS_DATE_FORMAT)}</strong> using provider <strong>{job.providerId}</strong>.</span><br/>
                <StatusElement job={job} />
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
                  window.open('', '_blank');
                }}>
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText inset primary="Browse XML Status" />
              </MenuItem>
              <MenuItem
                id="cy-logs-item"
                onClick={(event) => window.open(logs.reference, '_blank')}>
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText inset primary="Browse Log File" />
              </MenuItem>
            </Menu>
          </ListItemSecondaryAction>
        }>
        {
          results.map((task, j) => {
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
                onShowLogDialog={this.props.onShowLogDialog}
                onShowPersistDialog={this.props.onShowPersistDialog}
                onVisualiseDatasets={this.props.onVisualiseDatasets}/>;
            } else {
              let completedTasks = parrallelTasks.filter(t => t.status === constants.JOB_SUCCESS_STATUS);
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
                        onShowLogDialog={this.props.onShowLogDialog}
                        onShowPersistDialog={this.props.onShowPersistDialog}
                        onVisualiseDatasets={this.props.onVisualiseDatasets}/>;
                    })
                  }
                </CollapseNestedList>
              );
            }
          })
        }
      </CollapseNestedList>
    );
  }

  buildFailedWorkflowListItem() {
    // Parse log file or results if it exists (could now be different)
    return (
      <CollapseNestedList>

      </CollapseNestedList>
    );
  }

  render () {
    const { job } = this.props;
    if (job.status === constants.JOB_SUCCESS_STATUS || job.status === constants.JOB_FINISHED_STATUS) {
      return this.buildSuccessfullWorkflowListItem();
    } else if(job.status === constants.JOB_SUCCESS_STATUS || job.status === constants.JOB_FINISHED_STATUS) {
      return this.buildFailedWorkflowListItem();
    } else {
      return null;
    }
  }
}
export default MonitoringWorkflowListItem;

