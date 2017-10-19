import React from 'react';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import {Alert} from 'react-bootstrap';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui/svg-icons/action/info';
import RaisedButton from 'material-ui/RaisedButton';
import AddIcon from 'material-ui/svg-icons/content/add-box';

export class SearchCatalogResults extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    projectAPIActions: React.PropTypes.object.isRequired,
    research: React.PropTypes.object.isRequired
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
    let dataset = this.props.research.pavicsDatasets.items.find(x => x.dataset_id === event.target.value);
    let index = this.state.checkedDatasets.findIndex(x => x.dataset_id === event.target.value);
    let oldDatasets = this.state.checkedDatasets;
    if (dataset) {
      if (event.target.checked) {
        if (index === -1) {
          this.setState({
            checkedDatasets: oldDatasets.concat([dataset])
          });
        }
      } else {
        if (index > -1) {
          oldDatasets.splice(index, 1);
          this.setState({
            checkedDatasets: oldDatasets
          });
        }
      }
    }
  }

  _onAddCheckedDatasetsToProject () {
    this.state.checkedDatasets.forEach((dataset) => {
      // TODO validate dataset_id unicity
      dataset.projectId = this.props.project.currentProject.id;
      dataset.datetime_max = dataset.datetime_max.map(x => x.toString()); // TODOD Remove this
      dataset.datetime_min = dataset.datetime_min.map(x => x.toString()); // TODOD Remove this
      delete dataset.id; // Loopback fails this
      this.props.projectAPIActions.createProjectDatasets(dataset);
    });
    this.setState({
      checkedDatasets: []
    });
    NotificationManager.success("Dataset(s) added to current project with success. Navigate to 'Project Management' section to see selected dataset(s).");
  }

  render () {
    // console.log("render SearchCatalogResults");
    let mainComponent;
    if (this.props.research.pavicsDatasets.isFetching) {
      mainComponent =
        <Paper style={{ marginTop: 20 }}>
          <Loader name="datasets" />
        </Paper>;
    } else {
      if (this.props.research.pavicsDatasets.items.length) {
        let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
        let paginated = this.props.research.pavicsDatasets.items.slice(start, start + this.state.numberPerPage);
        let confirmation = null;
        mainComponent =
          <div>
            <Paper style={{ marginTop: 20 }}>
              <List>
                <Subheader inset={true}>Found <strong>{this.props.research.pavicsDatasets.items.length}</strong> results</Subheader>
                {paginated.map((x, i) =>
                  <ListItem
                    key={i}
                    leftCheckbox={<Checkbox value={x.dataset_id} onCheck={this._onCheckedDataset} />}
                    primaryText={`${x.aggregate_title} (${x.fileserver_url.length} file${(x.fileserver_url.length > 1)? 's': ''})` }
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack}}><strong>Variable: </strong> {x.variable_long_name}</span><br />
                        <strong>Keywords: </strong>{x.keywords.join(', ')}
                      </p>
                    }
                    secondaryTextLines={2}
                    rightIconButton={
                      <IconButton
                        touch={true}
                        tooltip={<div>
                          <strong>Dataset: </strong>{x.dataset_id}<br />
                          <strong>Subject: </strong>{x.subject}<br />
                          <strong>Category: </strong>{x.category}<br />
                          <strong>Experiment: </strong>{x.experiment}<br />
                          <strong>Variable: </strong>{x.variable}<br />
                          <strong>Project: </strong>{x.project}<br />
                          <strong>Institute: </strong>{x.institute}<br />
                          <strong>Model: </strong>{x.model}<br />
                          <strong>Units: </strong>{x.units}<br />
                          <strong>Frequency: </strong>{x.frequency}<br />
                          <strong>Content type: </strong>{x.content_type}<br />
                        </div>}
                        tooltipPosition="bottom-left">
                        <InfoIcon color={grey400} />
                      </IconButton>
                    }
                  />
                )}
              </List>
              <Pagination
                total={this.props.research.pavicsDatasets.items.length}
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
          </div>;
      } else {
        if (this.props.research.pavicsDatasets.receivedAt) {
          mainComponent =
            <Paper style={{ marginTop: 20 }}>
              <List>
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
