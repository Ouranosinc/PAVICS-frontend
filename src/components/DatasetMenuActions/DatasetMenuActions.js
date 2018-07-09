import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ConfirmDialog from './../ConfirmDialog';
import DatasetListedDetails from './../DatasetListedDetails';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Download from '@material-ui/icons/FileDownload';
import Visualize from '@material-ui/icons/RemoveRedEye';
import Remove from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  root: {

  },
});


export class DatasetMenuActions extends React.Component {
  state = {
    anchor: null,
    detailsOpened: false,
    isConfirmDatasetRemoveDialogOpened: false,
    confirmDatasetRemoveDialogContent: '',
    confirmDatasetRemoveDialogResource: null,
    isConfirmFileRemoveDialogOpened: false,
    confirmFileRemoveDialogContent: '',
    confirmFileRemoveDialogResource: null
  };

  static defaultProps = {
    isFile: false,
    fileIndex: 0
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataset: PropTypes.object.isRequired,
    isFile: PropTypes.bool,
    isRemoveFromProjectEnabled: PropTypes.bool.isRequired,
    fileIndex: PropTypes.number,
    disabledVisualize: PropTypes.bool.isRequired,
    addDatasetsToVisualize: PropTypes.func.isRequired,
    selectCurrentDisplayedDataset: PropTypes.func.isRequired,
    datasetAPIActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  setFileAsAggregateArrayFields = (dataset, index) => {
    dataset['datetime_min'] = [dataset.datetime_min[index]];
    dataset['datetime_max'] = [dataset.datetime_max[index]];
    dataset['abstract'] = [dataset.abstract[index]];
    dataset['wms_url'] = [dataset.wms_url[index]];
    dataset['opendap_url'] = [dataset.opendap_url[index]];
    dataset['fileserver_url'] = [dataset.fileserver_url[index]];
    dataset['catalog_url'] = [dataset.catalog_url[index]];
    dataset['resourcename'] = [dataset.resourcename[index]];
    dataset['title'] = [dataset.title[index]];
    dataset['url'] = [dataset.url[index]];
    dataset['last_modified'] = [dataset.last_modified[index]];
    return dataset;
  };

  onVisualizeDataset = (event, aggregate = false, index = -1) => {
    this.onMenuClosed();
    if(aggregate) {
      let copy = JSON.parse(JSON.stringify(this.props.dataset));
      if(index > -1) {
        copy = this.setFileAsAggregateArrayFields(copy, index);
      }
      this.props.addDatasetsToVisualize([copy]);
      this.props.selectCurrentDisplayedDataset({
        ...copy,
        currentFileIndex: 0,
        opacity: 0.8
      });
    }else{
      // Split every file in independants datasets
      let splittedDatasets = [];
      this.props.dataset.wms_url.forEach((wmsUrl, index) => {
        let copy = JSON.parse(JSON.stringify(this.props.dataset));
        splittedDatasets.push(this.setFileAsAggregateArrayFields(copy, index));
      });
      this.props.addDatasetsToVisualize(splittedDatasets);
      this.props.selectCurrentDisplayedDataset({
        ...splittedDatasets[0],
        currentFileIndex: 0,
        opacity: 0.8
      });
    }
  };

  onOpenConfirmRemoveDatasetDialog = () => {
    this.onMenuClosed();
    this.setState({
      isConfirmDatasetRemoveDialogOpened: true,
      confirmDatasetRemoveDialogContent: `Do you really want to remove the dataset '${this.props.dataset.aggregate_title}' from the current project?`,
      confirmDatasetRemoveDialogResource: this.props.dataset
    });
  };

  onConfirmedDatasetRemove = () => {
    if (this.props.project.currentProject.id) {
      this.props.datasetAPIActions.deleteDataset({ projectId: this.props.project.currentProject.id, id: this.props.dataset.id });
      this.onCloseDialogDatasetRemove();
    }
  };

  onCloseDialogDatasetRemove = () => {
    this.setState({
      isConfirmDatasetRemoveDialogOpened: false,
      confirmDatasetRemoveDialogContent: '',
      confirmDatasetRemoveDialogResource: null
    });
  };

  onOpenConfirmRemoveFileDialog = () => {
    this.onMenuClosed();
    let cpy = JSON.parse(JSON.stringify(this.props.dataset));
    cpy.datetime_min.splice(this.props.fileIndex , 1);
    cpy.datetime_max.splice(this.props.fileIndex , 1);
    cpy.abstract.splice(this.props.fileIndex , 1);
    cpy.wms_url.splice(this.props.fileIndex , 1);
    cpy.opendap_url.splice(this.props.fileIndex , 1);
    cpy.fileserver_url.splice(this.props.fileIndex , 1);
    cpy.catalog_url.splice(this.props.fileIndex , 1);
    cpy.resourcename.splice(this.props.fileIndex , 1);
    cpy.title.splice(this.props.fileIndex , 1);
    cpy.url.splice(this.props.fileIndex , 1);
    cpy.last_modified.splice(this.props.fileIndex , 1);
    this.setState({
      isConfirmFileRemoveDialogOpened: true,
      confirmFileRemoveDialogContent: `Do you really want to remove the file '${this.props.dataset.title[this.props.fileIndex]}' from the dataset?`,
      confirmFileRemoveDialogResource: cpy
    });
  };

  onConfirmedFileRemove(dataset) {
    if (this.props.project.currentProject.id) {
      dataset.projectId = this.props.project.currentProject.id;
      this.props.datasetAPIActions.updateDataset(dataset);
      this.onCloseDialogFileRemove();
    }
  }

  onCloseDialogFileRemove() {
    this.setState({
      isConfirmFileRemoveDialogOpened: false,
      confirmFileRemoveDialogContent: '',
      confirmFileRemoveDialogResource: null
    });
  }

  onShowDetailsClicked = () => {
    this.onMenuClosed();
    this.setState({
      detailsOpened: true
    })
  };

  onDetailsModalClosed = () => {
    this.setState({
      detailsOpened: false
    })
  };

  onDownloadAllClicked = () => {
    this.onMenuClosed();
    this.props.dataset.fileserver_url.forEach((url) => {
      window.open(url, '_blank');
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

  makeAggregateMenuActions = () => {
    const { anchor } = this.state;
    return (<Menu
      id="dataset-menu-actions"
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={this.onMenuClosed}
      PaperProps={{
        style: {
          width: 200
        },
      }}>
      <MenuItem
        id="cy-info-details-item"
        onClick={(event) => this.onShowDetailsClicked(event)}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText inset
                      primary="Details" />
      </MenuItem>
      <MenuItem
        id="cy-visualize-all-agg-item"
        disabled={this.props.disabledVisualize}
        onClick={(event) => {
          if (!this.props.disabledVisualize) this.onVisualizeDataset(event, true);
        }}>
        <ListItemIcon>
          <Visualize />
        </ListItemIcon>
        <ListItemText inset
                      primary="Visualize All"
                      secondary="Aggregated" />
      </MenuItem>
      <MenuItem
        id="cy-visualize-all-split-item"
        disabled={this.props.disabledVisualize}
        onClick={(event) => {
          if (!this.props.disabledVisualize) this.onVisualizeDataset(event, false);
        }}>
        <ListItemIcon>
          <Visualize />
        </ListItemIcon>
        <ListItemText inset
                      primary="Visualize All"
                      secondary="Splitted" />
      </MenuItem>
      <MenuItem
        id="cy-download-all-item"
        onClick={(event) => this.onDownloadAllClicked()}>
        <ListItemIcon>
          <Download />
        </ListItemIcon>
        <ListItemText inset primary="Download All" />
      </MenuItem>
      { this.props.isRemoveFromProjectEnabled === true &&
        <MenuItem
          id="cy-remove-all-item"
          onClick={() => this.onOpenConfirmRemoveDatasetDialog()}>
          <ListItemIcon>
            <Remove />
          </ListItemIcon>
          <ListItemText inset primary="Remove"/>
        </MenuItem>
      }
    </Menu>);
  };

  makeFileAsAggregateMenuActions = () => {
    const { anchor } = this.state;
    return (<Menu
      id="dataset-menu-actions"
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={this.onMenuClosed}
      PaperProps={{
        style: {
          width: 200
        },
      }}>
      <MenuItem
        id="cy-info-details-item"
        onClick={(event) => this.onShowDetailsClicked(event)}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText inset
                      primary="Details" />
      </MenuItem>
      <MenuItem
        id="cy-visualize-item"
        disabled={this.props.disabledVisualize}
        onClick={(event) => {
          if (!this.props.disabledVisualize) this.onVisualizeDataset(event, true);
        }}>
        <ListItemIcon>
          <Visualize />
        </ListItemIcon>
        <ListItemText inset primary="Visualize" />
      </MenuItem>
      <MenuItem
        id="cy-download-item"
        onClick={(event) => this.onDownloadAllClicked()}>
        <ListItemIcon>
          <Download />
        </ListItemIcon>
        <ListItemText inset primary="Download" />
      </MenuItem>
      { this.props.isRemoveFromProjectEnabled === true &&
        <MenuItem
          id="cy-remove-item"
          onClick={() => this.onOpenConfirmRemoveDatasetDialog()}>
          <ListItemIcon>
            <Remove />
          </ListItemIcon>
          <ListItemText inset primary="Remove"/>
        </MenuItem>
      }
    </Menu>);
  };

  makeFileMenuActions = () => {
    const { anchor } = this.state;
    return (
      <Menu
        id="file-menu-actions"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={this.onMenuClosed}
        PaperProps={{
          style: {
            width: 200
          },
        }}>
        <MenuItem
          id="cy-visualize-item"
          disabled={this.props.disabledVisualize}
          onClick={(event) => {
            if (!this.props.disabledVisualize) this.onVisualizeDataset(event, true, this.props.fileIndex);
          }}>
          <ListItemIcon>
            <Visualize />
          </ListItemIcon>
          <ListItemText inset primary="Visualize" />
        </MenuItem>
        <MenuItem
          id="cy-download-item"
          onClick={(event) => window.open(this.props.dataset.fileserver_url[this.props.fileIndex], '_blank')}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText inset primary="Download" />
        </MenuItem>
        { this.props.isRemoveFromProjectEnabled === true &&
          <MenuItem
            id="cy-remove-item"
            onClick={() => {
              this.onOpenConfirmRemoveFileDialog(this.props.dataset, this.props.fileIndex)
            }}>
            <ListItemIcon>
              <Remove />
            </ListItemIcon>
            <ListItemText inset primary="Remove file"/>
          </MenuItem>
        }
      </Menu>
    );
  };

  render () {
    const { anchor } = this.state;
    const { classes } = this.props;

    return (
      <ListItemSecondaryAction className={classes.root}>
        <IconButton
          className="cy-actions-btn"
          aria-label="More"
          aria-owns={anchor ? 'dataset-menu-actions' : null}
          aria-haspopup="true"
          onClick={this.onMenuClicked}>
          <MoreVertIcon />
        </IconButton>
        {(this.props.isFile && this.props.isFile === true)?
          this.makeFileMenuActions():
          (this.props.dataset.type === "Aggregate")?
            this.makeAggregateMenuActions():
            // FileAsAggregate
            this.makeFileAsAggregateMenuActions()
        }
        <Modal
          open={this.state.detailsOpened}
          onClose={this.onDetailsModalClosed}>
          <DatasetListedDetails
            onCloseClicked={this.onDetailsModalClosed}
            dataset={this.props.dataset} />
        </Modal>
        <ConfirmDialog
          isOpen={this.state.isConfirmFileRemoveDialogOpened}
          affectedResource={this.state.confirmFileRemoveDialogResource}
          onDialogConfirmed={(dataset) => this.onConfirmedFileRemove(dataset)}
          onCloseDialog={() => this.onCloseDialogFileRemove()}
          dialogContent={this.state.confirmFileRemoveDialogContent}>
        </ConfirmDialog>
        <ConfirmDialog
          isOpen={this.state.isConfirmDatasetRemoveDialogOpened}
          affectedResource={this.state.confirmDatasetRemoveDialogResource}
          onDialogConfirmed={this.onConfirmedDatasetRemove}
          onCloseDialog={this.onCloseDialogDatasetRemove}
          dialogContent={this.state.confirmDatasetRemoveDialogContent}>
        </ConfirmDialog>
      </ListItemSecondaryAction>
    );
  }
}

export default withStyles(styles)(DatasetMenuActions);
