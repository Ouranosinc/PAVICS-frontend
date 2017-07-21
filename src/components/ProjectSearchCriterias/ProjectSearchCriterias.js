import React from 'react';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import classes from './ProjectSearchCriterias.scss';
import * as constants from '../../constants';
import Pagination from './../../components/Pagination';
import {List, ListItem} from 'material-ui/List';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Remove from 'material-ui/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddedCriterias from 'material-ui/svg-icons/image/add-to-photos';
import Relaunch from 'material-ui/svg-icons/action/youtube-searched-for';
import Rename from 'material-ui/svg-icons/image/edit';
import Restore from 'material-ui/svg-icons/action/restore-page';

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
      let filter = JSON.stringify({where: { projectId: this.props.project.currentProject.id}});
      this.props.researchAPIActions.fetchResearchs({filter: filter});
      this.props.projectAPIActions.fetchProjectResearchs({ projectId: nextProps.project.currentProject.id});
    }
  }

  componentWillMount() {
    let filter = JSON.stringify({where: { projectId: this.props.project.currentProject.id}});
    this.props.researchAPIActions.fetchResearchs({filter: filter});
    this.props.projectAPIActions.fetchProjectResearchs({ projectId: this.props.project.currentProject.id});
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
    this.props.researchActions.fetchPavicsDatasets();
  }

  _onRestoreSearchCriteria (research) {
    this.onReloadSearchCriteria(research);
    this.props.researchActions.restorePavicsDatasets(research);
    NotificationManager.warning(`These are ARCHIVED results from a request made on ${moment(research.createdOn).format(constants.PAVICS_DATE_FORMAT)}`);
  }

  _onRemoveSearchCriteria (research) {
    this.props.researchAPIActions.deleteResearch({id: research.id});
  }

  render () {
    let criteriasStart = (this.state.criteriasPageNumber - 1) * this.state.criteriasNumberPerPage;
    let criteriasPaginated = this.props.researchAPI.items.slice(criteriasStart, criteriasStart + this.state.criteriasNumberPerPage);
    return (
      <div className={classes['ProjectSearchCriterias']}>
        <Paper style={{marginTop: 20}}>
          <List>
            <Subheader>Manage search criteria(s)</Subheader>
            {criteriasPaginated.map((research, index) => {
              return (
                <ListItem
                  key={index}
                  primaryText={research.name}
                  secondaryText={
                    <p>
                      <span style={{color: darkBlack}}>{research.results.length} results on {moment(research.createdOn).format(constants.PAVICS_DATE_FORMAT)}</span><br />
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
                  rightIconButton={
                    <IconMenu iconButtonElement={
                      <IconButton
                        touch={true}
                        tooltip="Actions"
                        tooltipPosition="bottom-left">
                        <MoreVertIcon color={grey400} />
                      </IconButton>}>
                      <MenuItem primaryText="Rename (TODO)" onTouchTap={(event) => alert('rename ' + research.name)} leftIcon={<Rename />} />
                      <MenuItem primaryText="Restore results" onTouchTap={(event) => this._onRestoreSearchCriteria(research)} leftIcon={<Restore />} />
                      <MenuItem primaryText="Relaunch search" onTouchTap={(event) => this._onRelaunchSearch(research)} leftIcon={<Relaunch />} />
                      <MenuItem primaryText="Remove" onTouchTap={(event) => this._onRemoveSearchCriteria(research)} leftIcon={<Remove />} />
                    </IconMenu>
                  }
                />
              );
            })}
          </List>
          <Pagination
            total={this.props.projectAPI.researchs.items.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={this._onCriteriasPageChanged} />
        </Paper>
      </div>
    )
  }
}

export default ProjectSearchCriterias
