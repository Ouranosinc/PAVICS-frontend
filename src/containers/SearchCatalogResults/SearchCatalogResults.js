import React from 'react'
import { connect } from 'react-redux'
import classes from './SearchCatalogResults.scss'

import Loader from '../../components/Loader'

var me;

export class SearchCatalogResults extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this._onOpenDataset = this._onOpenDataset.bind(this);
    this._onSelectDataset = this._onSelectDataset.bind(this);
    me = this;
  }

  _onOpenDataset(id){
    if(id === this.props.currentOpenedDataset){
      this.props.closeDatasetDetails();
    }else{
      this.props.openDatasetDetails(id);
    }
    //TODO: Fetch Dataset Detail following thredds url
    //TODO: Show Resource list (sub-datasets)
  }

  _onSelectDataset(id){

  }

  render() {
    console.log("render SearchCatalogResults");
    let mainComponent;
    if(this.props.datasets.isFetching){
      mainComponent = <Loader name="datasets" />
    }else{
      if(this.props.datasets.items.length){
        mainComponent = <div className={classes['DatasetTable']}>
          {this.props.datasets.items.map((x, i) =>
            <div className={classes['DatasetRow']} key={i + 1}>
              <a href="#" onClick={() => this._onOpenDataset(x.id)} className={classes['DatasetRowExpandButton']}>
                <i className="glyphicon glyphicon-folder-open"></i>
              </a>
              <span className={classes['DatasetRowTitle']}> { x.id }</span>
              <a href="#" onClick={() => this._onSelectDataset(x.id)} className={classes['DatasetRowSelectButton']}>
                <i className="glyphicon glyphicon-ok"></i>
              </a>
              { x.id === this.props.currentOpenedDataset ? <div className={classes['DatasetRowDetails']}>
                <div>URL: <a href={ x.url[0] }>{ x.url[0] }</a></div>
                <div>META-DATAS: </div>
              </div> : null }
            </div>
          )}
        </div>
      }else{
        if(this.props.datasets.receivedAt){
          mainComponent = <div>No results.</div>
        }else{
          mainComponent = <div></div>
        }
      }
    }
    return(
      <div className={classes['SearchCatalogResults']}>
        { mainComponent }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}
const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchCatalogResults)
