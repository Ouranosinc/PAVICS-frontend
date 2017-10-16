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

  _onVisualizeDataset (event, dataset, index) {
    let copy = JSON.parse(JSON.stringify(dataset));
    if (index) {
      copy['datetime_min'] = [dataset.datetime_min[index]];
      copy['datetime_max'] = [dataset.datetime_max[index]];
      copy['abstract'] = [dataset.abstract[index]];
      copy['wms_url'] = [dataset.wms_url[index]];
      copy['opendap_url'] = [dataset.opendap_url[index]];
      copy['fileserver_url'] = [dataset.fileserver_url[index]];
      copy['catalog_url'] = [dataset.catalog_url[index]];
      // TODO, do the same for 'title', 'last_modified', 'resourcename', etc. ??
    }
    this.props.addDatasetsToVisualize([copy]);
    this.props.selectCurrentDisplayedDataset({
      ...copy,
      opacity: 0.8
    });
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
              if (this.props.currentVisualizedDatasets.find(x => x.dataset_id === dataset.dataset_id)) {
                disabledDatasetVisualize = true;
              }
              if(dataset.type === "Aggregate") {
                return (
                  <ListItem
                    key={i}
                    primaryText={dataset.aggregate_title}
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack}}>{`${dataset.fileserver_url.length} Files`}</span><br />
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
                        <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.opendap_url[0], '_blank')} leftIcon={<Download />} />
                        <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + dataset.title[0])} leftIcon={<Remove />} />
                        <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + dataset.title[0])} leftIcon={<ShareIcon />} />
                        <MenuItem primaryText="Visualize All"
                                  disabled={disabledDatasetVisualize}
                                  onTouchTap={(event) => {
                                    this._onVisualizeDataset(event, dataset)
                                  }}
                                  leftIcon={<Visualize />} />
                      </IconMenu>
                    }
                    nestedItems={
                      dataset.wms_url.map((wmsUrl, j) => {
                        let nestedIcon = <File />;
                        let disabledNestedVisualize = false;
                        if (this.props.currentVisualizedDatasets.find(x => x.wms_url ===  wmsUrl)) {
                          nestedIcon = <Visualize />;
                          disabledNestedVisualize = true;
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
                                <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.opendap_url[j], '_blank')} leftIcon={<Download />} />
                                <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + dataset.title[j])} leftIcon={<Remove />} />
                                <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + dataset.title[j])} leftIcon={<ShareIcon />} />
                                <MenuItem primaryText="Visualize" disabled={disabledNestedVisualize} onTouchTap={(event) => {
                                  this._onVisualizeDataset(event, dataset, j)
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
                        <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.opendap_url[i], '_blank')} leftIcon={<Download />} />
                        <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + fileName)} leftIcon={<Remove />} />
                        <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + fileName)} leftIcon={<ShareIcon />} />
                        <MenuItem primaryText="Visualize" disabled={disabledVisualize} onTouchTap={(event) => {
                          this._onVisualizeDataset(event, dataset, i)
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
