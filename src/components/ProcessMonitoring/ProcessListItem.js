import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as constants from '../../constants';
import StatusElement from './StatusElement';
import ListSubheader from'@material-ui/core/ListSubheader';
import ListItem from'@material-ui/core/ListItem';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
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
import CollapseNestedList from '../CollapseNestedList';

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
    this.state = {
      anchor: null
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

  onMenuClosed = event => {
    this.setState({ anchor: null });
    if(event) event.stopPropagation();
  };

  onMenuClicked = event => {
    this.setState({ anchor: event.currentTarget });
    event.stopPropagation();
  };

  buildMinimalSecondaryActions() {
    const { anchor } = this.state;
    let logMenuItem = <MenuItem
      id="cy-logs-item"
      onClick={(event) => this.props.onShowLogDialog(this.props.job.log)}>
      <ListItemIcon>
        <LogIcon />
      </ListItemIcon>
      <ListItemText inset primary="Show Logs" />
      </MenuItem>;
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
        <ListItemSecondaryAction >
          <IconButton
            className="cy-actions-btn"
            aria-label="More"
            aria-owns={anchor ? 'criterias-menu-actions' : null}
            aria-haspopup="true"
            onClick={() => this.onMenuClicked}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="criterias-menu-actions"
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
              onClick={(event) => window.open(this.props.job.status_location, '_blank')}>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText inset primary="Browse XML Status File" />
            </MenuItem>
            {logMenuItem}
            <MenuItem
              id="cy-visualize-all-agg-item"
              primaryText="Visualize All (Aggregated)"
              disabled={!visualizableTaskOutputs.length}
              onClick={(event) => this.props.onVisualiseDatasets(visualizableTaskOutputs, true)}>
              <ListItemIcon>
                <VisualizeIcon />
              </ListItemIcon>
              <ListItemText inset
                            primary="Visualize All"
                            secondary="Aggregated" />
            </MenuItem>
            <MenuItem
              id="cy-visualize-all-split-item"
              disabled={!visualizableTaskOutputs.length}
              onClick={(event) => this.props.onVisualiseDatasets(visualizableTaskOutputs, false)}>
              <ListItemIcon>
                <VisualizeIcon />
              </ListItemIcon>
              <ListItemText inset
                            primary="Visualize All"
                            secondary="Splitted" />
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
    );
  }

  buildBasicSecondaryActions(output) {
    const { anchor } = this.state;
    return <ListItemSecondaryAction >
      <IconButton
        className="cy-actions-btn"
        aria-label="More"
        aria-owns={anchor ? 'criterias-menu-actions' : null}
        aria-haspopup="true"
        onClick={() => this.onMenuClicked}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="criterias-menu-actions"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={this.onMenuClosed}
        PaperProps={{
          style: {
            width: 200
          },
        }}>
        <MenuItem
          id="cy-download-item"
          disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS || (output.reference === undefined || !output.reference.length)}
          onClick={(event) => { if (this.props.job.status === constants.JOB_SUCCESS_STATUS && output.reference.length) window.open(output.reference, '_blank'); }}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText inset primary="Download" />
        </MenuItem>
        <MenuItem
          id="cy-publish-item"
          disabled={this.props.job.status !== constants.JOB_SUCCESS_STATUS}
          onClick={(event) => { if (this.props.job.status === constants.JOB_SUCCESS_STATUS) alert('TODO: Call Publish WPS'); }}>
          <ListItemIcon>
            <PublishIcon />
          </ListItemIcon>
          <ListItemText inset primary="Publish (TODO)" />
        </MenuItem>
        <MenuItem
          id="cy-persist-item"
          disabled={!this._isPersistAvailable(output)}
          onClick={(event) => { if(this._isPersistAvailable(output)) this.props.onShowPersistDialog(output); }}>
          <ListItemIcon>
            <PersistIcon />
          </ListItemIcon>
          <ListItemText inset primary="Persist" />
        </MenuItem>
        <MenuItem
          id="cy-visualize-item"
          disabled={!this._isVisualizeAvailable(output)}
          onClick={(event) => {if(this._isVisualizeAvailable(output)) this.props.onVisualiseDatasets([output.reference]); }}>
          <ListItemIcon>
            <VisualizeIcon />
          </ListItemIcon>
          <ListItemText inset primary="Visualize" />
        </MenuItem>
      </Menu>
    </ListItemSecondaryAction>
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
      return (
        <CollapseNestedList
          rootListItemClass={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}
          rootListItemStyle={{marginLeft: (this.props.indentationLevel * 18) + "px"}}
          rootListItemContent={
          <React.Fragment>
            <ListItemIcon>
              <ExpandableIcon />
            </ListItemIcon>
            <ListItemText inset
                          primary={(this.props.job.name && this.props.job.name.length)? this.props.job.name: `${this.props.job.title}: ${this.props.job.abstract}`}
                          secondary={secondaryText} />
          </React.Fragment>}>
            {this.buildMinimalSecondaryActions()}
          {
            this.props.job.outputs.map((output, k) => {
              return <ListItem
                className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel + 1}`}
                key={k}
                style={{marginLeft: ((this.props.indentationLevel + 1) * 18) + "px"}}>
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText inset
                              primary={(output.name && output.name.length) ? output.name : `${output.title}: ${output.abstract}`}
                              secondary={<div>File: {this.extractFileId(output.reference)} <br/>Type:<strong>{output.mimeType}</strong></div>} />
                {this.buildBasicSecondaryActions(output)}
              </ListItem>
            })
          }
        </CollapseNestedList>
      );
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

