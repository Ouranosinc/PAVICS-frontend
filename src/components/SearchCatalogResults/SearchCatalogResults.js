import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NotificationManager } from 'react-notifications';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import {Alert} from 'react-bootstrap';
import {List, ListItem} from'@material-ui/core/List';
import Checkbox from'@material-ui/core/Checkbox';
import ListSubheader from'@material-ui/core/ListSubheader';
import Paper from'@material-ui/core/Paper';
import IconButton from'@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Button from'@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddBox';

export class SearchCatalogResults extends React.Component {
  static propTypes = {
    clickTogglePanel: PropTypes.func.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this._onAddCheckedDatasetsToProject = this._onAddCheckedDatasetsToProject.bind(this);
    this._onCheckedDataset = this._onCheckedDataset.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
    this.state = {
      checkedDatasets: [],
      filesCount: 0,
      confirm: false,
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.research.pavicsDatasets && nextProps.research.pavicsDatasets  !== this.props.research.pavicsDatasets) {
      let filesCount = 0;
      nextProps.research.pavicsDatasets.items.forEach((dataset) => {
        filesCount += dataset.fileserver_url.length;
      });
      this.setState({
        filesCount: filesCount
      });
    }
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
      // TODO validate dataset_id unicity, else server with return an alert and user will be prompted an unuseful alert 500
      dataset.projectId = this.props.project.currentProject.id;
      // TODO: We could also affect default values for every missing property, so we don't have to make sure they exist applicaiton-wide
      if (!dataset.datetime_min) {
        dataset.datetime_min = []
      }
      if (!dataset.datetime_max) {
        dataset.datetime_max = []
      }
      delete dataset.id; // Delete id, else, Loopback will fail this because he wont be able to define a unique id
      // TODO: Send this id in another property if dataset.id ever become relevant to the platform
      this.props.projectAPIActions.createProjectDatasets(dataset);
    });
    this.setState({
      checkedDatasets: []
    });
  }

  render () {
    // console.log("render SearchCatalogResults");
    let mainComponent;
    if (this.props.research.pavicsDatasets.isFetching) {
      mainComponent =
        <Paper style={{ marginTop: 20 }}>
          <Loader id="cy-search-results-loader" name="datasets" />
        </Paper>;
    } else {
      if (this.props.research.pavicsDatasets.items.length) {
        let start = (this.state.pageNumber - 1) * this.state.numberPerPage;
        let paginated = this.props.research.pavicsDatasets.items.slice(start, start + this.state.numberPerPage);
        let confirmation = null;
        mainComponent =
          <div id="cy-search-results">
            <Paper style={{ marginTop: 20 }}>
              <List>
                <ListSubheader id="cy-search-results-count" inset={true}>Found <strong>{this.state.filesCount}</strong> total files in <strong>{this.props.research.pavicsDatasets.items.length}</strong> results</ListSubheader>
                {paginated.map((x, i) =>
                  <ListItem
                    className="cy-dataset-result-item"
                    key={i}
                    leftCheckbox={<Checkbox value={x.dataset_id} onCheck={this._onCheckedDataset} />}
                    primaryText={`${x.aggregate_title} (${x.fileserver_url.length} file${(x.fileserver_url.length > 1)? 's': ''})` }
                    secondaryText={
                      <p>
                        <span><strong>Variable: </strong> {x.variable_long_name}</span><br />
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
                        <InfoIcon />
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
            <Button variant="contained"
              id="cy-add-datasets-btn"
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
                <ListSubheader id="cy-search-no-results-sh">No results found.</ListSubheader>
              </List>
            </Paper>;
        } else {
          mainComponent =
            <Paper style={{ marginTop: 20 }}>
              <List>
                <ListSubheader id="cy-search-no-facets-sh">Select at least one facet to launch dataset's search</ListSubheader>
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
