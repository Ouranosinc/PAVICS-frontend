import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as constants from '../../constants';
import StatusElement from './StatusElement';
import {ListItem} from'@material-ui/core/List';
// import IconMenu from'@material-ui/core/IconMenu';
import MenuItem from'@material-ui/core/MenuItem';
import IconButton from'@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Public';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VisualizeIcon from '@material-ui/icons/RemoveRedEye';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import LogIcon from '@material-ui/icons/Receipt';
import DownloadIcon from '@material-ui/icons/FileDownload';
import PersistIcon from '@material-ui/icons/Save';
import ExpandableIcon from '@material-ui/icons/KeyboardArrowDown';
import NotExpandableIcon from '@material-ui/icons/KeyboardArrowRight';

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

  buildMinimalIconMenuActions() {
    let logMenuItem = <MenuItem
      id="cy-logs-item"
      primaryText="Show Logs"
      onClick={(event) => this.props.onShowLogDialog(this.props.job.log)}
      leftIcon={<LogIcon />}/>;
    // TODO logMenuItem depends on status
    if (this.props.isWorkflowTask){
      logMenuItem = null;
    }
    let visualizableTaskOutputs = [];
    if(this.props.job.outputs) {
      this.props.job.outputs.forEach(output => {
        if(output.mimeType === 'application/x-netcdf') {
          visualizableTaskOutputs.push(output.reference);
        }
      });
    }
    return (
      <span />
      /*<IconMenu iconButtonElement={
          <IconButton
            className="cy-actions-btn"
            touch={true}
            tooltipPosition="bottom-left">
            <MoreVertIcon />
          </IconButton>
        }>
        <MenuItem
          id="cy-status-item"
          primaryText="Browse XML Status File"
          onClick={(event) => window.open(this.props.job.status_location, '_blank')}
          leftIcon={<FileIcon />}/>
        {logMenuItem}
        <MenuItem
          id="cy-visualize-all-agg-item"
          primaryText="Visualize All (Aggregated)"
          disabled={!visualizableTaskOutputs.length}
          onClick={(event) => this.props.onVisualiseDatasets(visualizableTaskOutputs, true)}
          leftIcon={<VisualizeIcon />}/>
        <MenuItem
          id="cy-visualize-all-split-item"
          primaryText="Visualize All (Splitted)"
          disabled={!visualizableTaskOutputs.length}
          onClick={(event) => this.props.onVisualiseDatasets(visualizableTaskOutputs, false)}
          leftIcon={<VisualizeIcon />}/>
      </IconMenu>*/
    );
  }

  buildBasicIconMenuActions(output) {
    return <span />
     /*<IconMenu iconButtonElement={
      <IconButton
        className="cy-actions-btn"
        touch={true}
        tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400}/>
      </IconButton>}>
      <MenuItem
        id="cy-download-item"
        primaryText="Download"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS || (output.reference === undefined || !output.reference.length)}
        onClick={(event) => { if (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.reference.length) window.open(output.reference, '_blank'); }}
        leftIcon={<DownloadIcon />}/>
      <MenuItem
        id="cy-publish-item"
        primaryText="Publish (TODO)"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS}
        onClick={(event) => { if (this.props.job.status === constants.JOB_SUCCESS_STATUS) alert('TODO: Call Publish WPS'); }}
        leftIcon={<PublishIcon />}/>
      <MenuItem
        id="cy-persist-item"
        primaryText="Persist"
        disabled={!this._isPersistAvailable(output)}
        onClick={(event) => { if(this._isPersistAvailable(output)) this.props.onShowPersistDialog(output); }}
        leftIcon={<PersistIcon  />}/>
      <MenuItem
        id="cy-visualize-item"
        primaryText="Visualize"
        disabled={!this._isVisualizeAvailable(output)}
        onClick={(event) => {if(this._isVisualizeAvailable(output)) this.props.onVisualiseDatasets([output.reference]); }}
        leftIcon={<VisualizeIcon />}/>
    </IconMenu>*/
  }

  _isPersistAvailable(output){
      return (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.mimeType === 'application/x-netcdf');
  }
  _isVisualizeAvailable(output) {
    return (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.mimeType === 'application/x-netcdf');
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
      return <ListItem
        className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}
        style={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
        primaryText={(this.props.job.name && this.props.job.name.length)? this.props.job.name: `${this.props.job.title}: ${this.props.job.abstract}`}
        secondaryText={secondaryText}
        secondaryTextLines={2}
        rightIconButton={
          this.buildMinimalIconMenuActions()
        }
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        leftIcon={<ExpandableIcon />}
        nestedItems={
          this.props.job.outputs.map((output, k) => {
            return <ListItem
              className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel + 1}`}
              key={k}
              style={{marginLeft: ((this.props.indentationLevel + 1) * 18) + "px"}}
              primaryText={(output.name && output.name.length)? output.name: `${output.title}: ${output.abstract}`}
              secondaryText={<div>File: {this.extractFileId(output.reference)} <br/>Type: <strong>{output.mimeType}</strong></div>}
              secondaryTextLines={2}
              leftIcon={<FileIcon />}
              rightIconButton={
                this.buildBasicIconMenuActions(output)
              }
            />;
          })
        }
      />;
    }else{
      // Not a success has typically no outputs and only a log file to be shown
      let logMenuItem = <MenuItem
        id="cy-logs-item"
        primaryText="Show Logs"
        onClick={(event) => this.props.onShowLogDialog(this.props.job.log)}
        leftIcon={<LogIcon />}/>;
      if(this.props.job.status === constants.JOB_ACCEPTED_STATUS){
        secondaryText =
          <span>
            <span>Will be launched soon using provider <strong>{this.props.job.service}</strong>.</span><br/>
            <StatusElement job={this.props.job} />
          </span>;
        logMenuItem = null
      }

      return <ListItem
        className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}
        style={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
        primaryText={(this.props.job.name && this.props.job.name.length)? this.props.job.name: `${this.props.job.title}: ${this.props.job.abstract}`}
        secondaryText={secondaryText}
        secondaryTextLines={2}
        rightIcon={this.buildMinimalIconMenuActions()}
        initiallyOpen={false}
        primaryTogglesNestedList={true}
        leftIcon={<NotExpandableIcon />}
      />;
    }
  }
}
export default ProcessListItem;

