
import React from 'react'
import OLComponent from '../../../components/OLComponent'
import DatasetsComponents from '../../../components/DatasetsComponent'
import classes from './wms.scss'

var me;
const LAYER_VALUES = ["$", "Name", "Title", "Abstract", "EX_GeographicBoundingBox", "BoundingBox", "Dimension"/*, "Style"*/];

class wms extends React.Component {
  static propTypes = {
    wms: React.PropTypes.object,
    saved: React.PropTypes.array.isRequired,
    fetchwms: React.PropTypes.func.isRequired,
    saveCurrentwms: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
    me = this;
  }

  componentDidMount(){

  }

  onSelectedDataset(dataset){
    this.setState({ dataset: dataset});
  }

  render () {
    return(
      <div className="row">
        <div className={classes.overlappingComponent + " col-md-3 col-lg-3"}>
          <div className={classes.overlappingBackground + " panel panel-default"}>
            <div className="panel-body">
              <DatasetsComponents {...this.props} onSelectedDataset={ this.onSelectedDataset.bind(this) } />
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-12">
          <div className={classes.mapPanel + "panel panel-default"}>
            <div className="panel-body">
              <OLComponent capabilities={this.props.wms} dataset={this.state.dataset}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default wms
