import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import DateRangePicker from 'react-bootstrap-daterangepicker'
require("react-bootstrap-daterangepicker/css/daterangepicker.css");
import classes from './DatasetWMSLayer.scss'


export class DatasetWMSLayer extends Component {
  static propTypes = {
    onLoadWMSLayer: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.formData = {};
    this._loadWmsLayer = this._loadWmsLayer.bind(this);
    this._handleDateTimeRangeEvents = this._handleDateTimeRangeEvents.bind(this);
    this._handleDateTimeSingleEvents = this._handleDateTimeSingleEvents.bind(this);
    this.state = {
      dateTimeRangeString: "",
      dateTimeRangeValues: [moment(), moment().add(-3, 'day')],
      dateTimeStringValue: ""
    }
  }

  _loadWmsLayer(){
    //TODO: Submit dynamically the form
    this.props.onLoadWMSLayer("1970-12-31T18:00:00.000Z", "", 0.4, 'default-scalar/div-RdYlBu');
  }

  _handleDateTimeRangeEvents(event, picker){
    let newDateTimeRangeValues = [
      picker.startDate , picker.endDate
    ];
    let newDateTimeRangeString = `${picker.startDate.format('YYYY-MM-DD HH:mm')}/${picker.endDate.format('YYYY-MM-DD HH:mm')}`;
    if(newDateTimeRangeString !== this.state.dateTimeRangeString && event.type === "apply"){
      this.setState({
        dateTimeRangeString: newDateTimeRangeString,
        dateTimeRangeValues: newDateTimeRangeValues
      });
    }
  }

  _handleDateTimeSingleEvents(event, picker){
    let newdateTimeStringValue = `${picker.startDate.format('YYYY-MM-DD HH:mm')}`;
    //For some reasons, the datetime picker returns a second event on apply with wrong dates
    if(newdateTimeStringValue !== this.state.dateTimeStringValue && event.type === "apply"){
      this.setState({ dateTimeStringValue: newdateTimeStringValue});
    }
  }

  render () {
    return (
      <div className={classes['DatasetWMSLayer']}>
        <form className="form-horizontal" role="form">
          <div className="form-group">
            <label className="col-sm-5 col-md-3 col-lg-3 control-label" htmlFor="startDate">Date range:</label>
            <div className="col-sm-7 col-md-9 col-lg-9">
              <DateRangePicker
                startDate={this.state.dateTimeRangeValues[0]}
                endDate={this.state.dateTimeRangeValues[1]}
                /*minDate={moment('1/1/2014')}
                maxDate={moment('3/1/2014')}*/
                timePicker={true}
                timePickerIncrement={30}
                timePicker24Hour={true}
                opens="left"
                locale={{
                    format: 'YYYY-MM-DD HH:mm'
                  }}
                onEvent={this._handleDateTimeRangeEvents}
              >
                <input id="dateTimeRange" className="form-control" value={this.state.dateTimeRangeString}></input>
                <i className={"glyphicon glyphicon-calendar " + classes.InputIcon}></i>
              </DateRangePicker>
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
