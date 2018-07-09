import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import * as constants from '../../constants';
import Pagination from './../../components/Pagination';
import List from'@material-ui/core/List';
import ListItem from'@material-ui/core/ListItem';
import ListItemIcon from'@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from'@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import Paper from'@material-ui/core/Paper';
import Folder from '@material-ui/icons/Folder';
import File from '@material-ui/icons/InsertDriveFile';
import DatasetMenuActions from './../DatasetMenuActions';

const styles = theme => ({
  ProjectDatasets: {
    width: '100%',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  listItem: {
    minWidth: '100%'
  }
});


export class ProjectDatasets extends React.Component {
  state = {
    nestedOpenedDatasets: {},
    datasetsPageNumber: 1,
    datasetsNumberPerPage: constants.PER_PAGE_OPTIONS[constants.PER_PAGE_INITIAL_INDEX]
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectActions: PropTypes.object.isRequired,
    datasetAPI: PropTypes.object.isRequired,
    datasetAPIActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.currentProject && nextProps.project.currentProject !== this.props.project.currentProject) {
      this.props.datasetAPIActions.fetchDatasets({projectId: nextProps.project.currentProject.id});
    }
  }

  componentWillMount() {
    if (this.props.project.currentProject.id) {
      this.props.datasetAPIActions.fetchDatasets({projectId: this.props.project.currentProject.id});
    }
  }

  onDatasetsPageChanged(pageNumber, numberPerPage) {
    this.setState({
      datasetsPageNumber: pageNumber,
      datasetsNumberPerPage: numberPerPage
    });
  }

  onDatasetListItemToggled = (dataset) => {
    let nestedOpenedDatasets = this.state.nestedOpenedDatasets;
    nestedOpenedDatasets[dataset.dataset_id] = !(this.state.nestedOpenedDatasets[dataset.dataset_id] && this.state.nestedOpenedDatasets[dataset.dataset_id] === true);
    this.setState({
      nestedOpenedDatasets: nestedOpenedDatasets
    });
  };

  render() {
    const {classes} = this.props;
    let datasetsStart = (this.state.datasetsPageNumber - 1) * this.state.datasetsNumberPerPage;
    let datasetsPaginated = this.props.datasetAPI.items.slice(datasetsStart, datasetsStart + this.state.datasetsNumberPerPage);
    return (
      <div id="cy-project-datasets" className={classes['ProjectDatasets']}>
        <Paper style={{marginTop: 20}}>
          <List component="div">
            <ListSubheader>Project dataset(s)</ListSubheader>
            {datasetsPaginated.map((dataset, i) => {
              if (dataset.type === "Aggregate") {
                return (
                  <div>
                    <ListItem
                      button onClick={(event) => this.onDatasetListItemToggled(dataset)}
                      className={classes.listItem + " cy-project-dataset-item cy-project-dataset-level-0"}
                      key={i}>
                      <ListItemIcon>
                        <Folder />
                      </ListItemIcon>
                      <ListItemText
                        inset
                        primary={dataset.aggregate_title}
                        secondary={
                          <div>
                          <span
                            className="cy-dataset-multiple-file-title">{dataset.fileserver_url.length + ' Files'}</span><br />
                            <strong>Keywords: </strong>{dataset.keywords.join(', ')}
                          </div>
                        }/>
                      <DatasetMenuActions {...this.props}
                                          dataset={dataset}
                                          isRemoveFromProjectEnabled={true}
                                          disabledVisualize={false}/>
                    </ListItem>
                    <Collapse in={this.state.nestedOpenedDatasets[dataset.dataset_id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {
                          dataset.wms_url.map((wmsUrl, j) => {
                            return (
                              <ListItem
                                className={classes.nested + " cy-project-dataset-item cy-project-dataset-level-1"}
                                style={{width: '98%'}}
                                key={j}>
                                <ListItemIcon>
                                  <File />
                                </ListItemIcon>
                                <ListItemText
                                  className={classes.MuiListItemText}
                                  inset
                                  primary={dataset.title[j]}/>
                                <DatasetMenuActions {...this.props}
                                                    fileIndex={j}
                                                    isFile={true}
                                                    isRemoveFromProjectEnabled={true}
                                                    dataset={dataset}
                                                    disabledVisualize={false}/>
                              </ListItem>
                            );
                          })
                        }
                      </List>
                    </Collapse>
                  </div>
                );
              } else {
                // FileAsAggregate
                let disabledVisualize = false;
                if (this.props.currentVisualizedDatasets.find(x => x.dataset_id === dataset.dataset_id)) {
                  disabledVisualize = true;
                }
                return (
                  <div>
                    <ListItem
                      className="cy-project-dataset-item cy-project-dataset-level-0"
                      key={i}>
                      <ListItemIcon>
                        <File />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.MuiListItemText}
                        inset
                        primary={dataset.aggregate_title}
                        secondary={
                          <div>
                            <span className="cy-dataset-single-file-title">{dataset.title[0]}</span><br />
                            <strong>Keywords: </strong>{dataset.keywords.join(', ')}
                          </div>
                        }/>
                      <DatasetMenuActions
                        addDatasetsToVisualize={this.props.addDatasetsToVisualize}
                        selectCurrentDisplayedDataset={this.props.selectCurrentDisplayedDataset}
                        isRemoveFromProjectEnabled={true}
                        dataset={dataset}
                        disabledVisualize={disabledVisualize}
                        datasetAPIActions={this.props.datasetAPIActions}
                        project={this.props.project}/>
                    </ListItem>
                  </div>
                );
              }

            })}
          </List>
          <Pagination
            total={this.props.datasetAPI.items.length}
            initialPerPageOptionIndex={constants.PER_PAGE_INITIAL_INDEX}
            perPageOptions={constants.PER_PAGE_OPTIONS}
            onChange={(pageNumber, numberPerPage) => this.onDatasetsPageChanged(pageNumber, numberPerPage)}/>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(ProjectDatasets);
