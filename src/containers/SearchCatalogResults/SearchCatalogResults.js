import React from 'react';
import {connect} from 'react-redux';
import classes from './SearchCatalogResults.scss';
import * as constants from './../../constants';
import Loader from '../../components/Loader';
export class SearchCatalogResults extends React.Component {
  static propTypes = {
    clickTogglePanel: React.PropTypes.func.isRequired,
    closeDatasetDetails: React.PropTypes.func.isRequired,
    openDatasetDetails: React.PropTypes.func.isRequired,
    fetchDataset: React.PropTypes.func.isRequired,
    currentOpenedDataset: React.PropTypes.object.isRequired,
    datasets: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props);
    this._onOpenDataset = this._onOpenDataset.bind(this);
    this._onSelectDataset = this._onSelectDataset.bind(this);
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

  render () {
    // console.log("render SearchCatalogResults");
    let mainComponent;
    if (this.props.datasets.isFetching) {
      mainComponent = <Loader name="datasets" />;
    } else {
      if (this.props.datasets.items.length) {
        mainComponent =
          <div>
            <div>Found <strong>{this.props.datasets.items.length}</strong> results</div>
            <div className={classes['DatasetTable']}>
              {this.props.datasets.items.map((x, i) =>
                <div className={classes['DatasetRow']} key={i + 1}>
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
              )}
            </div>
          </div>;
      } else {
        if (this.props.datasets.receivedAt) {
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
