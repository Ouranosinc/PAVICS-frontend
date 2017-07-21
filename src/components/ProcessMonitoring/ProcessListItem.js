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
    onVisualiseDatasets: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    indentationLevel: 0,
    isWorkflowTask: false
  };

  constructor (props) {
    super(props);
  }

  extractFileId (reference) {
    const SEARCH_VALUE = "wpsoutputs/";
    let fileId = "";
    let index = reference.indexOf(SEARCH_VALUE);
    if(index > -1) {
      fileId = reference.substring(index + SEARCH_VALUE.length);
    }
    return fileId;
  }

  buildMinimalIconMenuActions() {
    let logMenuItem = <MenuItem
      primaryText="Show Logs"
      onTouchTap={(event) => this.props.onShowLogDialog(this.props.job.log)}
      leftIcon={<LogIcon />}/>;
    // TODO logMenuItem depends on status
    if (this.props.isWorkflowTask){
      logMenuItem = null;
    }
    return (
      <IconMenu iconButtonElement={
          <IconButton
            touch={true}
            tooltipPosition="bottom-left">
            <MoreVertIcon color={grey400}/>
          </IconButton>
        }>
        <MenuItem
          primaryText="Browse XML Status File"
          onTouchTap={(event) => window.open(this.props.job.status_location, '_blank')}
          leftIcon={<FileIcon />}/>
        {logMenuItem}
      </IconMenu>
    );
  }

  buildBasicIconMenuActions(output) {
    let isVisualisableOnMap = false;
    if(output.mimeType === 'application/x-netcdf'){
      isVisualisableOnMap = true;
    }
    if(output.mimeType === 'application/json') {
      // TODO
    }
    return <IconMenu iconButtonElement={
      <IconButton
        touch={true}
        tooltipPosition="bottom-left">
        <MoreVertIcon color={grey400}/>
      </IconButton>}>
      <MenuItem
        primaryText="Visualize"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS || !isVisualisableOnMap}
        onTouchTap={(event) => this.props.onVisualiseDatasets([output.reference])}
        leftIcon={<VisualizeIcon />}/>
      <MenuItem
        primaryText="Download"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS}
        onTouchTap={(event) => window.open(output.reference, '_blank')}
        leftIcon={<DownloadIcon />}/>
      <MenuItem
        primaryText="Publish (TODO)"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS}
        onTouchTap={(event) => alert('TODO: Call Publish WPS')}
        leftIcon={<PublishIcon />}/>
      <MenuItem
        primaryText="Persist (TODO)"
        disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS}
        onTouchTap={(event) => alert('TODO: Call Persist WPS')}
        leftIcon={<PersistIcon  />}/>
    </IconMenu>
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
        style={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
        primaryText={this.props.job.title + ': ' + this.props.job.abstract}
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
              key={k}
              style={{marginLeft: ((this.props.indentationLevel + 1) * 18) + "px"}}
              primaryText={<p>{output.title}: {output.abstract}</p>}
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
        primaryText="Show Logs"
        onTouchTap={(event) => this._onShowLogDialog(x.log)}
        leftIcon={<LogIcon />}/>;
      if(this.props.job.status === constants.JOB_ACCEPTED_STATUS){
        secondaryText =
          <span style={{color: darkBlack}}>
            <span>Will be launched soon using provider using provider <strong>{this.props.job.service}</strong>.</span><br/>
            <StatusElement job={this.props.job} />
          </span>;
        logMenuItem = null
      }

      return <ListItem
        style={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
        primaryText={this.props.job.title + ': ' + this.props.job.abstract}
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

