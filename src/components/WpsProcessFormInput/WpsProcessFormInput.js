import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from'@material-ui/core/Checkbox';
import TextField from'@material-ui/core/TextField';
// import DatePicker from'@material-ui/core/DatePicker';
// import TimePicker from'@material-ui/core/TimePicker';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
import FormControl from'@material-ui/core/FormControl';
import FormControlLabel from'@material-ui/core/FormControlLabel';
import FormHelperText from'@material-ui/core/FormHelperText';

const {BOOLEAN, INPUT_DATETIME} = require('../../constants');

class WpsProcessFormInput extends Component {
  state = {
    dateTimeValues: {
      date: null,
      time: null
    }
  };

  // value not marked as required because it can (somewhat) validly be undefined
  static propTypes = {
    inputDefinition: PropTypes.object.isRequired,
    uniqueIdentifier: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleArrayChange: PropTypes.func.isRequired,
    value: PropTypes.any
  };

  constructor (props) {
    super(props);
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

  handleCheckboxChange = (event) => {
    this.props.handleChange(event.target.checked, this.props.uniqueIdentifier);
  };

  createHandleTextFieldArrayChangeCallback = (event, index) => {
    this.handleTextFieldArrayChange(event.target.value, index);
  };

  handleTextFieldArrayChange = (value, index) => {
    this.props.handleArrayChange(value, this.props.uniqueIdentifier, index);
  };

  handleTextFieldChange = (event) => {
    this.props.handleChange(event.target.value, this.props.uniqueIdentifier);
  };

  handleSelectChange = (event) => {
    this.props.handleChange(event.target.value, this.props.uniqueIdentifier);
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
        <FormControl >
          <FormControlLabel
            label={this.props.inputDefinition.title}
            control={
              <Checkbox
                name={this.props.inputDefinition.name}
                checked={value}
                onChange={this.handleCheckboxChange} />
            }>
          </FormControlLabel>
          <FormHelperText style={{marginTop: '-12px'}}>
            {this.props.inputDefinition.description}
          </FormHelperText>
        </FormControl >
      );
    }
    if (this.props.inputDefinition.dataType === INPUT_DATETIME) {
      return (
        <div style={{ padding: '15px 0 0' }} className="container">
          <div className="row">
            {/*<div className="col-sm-6">
              <DatePicker
                autoOk
                value={this.state.dateTimeValues.date}
                onChange={this.handleDateChange}
                style={{ width: '100%' }}
                helperText={`${this.props.inputDefinition.description} - date`}
                container="inline" />
            </div>
            <div className="col-sm-6">
              <TimePicker
                autoOk
                value={this.state.dateTimeValues.time}
                helperText={`${this.props.inputDefinition.description} - time`}
                onChange={this.handleTimeChange}
                textFieldStyle={{ width: '100%' }}
                format="24hr" />
            </div>*/}
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
          <Select
            multiple
            fullWidth
            className="cy-workflow-input-select-field"
            value={(this.props.value)? this.props.value: []}
            onChange={this.handleSelectChange}
            helperText={this.props.inputDefinition.description}
            label={this.props.inputDefinition.title}>
            {this.props.inputDefinition.allowedValues.map((value, i) => {
              return (
                <MenuItem
                  key={i}
                  value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
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
            onChange={(event) => this.createHandleTextFieldArrayChangeCallback(event, i)}
            helperText={this.props.inputDefinition.description}
            label={this.props.inputDefinition.title} />
        );
      });
    }
    return (
      <TextField
        name={this.props.inputDefinition.name}
        fullWidth
        value={this.props.value}
        onChange={this.handleTextFieldChange}
        helperText={this.props.inputDefinition.description}
        label={this.props.inputDefinition.title} />
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

export default WpsProcessFormInput;
