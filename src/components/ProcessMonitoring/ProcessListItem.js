import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import myHttp from '../../util/http';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import StatusElement from './StatusElement';
import ListItem from'@material-ui/core/ListItem';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from'@material-ui/core/MenuItem';
import PublishIcon from '@material-ui/icons/Public';
import VisualizeIcon from '@material-ui/icons/RemoveRedEye';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import LogIcon from '@material-ui/icons/Receipt';
import DownloadIcon from '@material-ui/icons/FileDownload';
import PersistIcon from '@material-ui/icons/Save';
import NotExpandableIcon from '@material-ui/icons/KeyboardArrowRight';
import CustomIconMenu from '../CustomIconMenu';
import CollapseNestedList from '../CollapseNestedList';
import ProcessOutputListItem from './ProcessOutputListItem';

export class ProcessListItem extends React.Component {
  static propTypes = {
    indentationLevel:  PropTypes.number,
    isWorkflowTask:  PropTypes.bool,
    job: PropTypes.object.isRequired,
    onShowLogDialog: PropTypes.func.isRequired,
    onShowPersistDialog: PropTypes.func.isRequired,
    onVisualiseDatasets: PropTypes.func.isRequired,
  };

  static defaultProps = {
    indentationLevel: 0,
    isWorkflowTask: false
  };

  customIconMenu = {};
  state = {
    outputs: []
  };

