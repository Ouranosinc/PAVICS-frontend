import React from 'react';
import PropTypes from 'prop-types';
import * as constants from '../../constants';
import ListItem from'@material-ui/core/ListItem';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from'@material-ui/core/MenuItem';
import PublishIcon from '@material-ui/icons/Public';
import VisualizeIcon from '@material-ui/icons/RemoveRedEye';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import DownloadIcon from '@material-ui/icons/FileDownload';
import PersistIcon from '@material-ui/icons/Save';
import CustomIconMenu from '../CustomIconMenu';

export class ProcessOutputListItem extends React.Component {
  static propTypes = {
    indentationLevel:  PropTypes.number,
    job: PropTypes.object.isRequired,
    output: PropTypes.object.isRequired,
    onShowPersistDialog: PropTypes.func.isRequired,
    onVisualizeOutput: PropTypes.func.isRequired,
  };

  isDownloadAvailable = () => {
    return this.props.job.status === constants.JOB_SUCCESS_STATUS && this.props.output.reference && this.props.output.reference.length;
  };

  isPersistAvailable = () => {
    return (this.props.job.status === constants.JOB_SUCCESS_STATUS && this.props.output.mimeType === 'application/x-netcdf');
  };

  isPublishAvailable = () => {
    return this.props.job.status === constants.JOB_SUCCESS_STATUS
  };

  isVisualizeAvailable = () => {
    return (this.props.job.status === constants.JOB_SUCCESS_STATUS && this.props.output.mimeType === 'application/x-netcdf');
  };

  onDownloadClicked = () => {
    if (this.isDownloadAvailable()) {
      window.open(this.props.output.reference, '_blank');
      this.customIconMenu.onMenuClosed()
    }
  };

  onPublishClicked = () => {
    if (this.isPublishAvailable()) {
      alert('TODO: Call Publish WPS');
      this.customIconMenu.onMenuClosed()
    }
  };

  onPersistClicked = () => {
    if (this.isPersistAvailable()) {
      this.props.onShowPersistDialog(this.props.output);
      this.customIconMenu.onMenuClosed();
    }
  };

  onVisualizeClicked = () => {
    if (this.isVisualizeAvailable()) {
      this.props.onVisualizeOutput([this.props.output.reference], false);
      this.customIconMenu.onMenuClosed();
    }
  };

  render () {
    return (
      <ListItem
        className={`cy-monitoring-list-item cy-monitoring-level-${this.props.indentationLevel}`}
        style={{marginLeft: (this.props.indentationLevel * 18) + "px"}}>
        <ListItemIcon>
          <FileIcon />
        </ListItemIcon>
        <ListItemText inset
                      primary={(this.props.output.name && this.props.output.name.length) ? this.props.output.name : `${this.props.output.title}: ${this.props.output.abstract}`}
                      secondary={<span>File: {this.props.extractFileId(this.props.output.reference)} <br/>Type:<strong>{this.props.output.mimeType}</strong></span>} />
        <ListItemSecondaryAction
          className={`cy-monitoring-sec-actions cy-monitoring-level-${this.props.indentationLevel}`}>
          <CustomIconMenu
            onRef={ref => (this.customIconMenu = ref)}
            iconButtonClass="cy-actions-btn"
            menuId="output-menu-actions"
            menuItems={[
              <MenuItem
                id="cy-download-item"
                disabled={!this.isDownloadAvailable()}
                onClick={(event) => this.onDownloadClicked()}>
                <ListItemIcon>
                  <DownloadIcon />
                </ListItemIcon>
                <ListItemText inset primary="Download"/>
              </MenuItem>,
              <MenuItem
                id="cy-publish-item"
                disabled={!this.isPublishAvailable()}
                onClick={(event) => this.onPublishClicked()}>
                <ListItemIcon>
                  <PublishIcon />
                </ListItemIcon>
                <ListItemText inset primary="Publish (TODO)"/>
              </MenuItem>,
              <MenuItem
                id="cy-persist-item"
                disabled={!this.isPersistAvailable()}
                onClick={(event) => this.onPersistClicked()}>
                <ListItemIcon>
                  <PersistIcon />
                </ListItemIcon>
                <ListItemText inset primary="Persist"/>
              </MenuItem>,
              <MenuItem
                id="cy-visualize-item"
                disabled={!this.isVisualizeAvailable()}
                onClick={(event) => this.onVisualizeClicked()}>
                <ListItemIcon>
                  <VisualizeIcon />
                </ListItemIcon>
                <ListItemText inset primary="Visualize"/>
              </MenuItem>
            ]} />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}
export default ProcessOutputListItem;

