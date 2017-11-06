import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import * as constants from './../../constants';

export default class WpsProcessFormInput extends Component {

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

  // it seems the dataType property of the inputs might change unpredictably (we have seen three forms to date) but they all seem to end with the type
  // hence, for string and boolean, implement a type of "endsWith" check instead of pure equivalence

  createMarkup () {
    if (this.props.type.endsWith(constants.BOOLEAN)) {
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
            onCheck={(event, value) => this.props.handleChange(event.target.checked, this.props.uniqueIdentifier)}
            value={value} />
          <small>{this.props.description}</small>
        </div>
      );
    }
    if (Array.isArray(this.props.value) && this.props.value.length > 0) {
      return this.props.value.map((elem, i) => {
        return (
          <TextField
            name={this.props.name}
            fullWidth
            value={this.props.value[i]}
            onChange={(event, value) => this.props.handleArrayChange(event.target.value, this.props.uniqueIdentifier, i)}
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
        onChange={(event, value) => this.props.handleChange(event.target.value, this.props.uniqueIdentifier)}
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
