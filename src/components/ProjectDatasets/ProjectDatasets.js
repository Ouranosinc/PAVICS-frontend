import React from 'react'
import classes from './ProjectDatasets.scss';
import * as constants from '../../constants';
import Pagination from './../../components/Pagination';
import {List, ListItem} from 'material-ui/List';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Download from 'material-ui/svg-icons/file/file-download';
import Visualize from 'material-ui/svg-icons/image/remove-red-eye';
import Remove from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Folder from 'material-ui/svg-icons/file/folder';
import FolderSpecial from 'material-ui/svg-icons/notification/folder-special';
import File from 'material-ui/svg-icons/editor/insert-drive-file';
import ShareIcon from 'material-ui/svg-icons/social/person-add';
import ExpandableIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

export class ProjectDatasets extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this._onVisualizeDataset = this._onVisualizeDataset.bind(this);
    this._onDatasetsPageChanged = this._onDatasetsPageChanged.bind(this);
    this.state = {
      datasetsPageNumber: 1,
      datasetsNumberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.project.currentProject && nextProps.project.currentProject !== this.props.project.currentProject) {
      this.props.projectAPIActions.fetchProjectDatasets({ projectId: nextProps.project.currentProject.id});
    }
  }

  componentWillMount() {
    this.props.projectAPIActions.fetchProjectDatasets({ projectId: this.props.project.currentProject.id});
  }

  _onDatasetsPageChanged (pageNumber, numberPerPage) {
    this.setState({
      datasetsPageNumber: pageNumber,
      datasetsNumberPerPage: numberPerPage
    });
  }

  setFileAsAggregateArrayFields(dataset, index) {
    dataset['datetime_min'] = [dataset.datetime_min[index]];
    dataset['datetime_max'] = [dataset.datetime_max[index]];
    dataset['abstract'] = [dataset.abstract[index]];
    dataset['wms_url'] = [dataset.wms_url[index]];
    dataset['opendap_url'] = [dataset.opendap_url[index]];
    dataset['fileserver_url'] = [dataset.fileserver_url[index]];
    dataset['catalog_url'] = [dataset.catalog_url[index]];
    // TODO, do the same for 'title', 'last_modified', 'resourcename', etc. ??
    return dataset;
  }

  _onVisualizeDataset (event, dataset, aggregate = false, index = -1) {
    if(aggregate) {
      let copy = JSON.parse(JSON.stringify(dataset));
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
      dataset.wms_url.forEach((wmsUrl, index) => {
        let copy = JSON.parse(JSON.stringify(dataset));
        splittedDatasets.push(this.setFileAsAggregateArrayFields(copy, index));
      });
      this.props.addDatasetsToVisualize(splittedDatasets);
      this.props.selectCurrentDisplayedDataset({
        ...splittedDatasets[0],
        currentFileIndex: 0,
        opacity: 0.8
      });
    }
  }

  render () {
    let datasetsStart = (this.state.datasetsPageNumber - 1) * this.state.datasetsNumberPerPage;
    let datasetsPaginated = this.props.projectAPI.datasets.items.slice(datasetsStart, datasetsStart + this.state.datasetsNumberPerPage);
    return (
      <div className={classes['ProjectDatasets']}>
        <Paper style={{marginTop: 20}}>
          <List>
            <Subheader>Current project dataset(s)</Subheader>
            {datasetsPaginated.map((dataset, i) => {
              let folderIcon = <Folder />;
              if (this.props.currentVisualizedDatasets.find(x => x.dataset_id === dataset.dataset_id)) {
                folderIcon = <FolderSpecial />;
              }
              let disabledDatasetVisualize = false;
              // let found = this.props.currentVisualizedDatasets.find(x => x.dataset_id === dataset.dataset_id);
              // if (found && found.wms_url.length === dataset.wms_url.length) {
              //   disabledDatasetVisualize = true;
              // }
              if(dataset.type === "Aggregate") {
                return (
                  <ListItem
                    key={i}
                    primaryText={dataset.aggregate_title}
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack}}>{dataset.fileserver_url.length + ' Files'}</span><br />
                        <strong>Keywords: </strong>{dataset.keywords.join(', ')}
                      </p>
                    }
                    secondaryTextLines={2}
                    leftIcon={folderIcon}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    autoGenerateNestedIndicator={false}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltip="Actions"
                          tooltipPosition="bottom-left">
                          <MoreVertIcon color={grey400} />
                        </IconButton>}>
                        <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.fileserver_url[0], '_blank')} leftIcon={<Download />} />
                        <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + dataset.title[0])} leftIcon={<Remove />} />
                        <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + dataset.title[0])} leftIcon={<ShareIcon />} />
                        <MenuItem primaryText="Visualize All (Aggregated)"
                                  disabled={disabledDatasetVisualize}
                                  onTouchTap={(event) => {
                                    if (!disabledDatasetVisualize) this._onVisualizeDataset(event, dataset, true);
                                  }}
                                  leftIcon={<Visualize />} />
                        <MenuItem primaryText="Visualize All (Splitted)"
                                  disabled={disabledDatasetVisualize}
                                  onTouchTap={(event) => {
                                    if (!disabledDatasetVisualize) this._onVisualizeDataset(event, dataset, false);
                                  }}
                                  leftIcon={<Visualize />} />
                      </IconMenu>
                    }
                    nestedItems={
                      dataset.wms_url.map((wmsUrl, j) => {
                        let nestedIcon = <File />;
                        let disabledNestedVisualize = false;
                        let founds = this.props.currentVisualizedDatasets.filter(x => x.wms_url.indexOf(wmsUrl) > -1);
                        if (founds && founds.length) {
                          nestedIcon = <Visualize />;
                        }
                        return (
                          <ListItem
                            style={{width: '98%'}}
                            key={j}
                            primaryText={dataset.title[j]}
                            leftIcon={nestedIcon}
                            rightIconButton={
                              <IconMenu
                                menuStyle={{marginRight: '100px'}}
                                iconButtonElement={
                                  <IconButton
                                    touch={true}
                                    tooltip="Actions"
                                    tooltipPosition="bottom-left">
                                    <MoreVertIcon color={grey400} />
                                  </IconButton>}>
                                <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.fileserver_url[j], '_blank')} leftIcon={<Download />} />
                                <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + dataset.title[j])} leftIcon={<Remove />} />
                                <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + dataset.title[j])} leftIcon={<ShareIcon />} />
                                <MenuItem primaryText="Visualize" disabled={disabledNestedVisualize} onTouchTap={(event) => {
                                  if (!disabledNestedVisualize) this._onVisualizeDataset(event, dataset, true, j);
                                }} leftIcon={<Visualize />} />
                              </IconMenu>
                            }
                          />
                        );
                      })
                    }
                  />
                );
              }else {
                // FileAsAggregate
                let disabledVisualize = false;
                let fileIcon = <File />;
                if (this.props.currentVisualizedDatasets.find(x => x.dataset_id === dataset.dataset_id)) {
                  fileIcon = <Visualize />;
                  disabledVisualize = true;
                }
                return(
                  <ListItem
                    key={i}
                    primaryText={dataset.aggregate_title}
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack}}>{dataset.title[0]}</span><br />
                        <strong>Keywords: </strong>{dataset.keywords.join(', ')}
                      </p>
                    }
                    secondaryTextLines={2}
                    leftIcon={fileIcon}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    autoGenerateNestedIndicator={false}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltip="Actions"
                          tooltipPosition="bottom-left">
                          <MoreVertIcon color={grey400} />
                        </IconButton>}>
                        <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.fileserver_url[0], '_blank')} leftIcon={<Download />} />
                        <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + dataset.title[0])} leftIcon={<Remove />} />
                        <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + dataset.title[0])} leftIcon={<ShareIcon />} />
                        <MenuItem primaryText="Visualize" disabled={disabledVisualize} onTouchTap={(event) => {
                          if (!disabledVisualize) this._onVisualizeDataset(event, dataset, true, 0)
                        }} leftIcon={<Visualize />} />
                      </IconMenu>
                    }
                  />
                );
              }

            })}
          </List>
          <Pagination
            total={this.props.projectAPI.datasets.items.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={this._onDatasetsPageChanged} />
        </Paper>
      </div>
    )
  }
}

export default ProjectDatasets
