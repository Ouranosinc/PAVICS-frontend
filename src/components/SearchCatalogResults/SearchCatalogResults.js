import React from 'react';
import PropTypes from 'prop-types';
import * as constants from '../../constants';
import Loader from './../../components/Loader';
import Pagination from './../../components/Pagination';
import List from'@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from'@material-ui/core/ListSubheader';
import Checkbox from'@material-ui/core/Checkbox';
import Paper from'@material-ui/core/Paper';
import Button from'@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DatasetMenuActions from './../DatasetMenuActions';

export class SearchCatalogResults extends React.Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projectAPIActions: PropTypes.object.isRequired,
    research: PropTypes.object.isRequired,
    datasetAPIActions: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this._onAddCheckedDatasetsToProject = this._onAddCheckedDatasetsToProject.bind(this);
    this._onToggleCheckDataset = this._onToggleCheckDataset.bind(this);
    this._onPageChanged = this._onPageChanged.bind(this);
    this.state = {
      checkedDatasets: [],
      filesCount: 0,
      confirm: false,
      pageNumber: 1,
      numberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX],
      infoOpened: false,
      infoDataset: {}
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
    if(nextProps.research.selectedFacets && nextProps.research.selectedFacets  !== this.props.research.selectedFacets) {
      this.setState({checkedDatasets: []});
    }
  }

  _onPageChanged (pageNumber, numberPerPage) {
    this.setState({
      pageNumber: pageNumber,
      numberPerPage: numberPerPage
    });
  }

  _onToggleCheckDataset (value) {
    let dataset = this.props.research.pavicsDatasets.items.find(x => x.dataset_id === value);
    let index = this.state.checkedDatasets.findIndex(x => x.dataset_id === value);
    let oldDatasets = this.state.checkedDatasets;
    if (dataset) {
      if (index === -1) {
        this.setState({
          checkedDatasets: oldDatasets.concat([dataset])
        });
      }
      if (index > -1) {
        oldDatasets.splice(index, 1);
        this.setState({
          checkedDatasets: oldDatasets
        });
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
        mainComponent =
          <div id="cy-search-results">
            <Paper style={{ marginTop: 20 }}>
              <List>
                <ListSubheader id="cy-search-results-count" inset={true}>Found <strong>{this.state.filesCount}</strong> total files in <strong>{this.props.research.pavicsDatasets.items.length}</strong> results</ListSubheader>
                {paginated.map((x, i) =>
                  <ListItem
                    button
                    onClick={(event) => this._onToggleCheckDataset(x.dataset_id)}
                    className="cy-dataset-result-item"
                    key={i}>
                    <ListItemIcon>
                      <Checkbox checked={this.state.checkedDatasets.findIndex(d => d.dataset_id === x.dataset_id) > -1} />
                    </ListItemIcon>
                    <ListItemText
                      inset
                      primary={`${x.aggregate_title} (${x.fileserver_url.length} file${(x.fileserver_url.length > 1)? 's': ''})` }
                      secondary={
                        <span>
                          <span><strong>Variable: </strong> {x.variable_long_name}</span><br />
                          <strong>Keywords: </strong>{x.keywords.join(', ')}
                        </span>
                      }/>
                    <DatasetMenuActions
                      visualizeActions={this.props.visualizeActions}
                      isRemoveFromProjectEnabled={false}
                      dataset={x}
                      disabledVisualize={false}
                      datasetAPIActions={this.props.datasetAPIActions}
                      project={this.props.project}/>
                  </ListItem>
                )}
              </List>
              <Pagination
                total={this.props.research.pavicsDatasets.items.length}
                initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
                perPageOptions={constants.PER_PAGE_OPTIONS}
                onChange={this._onPageChanged} />
              <div className="container">
                <Button variant="contained"
                        color="primary"
                        id="cy-add-datasets-btn"
                        disabled={!this.state.checkedDatasets.length}
                        onClick={this._onAddCheckedDatasetsToProject}>
                  <AddIcon /> Add selection(s)
                </Button>
              </div>
            </Paper>
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
      <React.Fragment>
        {mainComponent}
      </React.Fragment>
    );
  }
}
export default SearchCatalogResults;
