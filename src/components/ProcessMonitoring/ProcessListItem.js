import React from 'react';
import moment from 'moment';
import * as constants from '../../constants';
import StatusElement from './StatusElement';
import {ListItem} from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import PublishIcon from 'material-ui/svg-icons/social/public';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import VisualizeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import LogIcon from 'material-ui/svg-icons/action/receipt';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import PersistIcon from 'material-ui/svg-icons/content/save';
import ExpandableIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import NotExpandableIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import NoActionIcon from 'material-ui/svg-icons/av/not-interested';

export class ProcessListItem extends React.Component {
  static propTypes = {
    indentationLevel:  React.PropTypes.number,
    isWorkflowTask:  React.PropTypes.bool,
    job: React.PropTypes.object.isRequired,
    onShowLogDialog: React.PropTypes.func.isRequired,
    onShowPersistDialog: React.PropTypes.func.isRequired,
    onVisualiseDatasets: React.PropTypes.func.isRequired,
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
      onTouchTap={(event) => this.props.onShowLogDialog(this.props.job.log)}
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
      <IconMenu iconButtonElement={
          <IconButton
            className="cy-actions-btn"
            touch={true}
            tooltipPosition="bottom-left">
            <MoreVertIcon color={grey400}/>
          </IconButton>
        }>
        <MenuItem
          id="cy-status-item"
          primaryText="Browse XML Status File"
          onTouchTap={(event) => window.open(this.props.job.status_location, '_blank')}
          leftIcon={<FileIcon />}/>
        {logMenuItem}
        <MenuItem
          id="cy-visualize-all-agg-item"
          primaryText="Visualize All (Aggregated)"
          disabled={!visualizableTaskOutputs.length}
          onTouchTap={(event) => this.props.onVisualiseDatasets(visualizableTaskOutputs, true)}
          leftIcon={<VisualizeIcon />}/>
        <MenuItem
          id="cy-visualize-all-split-item"
          primaryText="Visualize All (Splitted)"
          disabled={!visualizableTaskOutputs.length}
          onTouchTap={(event) => this.props.onVisualiseDatasets(visualizableTaskOutputs, false)}
          leftIcon={<VisualizeIcon />}/>
      </IconMenu>
    );
  }

  buildBasicIconMenuActions(output) {
    return <IconMenu iconButtonElement={
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
        onTouchTap={(event) => { if (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.reference.length) window.open(output.reference, '_blank'); }}
        leftIcon={<DownloadIcon />}/>
      <MenuItem
        id="cy-publish-item"
        primaryText="Publish (TODO)"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS}
        onTouchTap={(event) => { if (this.props.job.status === constants.JOB_SUCCESS_STATUS) alert('TODO: Call Publish WPS'); }}
        leftIcon={<PublishIcon />}/>
      <MenuItem
        id="cy-persist-item"
        primaryText="Persist"
        disabled={!this._isPersistAvailable(output)}
        onTouchTap={(event) => { if(this._isPersistAvailable(output)) this.props.onShowPersistDialog(output); }}
        leftIcon={<PersistIcon  />}/>
      <MenuItem
        id="cy-visualize-item"
        primaryText="Visualize"
        disabled={!this._isVisualizeAvailable(output)}
        onTouchTap={(event) => {if(this._isVisualizeAvailable(output)) this.props.onVisualiseDatasets([output.reference]); }}
        leftIcon={<VisualizeIcon />}/>
    </IconMenu>
  }

  _isPersistAvailable(output){
      return (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.mimeType === 'application/x-netcdf');
  }
  _isVisualizeAvailable(output) {
    return (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.mimeType === 'application/x-netcdf');
  }

  render () {
    let secondaryText =
      <span style={{color: darkBlack}}>
        <span>Launched on <strong>{moment(this.props.job.created).format(constants.PAVICS_DATE_FORMAT)}</strong> using provider <strong>{this.props.job.service}</strong>.</span><br/>
        <StatusElement job={this.props.job} />, <strong>Duration: </strong>{this.props.job.duration}
      </span>;
    if (this.props.isWorkflowTask) {
      secondaryText =
        <span style={{color: darkBlack}}>
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
              secondaryText={<p>File: {this.extractFileId(output.reference)} <br/>Type: <strong>{output.mimeType}</strong></p>}
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
        onTouchTap={(event) => this.props.onShowLogDialog(this.props.job.log)}
        leftIcon={<LogIcon />}/>;
      if(this.props.job.status === constants.JOB_ACCEPTED_STATUS){
        secondaryText =
          <span style={{color: darkBlack}}>
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

