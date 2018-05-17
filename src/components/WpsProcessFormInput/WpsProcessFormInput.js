import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const {BOOLEAN, INPUT_DATETIME} = require('../../constants');

class WpsProcessFormInput extends Component {

  // value not marked as required because it can (somewhat) validly be undefined
  static propTypes = {
    inputDefinition: React.PropTypes.object.isRequired,
    uniqueIdentifier: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleArrayChange: React.PropTypes.func.isRequired,
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

  handleSelectFieldChange = (event, key, payload) => {
    this.props.handleChange(payload, this.props.uniqueIdentifier);
  };

  createMarkup () {
    // it seems the dataType property of the inputs might change unpredictably (we have seen three forms to date) but they all seem to end with the type
    // hence, for string and boolean, implement a type of "endsWith" check instead of pure equivalence
    if (this.props.inputDefinition.dataType.endsWith(BOOLEAN)) {
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
            name={this.props.inputDefinition.name}
            label={this.props.inputDefinition.title}
            labelPosition="right"
            labelStyle={{ textAlign: 'left' }}
            checked={value}
            onCheck={this.handleCheckboxChange}
            value={value} />
          <small>{this.props.inputDefinition.description}</small>
        </div>
      );
    }
    if (this.props.inputDefinition.dataType === INPUT_DATETIME) {
      return (
        <div style={{ padding: '15px 0 0' }} className="container">
          <div className="row">
            <div className="col-sm-6">
              <DatePicker
                autoOk
                value={this.state.dateTimeValues.date}
                onChange={this.handleDateChange}
                style={{ width: '100%' }}
                hintText={`${this.props.inputDefinition.description} - date`}
                container="inline" />
            </div>
            <div className="col-sm-6">
              <TimePicker
                autoOk
                value={this.state.dateTimeValues.time}
                hintText={`${this.props.inputDefinition.description} - time`}
                onChange={this.handleTimeChange}
                textFieldStyle={{ width: '100%' }}
                format="24hr" />
            </div>
            <input value={this.props.value} name={this.props.inputDefinition.name} title={this.props.inputDefinition.title} type="hidden" />
          </div>
        </div>
      );
    }

    // since the value of the select field must be an array to support the multiple selection
    // leave this check before the isArray one, or the fields will be rendered as text fields on next rendering
    if (this.props.inputDefinition.selectable) {
      return (
        <div>
          <SelectField
            multiple
            value={this.props.value}
            onChange={this.handleSelectFieldChange}
            floatingLabelText={this.props.inputDefinition.title}>
            {this.props.inputDefinition.allowedValues.map((value, i) => {
              return (
                <MenuItem
                  key={i}
                  value={value}
                  primaryText={value} />
              );
            })}
          </SelectField>
          { this.props.value
            ? this.props.value.map(
              (selectedRegion, i) => <input key={i} type="hidden" name={this.props.inputDefinition.name} value={selectedRegion} />
            ) : null
          }
        </div>
      );
    }

    if (Array.isArray(this.props.value) && this.props.value.length > 0) {
      return this.props.value.map((elem, i) => {
        return (
          <TextField
            key={i}
            name={this.props.inputDefinition.name}
            fullWidth
            value={this.props.value[i]}
            onChange={this.createHandleTextFieldArrayChangeCallback(i)}
            hintText={this.props.inputDefinition.description}
            floatingLabelText={this.props.inputDefinition.title} />
        );
      });
    }
    return (
      <TextField
        name={this.props.inputDefinition.name}
        fullWidth
        value={this.props.value}
        onChange={this.handleTextFieldChange}
        hintText={this.props.inputDefinition.description}
        floatingLabelText={this.props.inputDefinition.title} />
    );
  }

  render () {
    return (
      <div data-cy-name={this.props.inputDefinition.name}>
        {this.props.inputDefinition.maxOccurs > 1 ? <input type="hidden" name="__start__" value={this.props.inputDefinition.name + ':sequence'} /> : ''}
        {this.createMarkup()}
        {this.props.inputDefinition.maxOccurs > 1 ? <input type="hidden" name="__end__" value={this.props.inputDefinition.name + ':sequence'} /> : ''}
      </div>
    );
  }
}

export {WpsProcessFormInput};
