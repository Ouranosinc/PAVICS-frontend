import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

const {BOOLEAN, INPUT_DATETIME} = require('../../constants');

class WpsProcessFormInput extends Component {

  // value not marked as required because it can (somewhat) validly be undefined
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    uniqueIdentifier: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleArrayChange: React.PropTypes.func.isRequired,
    minOccurs: React.PropTypes.number.isRequired,
    maxOccurs: React.PropTypes.number.isRequired,
    value: React.PropTypes.any
  };

  constructor (props) {
    super(props);
    this.state = {
      dateTimeValues: {
        date: null,
        time: null
      }
    };
  }

  createDateTime = () => {
    const date = this.state.dateTimeValues.date || new Date();
    const time = this.state.dateTimeValues.time || new Date();
    const dateString = date.toISOString().split('T')[0];
    const timeString = time.toISOString().split('T')[1];
    this.props.handleChange(`${dateString}T${timeString}`, this.props.uniqueIdentifier);
  };
  handleDateChange = (event, date) => {
    this.setState({
      dateTimeValues: {
        date: date,
        time: this.state.dateTimeValues.time
      }
    }, () => { this.createDateTime(); });
  };
  handleTimeChange = (event, time) => {
    this.setState({
      dateTimeValues: {
        date: this.state.dateTimeValues.date,
        time: time
      }
    }, () => { this.createDateTime(); });
  };

  handleCheckboxChange = (event, value) => {
    this.props.handleChange(event.target.checked, this.props.uniqueIdentifier);
  };

  createHandleTextFieldArrayChangeCallback = (index) => {
    return (event, value) => {
      this.handleTextFieldArrayChange(event.target.value, index);
    };
  };

  handleTextFieldArrayChange = (value, index) => {
    this.props.handleArrayChange(value, this.props.uniqueIdentifier, index);
  };

  handleTextFieldChange = (event, value) => {
    this.props.handleChange(event.target.value, this.props.uniqueIdentifier);
  };

  createMarkup () {
    // it seems the dataType property of the inputs might change unpredictably (we have seen three forms to date) but they all seem to end with the type
    // hence, for string and boolean, implement a type of "endsWith" check instead of pure equivalence
    if (this.props.type.endsWith(BOOLEAN)) {
      let value = false;
      if (typeof (this.props.value) === 'boolean') {
        value = this.props.value;
      } else if (typeof (this.props.value) === 'string') {
        if (this.props.value === 'True') {
          value = true;
        }
      }
      return (
        <div>
          <Checkbox
            name={this.props.name}
            label={this.props.title}
            labelPosition="right"
            labelStyle={{ textAlign: 'left' }}
            checked={value}
            onCheck={this.handleCheckboxChange}
            value={value} />
          <small>{this.props.description}</small>
        </div>
      );
    }
    if (this.props.type === INPUT_DATETIME) {
      return (
        <div style={{ padding: '15px 0 0' }} className="container">
          <div className="row">
            <div className="col-sm-6">
              <DatePicker
                autoOk
                value={this.state.dateTimeValues.date}
                onChange={this.handleDateChange}
                style={{ width: '100%' }}
                hintText={`${this.props.description} - date`}
                container="inline" />
            </div>
            <div className="col-sm-6">
              <TimePicker
                autoOk
                value={this.state.dateTimeValues.time}
                hintText={`${this.props.description} - time`}
                onChange={this.handleTimeChange}
                textFieldStyle={{ width: '100%' }}
                format="24hr" />
            </div>
            <input value={this.props.value} name={this.props.name} title={this.props.title} type="hidden" />
          </div>
        </div>
      );
    }
    if (Array.isArray(this.props.value) && this.props.value.length > 0) {
      return this.props.value.map((elem, i) => {
        return (
          <TextField
            key={i}
            name={this.props.name}
            fullWidth
            value={this.props.value[i]}
            onChange={this.createHandleTextFieldArrayChangeCallback(i)}
            hintText={this.props.description}
            floatingLabelText={this.props.title} />
        );
      });
    }
    return (
      <TextField
        name={this.props.name}
        fullWidth
        value={this.props.value}
        onChange={this.handleTextFieldChange}
        hintText={this.props.description}
        floatingLabelText={this.props.title} />
    );
  }

  render () {
    return (
      <div>
        {this.props.maxOccurs > 1 ? <input type="hidden" name="__start__" value={this.props.name + ':sequence'} /> : ''}
        {this.createMarkup()}
        {this.props.maxOccurs > 1 ? <input type="hidden" name="__end__" value={this.props.name + ':sequence'} /> : ''}
      </div>
    );
  }
}

export {WpsProcessFormInput};
