
import React from 'react'
import OLComponent from '../../../components/OLComponent'
import classes from './wms.scss'

var me;

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
    me = this;
  }

  componentDidMount(){

  }

  render () {
    return(
      <div className="row">
        <div className="col-md-2 col-lg-2">
          <div className="panel panel-default">
            <div className="panel-body">
              <div>
                <div>
                  <div className="form-group">
                    <label for="datasets">Datasets: </label>
                    <select className="form-control" id="datasets">
                      { this.props.wms ?
                        this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"].map(layer =>
                          <option key={layer["Title"]}>
                            {layer["Title"]}
                          </option>
                        ) : null
                      }
                    </select>
                  </div>
                  <h2 className={classes.wmsHeader}>
                    {
                      this.props.wms ? this.props.wms.value["WMS_Capabilities"]["Capability"][0]["Layer"][0]["Layer"].length : ''
                    }
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-10 col-lg-10">
          <div className="panel panel-default">
            <div className="panel-body">
              <OLComponent />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default wms
