import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classes from './ExperienceManagement.scss';
import * as constants from './../../constants';
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
import AddedCriterias from 'material-ui/svg-icons/image/add-to-photos';
import Relaunch from 'material-ui/svg-icons/action/youtube-searched-for';
import Rename from 'material-ui/svg-icons/image/edit';
import Restore from 'material-ui/svg-icons/action/restore-page';
import ShareIcon from 'material-ui/svg-icons/social/person-add';

export class ExperienceManagement extends React.Component {
  static propTypes = {
    currentProjectDatasets: React.PropTypes.array.isRequired,
    currentProjectSearchCriterias: React.PropTypes.array.isRequired,
    currentVisualizedDatasetLayers: React.PropTypes.array.isRequired,
    addDatasetLayersToVisualize: React.PropTypes.func.isRequired,
    removeSearchCriteriasFromProject: React.PropTypes.func.isRequired,
    selectDatasetLayer: React.PropTypes.func.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    addFacetKeyValue: React.PropTypes.func.isRequired,
    removeAllFacetKeyValue: React.PropTypes.func.isRequired,
    fetchPavicsDatasets: React.PropTypes.func.isRequired,
    restorePavicsDatasets: React.PropTypes.func.isRequired,
    fetchResearcherProjects: React.PropTypes.func.isRequired
  };
  constructor (props) {
    super(props);
    props.fetchResearcherProjects(1);
    this._onVisualizeLayer = this._onVisualizeLayer.bind(this);
    this._onCriteriasPageChanged = this._onCriteriasPageChanged.bind(this);
    this._onDatasetsPageChanged = this._onDatasetsPageChanged.bind(this);
    this._onRelaunchSearch = this._onRelaunchSearch.bind(this);
    this._onRestoreSearchCriteria = this._onRestoreSearchCriteria.bind(this);
    this._onRemoveSearchCriteria = this._onRemoveSearchCriteria.bind(this);
    this.state = {
      open: false,
      datasetsPageNumber: 1,
      datasetsNumberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
      criteriasPageNumber: 1,
      criteriasNumberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
  }

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open
    });
  };

  _onCriteriasPageChanged (pageNumber, numberPerPage) {
    this.setState({
      criteriasPageNumber: pageNumber,
      criteriasNumberPerPage: numberPerPage
    });
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

  onReloadSearchCriteria (searchCriteria) {
    this.props.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
    this.props.removeAllFacetKeyValue();
    searchCriteria.criterias.forEach((criteria) => {
      this.props.addFacetKeyValue(criteria.key, criteria.value);
    });
  }

  _onRelaunchSearch (searchCriteria) {
    this.onReloadSearchCriteria(searchCriteria);
    this.props.fetchPavicsDatasets();
  }

  _onRestoreSearchCriteria (searchCriteria) {
    this.onReloadSearchCriteria(searchCriteria);
    this.props.restorePavicsDatasets(searchCriteria);
  }

  _onRemoveSearchCriteria (searchCriteria) {
    this.props.removeSearchCriteriasFromProject(searchCriteria);
  }

  render () {
    let datasetsStart = (this.state.datasetsPageNumber - 1) * this.state.datasetsNumberPerPage;
    let datasetsPaginated = this.props.currentProjectDatasets.slice(datasetsStart, datasetsStart + this.state.datasetsNumberPerPage);
    let criteriasStart = (this.state.criteriasPageNumber - 1) * this.state.criteriasNumberPerPage;
    let criteriasPaginated = this.props.currentProjectSearchCriterias.slice(criteriasStart, criteriasStart + this.state.criteriasNumberPerPage);
    return (
      <div className={classes['ExperienceManagement']} style={{ margin: 20 }}>
        <Paper>
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
            total={this.props.currentProjectDatasets.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={this._onDatasetsPageChanged} />
        </Paper>

        <Paper style={{marginTop: 20}}>
          <List>
            <Subheader>Manage search criteria(s)</Subheader>
            {criteriasPaginated.map((search, index) => {
              return (
                <ListItem
                  key={index}
                  primaryText={search.name}
                  secondaryText={
                    <p>
                      <span style={{color: darkBlack}}>{search.results.length} results on {search.date.toString()}</span><br />
                      <strong>Facets: </strong>
                      <span>
                        {
                          search.criterias.map((criteria, i) => {
                            return <span key={i}>{criteria.key + '=' + criteria.value + ((i + 1 === search.criterias.length) ? '' : ', ')}</span>;
                          })
                        }
                      </span>
                    </p>
                  }
                  secondaryTextLines={2}
                  leftIcon={<AddedCriterias />}
                  rightIconButton={
                    <IconMenu iconButtonElement={
                      <IconButton
                        touch={true}
                        tooltip="Actions"
                        tooltipPosition="bottom-left">
                        <MoreVertIcon color={grey400} />
                      </IconButton>}>
                      <MenuItem primaryText="Rename (TODO)" onTouchTap={(event) => alert('rename ' + search.name)} leftIcon={<Rename />} />
                      <MenuItem primaryText="Restore results" onTouchTap={(event) => this._onRestoreSearchCriteria(search)} leftIcon={<Restore />} />
                      <MenuItem primaryText="Relaunch search" onTouchTap={(event) => this._onRelaunchSearch(search)} leftIcon={<Relaunch />} />
                      <MenuItem primaryText="Remove" onTouchTap={(event) => this._onRemoveSearchCriteria(search)} leftIcon={<Remove />} />
                    </IconMenu>
                  }
                />
              );
            })}
          </List>
          <Pagination
            total={this.props.currentProjectSearchCriterias.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={this._onCriteriasPageChanged} />
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}
const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperienceManagement);
