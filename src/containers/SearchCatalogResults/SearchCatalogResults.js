import React from 'react';
import {connect} from 'react-redux';
import classes from './SearchCatalogResults.scss';
import * as constants from './../../constants';
import Loader from '../../components/Loader';
import { Button, Glyphicon } from 'react-bootstrap';

import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Download from 'material-ui/svg-icons/file/file-download';
import ShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';

export class SearchCatalogResults extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    closeDatasetDetails: React.PropTypes.func.isRequired,
    openDatasetDetails: React.PropTypes.func.isRequired,
    fetchDataset: React.PropTypes.func.isRequired,
    currentOpenedDataset: React.PropTypes.string.isRequired,
    esgfDatasets: React.PropTypes.object.isRequired
  }

  state = {
    open: false,
  };

  constructor (props) {
    super(props);
    this._onOpenDataset = this._onOpenDataset.bind(this);
    this._onSelectDataset = this._onSelectDataset.bind(this);
    this._onOpenPavicsDataset = this._onOpenPavicsDataset.bind(this);
    this._onAddPavicsDatasetToProject = this._onAddPavicsDatasetToProject.bind(this);
  }

  _onOpenDataset (id, url) {
    this.props.clickTogglePanel(constants.PANEL_DATASET_DETAILS, true);
    if (id === this.props.currentOpenedDataset) {
      this.props.closeDatasetDetails();
    } else {
      this.props.openDatasetDetails(id);
    }
    this.props.fetchDataset(url);
    // TODO: Fetch Dataset Detail following thredds url
    // TODO: Show Resource list (sub-datasets)
  }

  _onSelectDataset (id) {
  }

  _onOpenPavicsDataset (dataset) {
    // alert(dataset);
    this.props.openDatasetDetails(dataset.dataset_id);
  }

  _onAddPavicsDatasetToProject (dataset) {
    alert(dataset);
  }

  render () {
    // console.log("render SearchCatalogResults");
    let mainComponent;
    if (this.props.esgfDatasets.isFetching || this.props.pavicsDatasets.isFetching) {
      mainComponent = <Loader name="datasets" />;
    } else {
      if (this.props.pavicsDatasets.items.length) {
        mainComponent =
          <List>
            <Subheader inset={true}>Found <strong>{this.props.pavicsDatasets.items.length}</strong> results</Subheader>
            {this.props.pavicsDatasets.items.map((x, i) =>
              <ListItem
                leftCheckbox={<Checkbox />}
                tooltip="yolo"
                rightIconButton={
                  <IconMenu iconButtonElement={
                    <IconButton
                      touch={true}
                      tooltip={<div>
                        <strong>Dataset ID: </strong>{x.dataset_id}<br />
                        <strong>Subject: </strong>{x.subject}<br />
                        <strong>Category: </strong>{x.category}<br />
                        <strong>Experiment: </strong>{x.experiment}<br />
                        <strong>Variable: </strong>{x.variable.join(', ')}<br />
                        <strong>Project: </strong>{x.project}<br />
                        <strong>Institute: </strong>{x.institute}<br />
                        <strong>Model: </strong>{x.model}<br />
                        <strong>Units: </strong>{x.units.join(', ')}<br />
                        <strong>Frequency: </strong>{x.frequency}<br />
                        <strong>Content type: </strong>{x.content_type}<br />
                      </div>}
                      tooltipPosition="bottom-left">
                      <MoreVertIcon color={grey400} />
                      {/*<ActionInfo color={grey400} />*/}
                    </IconButton>}>
                  <MenuItem primaryText="Add to favorites (TODO)" leftIcon={<ShoppingCart />} />
                  <MenuItem primaryText="Share (TODO)" leftIcon={<PersonAdd />} />
                  <MenuItem primaryText="Download" leftIcon={<Download href={x.urls[0]} />} />
                </IconMenu>}
                primaryText={x.dataset_id}
                secondaryText={
                  <p>
                    <span style={{color: darkBlack}}>{x.variable_long_name[0]}</span><br />
                    <strong>Keywords: </strong>{x.keywords.join(', ')}
                  </p>
                }
                secondaryTextLines={2}
              />
            )}
          </List>;
      } else if (this.props.esgfDatasets.items.length) {
        mainComponent = <div className={classes['DatasetRow']} key={i + 1}>
          <div
            className={
              x.id === this.props.currentOpenedDataset
                ? classes['DatasetRowSelected']
                : classes['DatasetRowNotSelected']
            }>
            <a href="#" onClick={() => this._onOpenDataset(x.id, x.url[0])}
               className={classes['DatasetRowExpandButton']}>
              <i className="glyphicon glyphicon-folder-open" />
            </a>
            <a href="#" onClick={() => this._onOpenDataset(x.id, x.url[0])}
               className={classes['DatasetRowTitle']}> {x.id}</a>
            {/*<a href="#" onClick={() => this._onSelectDataset(x.id)} className={classes['DatasetRowSelectButton']}>
             <i className="glyphicon glyphicon-ok"></i>
             </a>*/}
            {x.id === this.props.currentOpenedDataset ? <div className={classes['DatasetRowDetails']}>
              <div>
                <small><strong>Number of files: </strong>{x.number_of_files}</small>
              </div>
              <div>
                <small><strong>Size: </strong>{x.size}</small>
              </div>
              <div>
                <small><strong>Number of aggregations: </strong>{ x.number_of_aggregations }</small>
              </div>
            </div> : null}
          </div>
        </div>
      } else {
        if (this.props.esgfDatasets.receivedAt) {
          mainComponent = <div>No results.</div>;
        } else {
          mainComponent = <div></div>;
        }
      }
    }
    return (
      <div className={classes['SearchCatalogResults']}>
        {mainComponent}
      </div>
    );
  }
}
export default SearchCatalogResults;
