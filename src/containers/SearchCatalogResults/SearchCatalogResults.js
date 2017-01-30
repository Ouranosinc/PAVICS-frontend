import React from 'react';
import {connect} from 'react-redux';
import classes from './SearchCatalogResults.scss';
import * as constants from './../../constants';
import Loader from '../../components/Loader';
import { Button, Glyphicon } from 'react-bootstrap';
export class SearchCatalogResults extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    closeDatasetDetails: React.PropTypes.func.isRequired,
    openDatasetDetails: React.PropTypes.func.isRequired,
    fetchDataset: React.PropTypes.func.isRequired,
    currentOpenedDataset: React.PropTypes.string.isRequired,
    esgfDatasets: React.PropTypes.object.isRequired
  }

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
          <div>
            <div>Found <strong>{this.props.pavicsDatasets.items.length}</strong> results</div>
            <div className={classes['DatasetTable']}>
              {this.props.pavicsDatasets.items.map((x, i) =>
                <div className={classes['DatasetRow']} key={i + 1}>
                  <div>
                    <Button onClick={() => this._onAddPavicsDatasetToProject(x)}>
                      <Glyphicon glyph="plus" />
                    </Button>
                    {x.dataset_id}
                    {/*<a href="#" onClick={() => this._onOpenPavicsDataset(x)}
                      className={classes['DatasetRowExpandButton']}>
                      <i className="glyphicon glyphicon-folder-open" /> {x.dataset_id}
                    </a>*/}
                    <span>
                      <small><strong>Variable: </strong>{x.variable_long_name[0]}</small><br/>
                      <small><strong>Experiment: </strong>{x.experiment}</small><br/>
                      <small><strong>Institute: </strong>{x.institute}</small><br/>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>;
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
