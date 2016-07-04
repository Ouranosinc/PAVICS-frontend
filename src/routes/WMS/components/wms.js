
import React from 'react'
import OLComponent from '../../../components/OLComponent'
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
    this.props.fetchwms();
    this.state = {};
    this.state.selectedIndex;
    me = this;
  }

  onDatasetSelected(event){
    if(event.target.value.length){
      me.setState({selectedIndex: parseInt(event.target.value)});
    }else{
      me.setState({selectedIndex: undefined});
    }
  }

  componentDidMount(){

  }

  render () {
    return(
      <div className="row">
        <div className={classes.overlappingComponent + " col-md-3 col-lg-3"}>
          <div className={classes.overlappingBackground + " panel panel-default"}>
            <div className="panel-body">
              <div>
                <div>
                  <h3>
                    {
                      this.props.wms ?
                      this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Title"] : null
                    }
                  </h3>
                  <div className="form-group">
                    <label for="datasets">Datasets: </label>
                    <select className="form-control" id="datasets" onChange={this.onDatasetSelected}>
                      <option value="" defaultValue>
                        -- Pick a dataset --
                      </option>
                      {
                        this.props.wms ?
                          this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"].map(function(layer, index) {
                            return (
                              <option value={index} key={layer["Title"]}>
                                {layer["Title"]}
                              </option>
                            );
                          }, this)
                        : null
                      }
                    </select>
                  </div>
                  {
                    this.props.wms && typeof this.state.selectedIndex !== 'undefined' ?
                      LAYER_VALUES.map(function(value){
                        return <span><strong>{value}: </strong>{JSON.stringify(this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"][this.state.selectedIndex]["Layer"][0][value])}<br/></span>;
                      }, this)

                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-12">
          <div className={classes.mapPanel + "panel panel-default"}>
            <div className="panel-body">
              <OLComponent/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default wms
