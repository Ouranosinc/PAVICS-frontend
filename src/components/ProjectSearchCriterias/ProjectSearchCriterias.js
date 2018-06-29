import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import Pagination from './../../components/Pagination';
import List from'@material-ui/core/List';
import ListItem from'@material-ui/core/ListItem';
import ListSubheader from'@material-ui/core/ListSubheader';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from'@material-ui/core/Paper';
import MenuItem from'@material-ui/core/MenuItem';
import Remove from '@material-ui/icons/Delete';
import CustomIconMenu from '../CustomIconMenu';
import AddedCriterias from '@material-ui/icons/AddToPhotos';
import Relaunch from '@material-ui/icons/YoutubeSearchedFor';
import Restore from '@material-ui/icons/RestorePage';

const styles = theme => ({
  ProjectSearchCriterias: {

  },
});

export class ProjectSearchCriterias extends React.Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
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

  onCriteriasPageChanged = (pageNumber, numberPerPage) => {
    this.setState({
      criteriasPageNumber: pageNumber,
      criteriasNumberPerPage: numberPerPage
    });
  };

  onReloadSearchCriteria = research => {
    this.props.goToSection(constants.PLATFORM_SECTION_SEARCH_DATASETS);
    this.props.researchActions.clearFacetKeyValuePairs();
    research.facets.forEach((facet) => {
      this.props.researchActions.addFacetKeyValuePair(facet.key, facet.value);
    });
  };

  onRelaunchSearch = research => {
    this.onReloadSearchCriteria(research);
    this.props.researchActions.fetchPavicsDatasetsAndFacets();
  };

  onRestoreSearchCriteria = research => {
    this.onReloadSearchCriteria(research);
    this.props.researchActions.restorePavicsDatasets(research);
    NotificationManager.warning(`These are ARCHIVED results from a request made on ${moment(research.createdOn).format(constants.PAVICS_DATE_FORMAT)}`, 'Warning', 10000);
  };

  onRemoveSearchCriteria = research => {
    if (this.props.project.currentProject.id) {
      this.props.researchAPIActions.deleteResearch({projectId: this.props.project.currentProject.id, id: research.id});
    }
  }

  render () {
    const { classes } = this.props;
    let criteriasStart = (this.state.criteriasPageNumber - 1) * this.state.criteriasNumberPerPage;
    let criteriasPaginated = this.props.researchAPI.items.slice(criteriasStart, criteriasStart + this.state.criteriasNumberPerPage);
    return (
      <div id="cy-project-search-criterias">
        <Paper style={{marginTop: 20}}>
          <List>
            <ListSubheader>Project search criteria(s)</ListSubheader>
            {criteriasPaginated.map((research, index) => {
              return (
                <ListItem
                  className="cy-project-search-criterias-item"
                  key={index}>
                  <ListItemIcon>
                    <AddedCriterias />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    primaryText={research.name}
                    secondary={
                        <div>
                      <span>{research.results.length} results on {moment(research.createdOn).format(constants.PAVICS_DATE_FORMAT)}</span><br />
                      <strong>Facets: </strong>
                      <span>
                          {
                            research.facets.map((criteria, i) => {
                              return <span key={i}>{criteria.key + '=' + criteria.value + ((i + 1 === research.facets.length) ? '' : ', ')}</span>;
                            })
                          }
                        </span>
                    </div>
                    } />
                  <ListItemSecondaryAction className={classes.root}>
                    <CustomIconMenu
                      iconButtonClass="cy-actions-btn"
                      menuId="criterias-menu-actions"
                      menuItems={[
                        <MenuItem
                          id="cy-restore-item"
                          onClick={(event) => this.onRestoreSearchCriteria()}>
                          <ListItemIcon>
                            <Restore />
                          </ListItemIcon>
                          <ListItemText inset primary="Restore results"/>
                        </MenuItem>,
                        <MenuItem
                          id="cy-relaunch-item"
                          onClick={(event) => this.onRelaunchSearch()}>
                          <ListItemIcon>
                            <Relaunch />
                          </ListItemIcon>
                          <ListItemText inset primary="Relaunch search"/>
                        </MenuItem>,
                        <MenuItem
                          id="cy-remove-item"
                          onClick={(event) => this.onRemoveSearchCriteria()}>
                          <ListItemIcon>
                            <Remove />
                          </ListItemIcon>
                          <ListItemText inset primary="Remove"/>
                        </MenuItem>
                      ]} />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
          <Pagination
            total={this.props.researchAPI.items.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={this.onCriteriasPageChanged} />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ProjectSearchCriterias)