  constructor (props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.job !== prevProps.job) {
      if (this.props.job.outputs) {
        this.setState({ outputs: this.props.job.outputs})
      }
    }
  }

  extractFileId (reference = '') {
    const SEARCH_VALUE = "wpsoutputs/";
    let fileId = "No file reference defined";
    let index = reference.indexOf(SEARCH_VALUE);
    if(index > -1) {
      fileId = reference.substring(index + SEARCH_VALUE.length);
    }else{
      const SEARCH_VALUE_2 = "fileServer/";
      index = reference.indexOf(SEARCH_VALUE_2);
      if(index > -1) {
        fileId = reference.substring(index + SEARCH_VALUE_2.length);
      }
    }
    return fileId;
  }

  onBrowseXMLStatus = () => {
    this.customIconMenu.onMenuClosed();
    window.open(this.props.job.status_location, '_blank')
  };

  onShowLogs = () => {
    this.customIconMenu.onMenuClosed();
    if (open && this.props.job && this.props.job.logs && this.props.job.logs.length) {
      fetch(this.props.job.logs)
      .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            NotificationManager.error(`Results at URL ${this.props.job.logs} failed at being fetched: ${error}`, 'Error', 10000);
          }
        })
        .then(json => {
          this.props.onShowLogDialog(json);
        })
        .catch(error => {
          NotificationManager.error(`Results at URL ${this.props.job.logs} failed at being fetched: ${error}`, 'Error', 10000);
        });
    }
  };

  onVisualizeOutput = (visualizableReferences, aggregate = false) => {
    this.customIconMenu.onMenuClosed();
    this.props.onVisualiseDatasets(visualizableReferences, aggregate)
  };

  handleListItemClicked = (open) => {
    if (open && this.props.job && this.props.job.results && this.props.job.results.length && !this.props.isWorkflowTask) {
      // workflowTask normally already provide outputs
      fetch(this.props.job.results)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            NotificationManager.error(`Results at URL ${this.props.job.results} failed at being fetched: ${error}`, 'Error', 10000);
          }
        })
        .then(json => {
          let newOutputs = [];
          // Consider JSON outputs containing array of NetCDF as a new set of outputs (flat)
          json.forEach(output => {
            if (output.data && Array.isArray(output.data)) {
              const firstValue = output.data[0];
              if (typeof firstValue === 'string' && (firstValue.startsWith('http://') || firstValue.startsWith('https://')) && firstValue.endsWith('.nc')) {
                output.data.forEach((netCDFReference, index) => {
                  newOutputs.push({
                    mimeType: 'application/x-netcdf',
                    reference: netCDFReference,
                    title:  `${output.title} (${index + 1}/${output.data.length})`,
                    dataType: "ComplexData",
                    url: output.url
                  });
                });
              }
            }else {
              newOutputs.push(output);
            }
          });

          this.setState({ outputs : newOutputs});

        })
        .catch(error => {
          NotificationManager.error(`Results at URL ${this.props.job.results} failed at being fetched: ${error}`, 'Error', 10000);
        });
    } else if(open && this.props.job && this.props.job.outputs && Array.isArray(this.props.job.outputs) && this.props.isWorkflowTask) {
      this.setState({ outputs : this.props.job.outputs});
    }
  };

  buildMinimalSecondaryActions() {
    let visualizableReferences = [];
    if(this.props.job.outputs) {
      const visualizableOutputs = this.props.job.outputs.filter(o => o.mimeType === 'application/x-netcdf');
      visualizableReferences = visualizableOutputs.map(o => o.reference);
    }
    return (
        <ListItemSecondaryAction
          className={`cy-monitoring-sec-actions cy-monitoring-level-${this.props.indentationLevel}`} // `
        >
          <CustomIconMenu
            key={visualizableReferences}
            onRef={ref => (this.customIconMenu = ref)}
            iconButtonClass="cy-actions-btn"
            menuId="ouput-menu-actions"
            menuItems={[
              <MenuItem
                key="status-item"
                id="cy-status-item"
                onClick={(event) => this.onBrowseXMLStatus()}>
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText inset primary="Browse XML Status"/>
              </MenuItem>,
              (this.props.isWorkflowTask)? null:
              <MenuItem
                key="logs-item"
                id="cy-logs-item"
                onClick={(event) => this.onShowLogs()}>
                <ListItemIcon>
                  <LogIcon />
                </ListItemIcon>
                <ListItemText inset primary="Show Logs" />
              </MenuItem>,
              <MenuItem
                key="visualize-all-agg-item"
                id="cy-visualize-all-agg-item"
                disabled={!visualizableReferences.length}
                onClick={(event) => this.onVisualizeOutput(visualizableReferences, true)}>
                <ListItemIcon>
                  <VisualizeIcon />
                </ListItemIcon>
                <ListItemText inset
                              primary="Visualize All"
                              secondary="Aggregated"/>
              </MenuItem>,
              <MenuItem
                key="visualize-all-split-item"
                id="cy-visualize-all-split-item"
                disabled={!visualizableReferences.length}
                onClick={(event) => this.onVisualizeOutput(visualizableReferences, false)}>
                <ListItemIcon>
                  <VisualizeIcon />
                </ListItemIcon>
                <ListItemText inset
                              primary="Visualize All"
                              secondary="Splitted"/>
              </MenuItem>
            ]}/>
        </ListItemSecondaryAction>
    );
  }

  render () {
    let secondaryText =
      <span>
        <span>Launched on <strong>{moment(this.props.job.createdOn).format(constants.PAVICS_DATE_FORMAT)}</strong> using provider <strong>{this.props.job.providerId}</strong></span><br/>
        <StatusElement job={this.props.job} />
      </span>;
    if (this.props.isWorkflowTask) {
      secondaryText =
        <span>
          <StatusElement job={this.props.job} />
        </span>;
    }
    if(this.props.job.status === constants.JOB_SUCCESS_STATUS || this.props.job.status === constants.JOB_FINISHED_STATUS){
      return (
        <CollapseNestedList
          rootListItemClass={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}// `
          rootListItemStyle={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
          rootListItemText={ <ListItemText inset
                                           primary={(this.props.job.name && this.props.job.name.length)? this.props.job.name: `${this.props.job.title}: ${this.props.job.abstract}`} // `
                                           secondary={secondaryText} />}
          onClicked={this.handleListItemClicked}
          rootListItemSecondaryActions={this.buildMinimalSecondaryActions()}>
          {
            this.state.outputs.map((output, k) => {
              return <ProcessOutputListItem
                key={k}
                indentationLevel={this.props.indentationLevel + 1}
                jobStatus={this.props.job.status}
                output={output}
                extractFileId={this.extractFileId}
                onShowPersistDialog={this.props.onShowPersistDialog}
                onVisualizeOutput={this.onVisualizeOutput} />;
            })
          }
        </CollapseNestedList>
      );
    }else{
      // Not a success has typically no outputs and only a log file to be shown
      if(this.props.job.status === constants.JOB_ACCEPTED_STATUS){
        secondaryText =
          <span>
            <span>Will be launched soon using provider <strong>{this.props.job.providerId}</strong></span><br/>
            <StatusElement job={this.props.job} />
          </span>;
      }

      return <ListItem
        className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}// `
        style={{marginLeft: (this.props.indentationLevel * 18) + "px"}}>
          <ListItemIcon>
            <NotExpandableIcon />
          </ListItemIcon>
          <ListItemText inset
                        primary={(this.props.job.name && this.props.job.name.length)? this.props.job.name: `${this.props.job.title}: ${this.props.job.abstract}`}
                        secondary={secondaryText} />
          {this.buildMinimalSecondaryActions()}
        </ListItem>
    }
  }
}
export default ProcessListItem;

