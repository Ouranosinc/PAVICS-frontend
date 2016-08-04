import React from 'react'
import classes from './DatasetsComponent.scss'

var me;
const LAYER_VALUES = ["$", "Name", "Title", "Abstract", "EX_GeographicBoundingBox", "BoundingBox", "Dimension"/*, "Style"*/];

class DatasetsComponent extends React.Component {
  static propTypes = {
    wms: React.PropTypes.object,
    saved: React.PropTypes.array.isRequired,
    fetchWms: React.PropTypes.func.isRequired,
    saveCurrentwms: React.PropTypes.func.isRequired,
    onSelectedDataset: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.props.fetchWms();
    this.state = {};
    this.state.selectedIndex;
    me = this;
  }

  onDatasetSelected(event){
    if(event.target.value.length){
      me.setState({selectedIndex: parseInt(event.target.value)});
      var dataset = me.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"][event.target.value];
      me.props.onSelectedDataset(dataset["Layer"][0]);
    }else{
      me.setState({selectedIndex: undefined});
    }
  }

  componentDidMount(){

  }


  render () {
    var layersArray = [],
      wmsTitle = "",
      optionList = null;

    if(this.props.wms){
      wmsTitle = this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Title"]
      layersArray = this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"];
    }

    return(
      <div>
        <div>
          <h3>
            { wmsTitle }
          </h3>
          <div className="form-group">
            <label for="datasets">Datasets: </label>
            <select className="form-control" id="datasets" onChange={this.onDatasetSelected}>
              <option value="" defaultValue>
                -- Pick a dataset --
              </option>
              {
                this.props.wms ?
                  layersArray.map(function(layer, index) {
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
                return <span key={value}><strong>{value}: </strong>{JSON.stringify(layersArray[this.state.selectedIndex]["Layer"][0][value])}<br/></span>;
              }, this)

              : null
          }
        </div>
      </div>
    )
  }
}

export default DatasetsComponent
