import React, {Component, PropTypes} from 'react'
import classes from './DatasetWMSLayer.scss'

export class DatasetWMSLayer extends Component {
  static propTypes = {
    onLoadWMSLayer: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.formData = {};
    this._loadWmsLayer = this._loadWmsLayer.bind(this);
  }

  _loadWmsLayer(){
    //TODO: Submit dynamically the form
    this.props.onLoadWMSLayer("1970-12-31T18:00:00.000Z", "", 0.4, 'default-scalar/div-RdYlBu');
  }


  render () {
    return (
      <div className={classes['DatasetWMSLayer']}>
        <form className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-5 col-md-3 col-lg-3 control-label" htmlFor="startDate">Start:</label>
            <div className="col-sm-4 col-md-5 col-lg-5">
              <input type="date" id="startDate" className="form-control"></input>
            </div>
            <div className="col-sm-3 col-md-4 col-lg-4">
              <input type="time" id="startTime" className="form-control"></input>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 col-md-3 col-lg-3 control-label" htmlFor="endDate">End:</label>
            <div className="col-sm-4 col-md-5 col-lg-5">
              <input type="date" id="endDate" className="form-control"></input>
            </div>
            <div className="col-sm-3 col-md-4 col-lg-4">
              <input type="time" id="endTime" className="form-control"></input>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 col-md-3 col-lg-3 control-label" htmlFor="opacity">Opacity:</label>
            <div className="col-sm-7 col-md-9 col-lg-9">
              <select id="opacity" className="form-control"></select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-5 col-md-3 col-lg-3 control-label" htmlFor="style">Style:</label>
            <div className="col-sm-7 col-md-9 col-lg-9">
              <select id="style" className="form-control"></select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-5 col-md-offset-3 col-lg-offset-3 col-sm-6 col-md-7 col-lg-7">
              <a type="button" href="#" className="btn btn-sm btn-default" onClick={ this._loadWmsLayer }>
                <i className="glyphicon glyphicon-import"></i> Load WMS Layer
              </a>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default DatasetWMSLayer
