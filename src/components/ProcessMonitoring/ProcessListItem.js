import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
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

  constructor (props) {
    super(props);
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
    this.props.onShowLogDialog(this.props.job.log);
  };

  onVisualizeOutput = (visualizableReferences, aggregate = false) => {
    this.customIconMenu.onMenuClosed();
    this.props.onVisualiseDatasets(visualizableReferences, aggregate)
  };

  buildMinimalSecondaryActions() {
    let visualizableReferences = [];
    if(this.props.job.outputs) {
      const visualizableOutputs = this.props.job.outputs.filter(o => o.mimeType === 'application/x-netcdf');
      visualizableReferences = visualizableOutputs.map(o => o.reference);
    }
    return (
        <ListItemSecondaryAction
          className={`cy-monitoring-sec-actions cy-monitoring-level-${this.props.indentationLevel}`}>
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
        <span>Launched on <strong>{moment(this.props.job.created).format(constants.PAVICS_DATE_FORMAT)}</strong> using provider <strong>{this.props.job.service}</strong>.</span><br/>
        <StatusElement job={this.props.job} />, <strong>Duration: </strong>{this.props.job.duration}
      </span>;
    if (this.props.isWorkflowTask) {
      secondaryText =
        <span>
          <StatusElement job={this.props.job} />
        </span>;
    }
    if(this.props.job.status === constants.JOB_SUCCESS_STATUS){
      return (
        <CollapseNestedList
          rootListItemClass={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}
          rootListItemStyle={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
          rootListItemText={ <ListItemText inset
                                           primary={(this.props.job.name && this.props.job.name.length)? this.props.job.name: `${this.props.job.title}: ${this.props.job.abstract}`}
                                           secondary={secondaryText} />}
          rootListItemSecondaryActions={this.buildMinimalSecondaryActions()}>
          {
            this.props.job.outputs.map((output, k) => {
              return <ProcessOutputListItem
                key={k}
                indentationLevel={this.props.indentationLevel + 1}
                job={this.props.job}
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
            <span>Will be launched soon using provider <strong>{this.props.job.service}</strong>.</span><br/>
            <StatusElement job={this.props.job} />
          </span>;
      }

      return <ListItem
        className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}
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

