import React from 'react';
import * as constants from './../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import {Alert} from 'react-bootstrap';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Download from 'material-ui/svg-icons/file/file-download';
import ShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add-box';

export class SearchCatalogResults extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    addDatasetsToProject: React.PropTypes.func.isRequired,
    closeDatasetDetails: React.PropTypes.func.isRequired,
    openDatasetDetails: React.PropTypes.func.isRequired,
    fetchDataset: React.PropTypes.func.isRequired,
    currentOpenedDataset: React.PropTypes.string.isRequired,
    esgfDatasets: React.PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this._onAddCheckedDatasetsToProject = this._onAddCheckedDatasetsToProject.bind(this);
    this._onCheckedDataset = this._onCheckedDataset.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
    this.state = {
      checkedDatasets: [],
      confirm: false,
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
  }

  _onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  }

  _onCheckedDataset (event) {
    let dataset = this.props.pavicsDatasets.items.find(x => x.dataset_id === event.target.value);
    let index = this.state.checkedDatasets.findIndex(x => x.dataset_id === event.target.value);
    let oldDatasets = this.state.checkedDatasets;
    if (dataset) {
      if (event.target.checked) {
        if (index === -1) {
          this.setState({
            checkedDatasets: oldDatasets.concat([dataset]),
            confirm: false
          });
        }
      } else {
        if (index > -1) {
          oldDatasets.splice(index, 1);
          this.setState({
            checkedDatasets: oldDatasets
          });
        }
        this.setState({
          confirm: false
        });
      }
    }
  }

  _onAddCheckedDatasetsToProject () {
    this.props.addDatasetsToProject(this.state.checkedDatasets);
    this.setState({
      checkedDatasets: [],
      confirm: true
    });
  }

  render () {
    // console.log("render SearchCatalogResults");
    let mainComponent;
    if (this.props.pavicsDatasets.isFetching) {
      mainComponent =
        <Paper style={{ marginTop: 20 }}>
          <Loader name="datasets" />
        </Paper>;
    } else {
      let archive = null;
      if (this.props.pavicsDatasets.archive) {
        archive =
          <Alert bsStyle="warning" style={{ margin: 20 }}>
            These are <strong>ARCHIVED</strong> results from a request made on {this.props.pavicsDatasets.requestedAt.toString()}
          </Alert>;
      }
      if (this.props.pavicsDatasets.items.length) {
        let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
        let paginated = this.props.pavicsDatasets.items.slice(start, start + this.state.numberPerPage);
        let confirmation = null;
        if (this.state.confirm) {
          confirmation =
            <Alert bsStyle="info" style={{marginTop: 20}}>
              Dataset(s) added to current project with success. Navigate to 'Experience Management' section to see selected dataset(s).
            </Alert>;
        }
        mainComponent =
          <div>
            <Paper style={{ marginTop: 20 }}>
              <List>
                {archive}
                <Subheader inset={true}>Found <strong>{this.props.pavicsDatasets.items.length}</strong> results</Subheader>
                {paginated.map((x, i) =>
                  <ListItem
                    key={i}
                    leftCheckbox={<Checkbox value={x.dataset_id} onCheck={this._onCheckedDataset} />}
                    primaryText={x.dataset_id}
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack}}>{x.variable_long_name[0]}</span><br />
                        <strong>Keywords: </strong>{x.keywords.join(', ')}
                      </p>
                    }
                    secondaryTextLines={2}
                    rightIconButton={
                      <IconMenu iconButtonElement={
                        <IconButton
                          touch={true}
                          tooltip={<div>
                            <strong>Dataset: </strong>{x.dataset_id}<br />
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
                        </IconButton>}>
                        <MenuItem primaryText="Add to favorites (TODO)" onTouchTap={(event) => alert('add to favorites')} leftIcon={<ShoppingCart />} />
                        <MenuItem primaryText="Share (TODO)" onTouchTap={(event) => alert('share')} leftIcon={<PersonAdd />} />
                        <MenuItem primaryText="Download (TODO?)" onTouchTap={(event) => alert('download')} leftIcon={<Download />} />
                      </IconMenu>
                    }
                  />
                )}
              </List>
              <Pagination
                total={this.props.pavicsDatasets.items.length}
                initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
                perPageOptions={constants.PER_PAGE_OPTIONS}
                onChange={this._onPageChanged} />
            </Paper>
            <RaisedButton
              disabled={!this.state.checkedDatasets.length}
              onClick={this._onAddCheckedDatasetsToProject}
              icon={<AddIcon />}
              label="Add selection(s)"
              style={{marginTop: '20px'}} />
            {confirmation}
          </div>;
      } else {
        if (this.props.pavicsDatasets.receivedAt) {
          mainComponent =
            <Paper style={{ marginTop: 20 }}>
              <List>
                {archive}
                <Subheader>No results found.</Subheader>
              </List>
            </Paper>;
        } else {
          mainComponent =
            <Paper style={{ marginTop: 20 }}>
              <List>
                <Subheader>Select at least one facet to launch dataset's search</Subheader>
              </List>
            </Paper>;
        }
      }
    }
    return (
      <div>
        {mainComponent}
      </div>
    );
  }
}
export default SearchCatalogResults;
