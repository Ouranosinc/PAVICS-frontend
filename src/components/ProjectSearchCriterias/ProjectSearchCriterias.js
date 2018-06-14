import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import classes from './ProjectSearchCriterias.scss';
import * as constants from '../../constants';
import Pagination from './../../components/Pagination';
import {List, ListItem} from'@material-ui/core/List';
import ListSubheader from'@material-ui/core/ListSubheader';
import Paper from'@material-ui/core/Paper';
// import IconMenu from'@material-ui/core/IconMenu';
import MenuItem from'@material-ui/core/MenuItem';
import IconButton from'@material-ui/core/IconButton';
import Remove from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddedCriterias from '@material-ui/icons/AddToPhotos';
import Relaunch from '@material-ui/icons/YoutubeSearchedFor';
import Restore from '@material-ui/icons/RestorePage';

export class ProjectSearchCriterias extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this._onCriteriasPageChanged = this._onCriteriasPageChanged.bind(this);
    this._onRelaunchSearch = this._onRelaunchSearch.bind(this);
    this._onRestoreSearchCriteria = this._onRestoreSearchCriteria.bind(this);
    this._onRemoveSearchCriteria = this._onRemoveSearchCriteria.bind(this);
    this.state = {
      criteriasPageNumber: 1,
      criteriasNumberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.project.currentProject && nextProps.project.currentProject !== this.props.project.currentProject) {
      this.props.researchAPIActions.fetchResearchs({ projectId: this.props.project.currentProject.id});
    }
  }

  componentWillMount() {
    if (this.props.project.currentProject.id) {
      this.props.researchAPIActions.fetchResearchs({ projectId: this.props.project.currentProject.id});
    }
  }

  _onCriteriasPageChanged (pageNumber, numberPerPage) {
    this.setState({
      criteriasPageNumber: pageNumber,
      criteriasNumberPerPage: numberPerPage
    });
  }

  onReloadSearchCriteria (research) {
    this.props.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
    this.props.researchActions.clearFacetKeyValuePairs();
    research.facets.forEach((facet) => {
      this.props.researchActions.addFacetKeyValuePair(facet.key, facet.value);
    });
  }

  _onRelaunchSearch (research) {
    this.onReloadSearchCriteria(research);
    this.props.researchActions.fetchPavicsDatasetsAndFacets();
  }

  _onRestoreSearchCriteria (research) {
    this.onReloadSearchCriteria(research);
    this.props.researchActions.restorePavicsDatasets(research);
    NotificationManager.warning(`These are ARCHIVED results from a request made on ${moment(research.createdOn).format(constants.PAVICS_DATE_FORMAT)}`, 'Warning', 10000);
  }

  _onRemoveSearchCriteria (research) {
    if (this.props.project.currentProject.id) {
      this.props.researchAPIActions.deleteResearch({projectId: this.props.project.currentProject.id, id: research.id});
    }
  }

  render () {
    let criteriasStart = (this.state.criteriasPageNumber - 1) * this.state.criteriasNumberPerPage;
    let criteriasPaginated = this.props.researchAPI.items.slice(criteriasStart, criteriasStart + this.state.criteriasNumberPerPage);
    return (
      <div id="cy-project-search-criterias" className={classes['ProjectSearchCriterias']}>
        <Paper style={{marginTop: 20}}>
          <List>
            <ListSubheader>Manage search criteria(s)</ListSubheader>
            {criteriasPaginated.map((research, index) => {
              return (
                <ListItem
                  className="cy-project-search-criterias-item"
                  key={index}
                  primaryText={research.name}
                  secondaryText={
                    <p>
                      <span>{research.results.length} results on {moment(research.createdOn).format(constants.PAVICS_DATE_FORMAT)}</span><br />
                      <strong>Facets: </strong>
                      <span>
                        {
                          research.facets.map((criteria, i) => {
                            return <span key={i}>{criteria.key + '=' + criteria.value + ((i + 1 === research.facets.length) ? '' : ', ')}</span>;
                          })
                        }
                      </span>
                    </p>
                  }
                  secondaryTextLines={2}
                  leftIcon={<AddedCriterias />}
                  /*rightIconButton={
                    <IconMenu iconButtonElement={
                      <IconButton
                        className="cy-actions-btn"
                        touch={true}
                        tooltip="Actions"
                        tooltipPosition="bottom-left">
                        <MoreVertIcon />
                      </IconButton>}>
                      <MenuItem id="cy-restore-item" primaryText="Restore results" onTouchTap={(event) => this._onRestoreSearchCriteria(research)} leftIcon={<Restore />} />
                      <MenuItem id="cy-relaunch-item" primaryText="Relaunch search" onTouchTap={(event) => this._onRelaunchSearch(research)} leftIcon={<Relaunch />} />
                      <MenuItem id="cy-remove-item" primaryText="Remove" onTouchTap={(event) => this._onRemoveSearchCriteria(research)} leftIcon={<Remove />} />
                    </IconMenu>
                  }*/
                />
              );
            })}
          </List>
          <Pagination
            total={this.props.researchAPI.items.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={this._onCriteriasPageChanged} />
        </Paper>
      </div>
    )
  }
}

export default ProjectSearchCriterias
