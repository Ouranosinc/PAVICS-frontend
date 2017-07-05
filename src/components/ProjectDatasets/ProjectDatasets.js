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

export class ProjectDatasets extends React.Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    projectActions: React.PropTypes.object.isRequired,
    projectAPI: React.PropTypes.object.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this._onVisualizeLayer = this._onVisualizeLayer.bind(this);
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

  _onVisualizeLayer (event, dataset, currentWmsUrl, i) {
    dataset['wms_url'] = currentWmsUrl;
    dataset['currentWmsIndex'] = i;
    this.props.addDatasetLayersToVisualize([dataset]);
    this.props.selectDatasetLayer({
      ...dataset,
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
              if (this.props.currentVisualizedDatasetLayers.find(x => x.dataset_id === dataset.dataset_id)) {
                folderIcon = <FolderSpecial />;
              }
              return (
                <ListItem
                  key={i}
                  primaryText={dataset.dataset_id}
                  secondaryText={
                    <p>
                      <span style={{color: darkBlack}}>{dataset.variable_long_name[0]}</span><br />
                      <strong>Keywords: </strong>{dataset.keywords.join(', ')}
                    </p>
                  }
                  secondaryTextLines={2}
                  leftIcon={folderIcon}
                  initiallyOpen={false}
                  primaryTogglesNestedList={false}
                  nestedItems={
                    dataset.wms_urls.map((wmsUrl, j) => {
                      let text = '/';
                      let fileName = wmsUrl.substr(wmsUrl.lastIndexOf(text) + text.length);
                      let nestedIcon = <File />;
                      let disabledNestedVisualize = false;
                      if (this.props.currentVisualizedDatasetLayers.find(x => x.wms_url ===  wmsUrl)) {
                        nestedIcon = <Visualize />;
                        disabledNestedVisualize = true;
                      }
                      return (
                        <ListItem
                          style={{width: '98%'}}
                          key={j}
                          primaryText={fileName}
                          leftIcon={nestedIcon}
                          rightIconButton={
                            <IconMenu iconButtonElement={
                              <IconButton
                                touch={true}
                                tooltip="Actions"
                                tooltipPosition="bottom-left">
                                <MoreVertIcon color={grey400} />
                              </IconButton>}>
                              <MenuItem primaryText="Visualize" disabled={disabledNestedVisualize} onTouchTap={(event) => {
                                this._onVisualizeLayer(event, dataset, wmsUrl, j)
                              }} leftIcon={<Visualize />} />
                              <MenuItem primaryText="Download" onTouchTap={(event) => window.open(dataset.opendap_urls[i], '_blank')} leftIcon={<Download />} />
                              <MenuItem primaryText="Remove (TODO)" onTouchTap={(event) => alert('remove ' + fileName)} leftIcon={<Remove />} />
                              <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share ' + fileName)} leftIcon={<ShareIcon />} />
                            </IconMenu>
                          }
                        />
                      );
                    })
                  }
                />
              );
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
