import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

const BOOLEAN = 'boolean';
const STRING = 'string';
const NETCDF = 'ComplexData';
const LABEL_NETCDF = 'LABEL_NETCDF';
const LABEL_SHAPEFILE = 'LABEL_SHAPEFILE';
const LABEL_FEATURE_IDS = 'LABEL_FEATURE_IDS';

export default class WpsProcessFormInput extends Component {

  static propTypes = {
    type: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    uniqueIdentifier: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleCheckBoxChange: React.PropTypes.func.isRequired
  };

  createMarkup () {
    switch (this.props.type) {
      case BOOLEAN:
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
              id={this.props.name}
              name={this.props.name}
              label={this.props.title}
              labelPosition="right"
              labelStyle={{ textAlign: 'left' }}
              checked={value}
              onCheck={(event, value) => this.props.handleCheckBoxChange(event, this.props.uniqueIdentifier)}
              value={value} />
            <small>{this.props.description}</small>
          </div>
        );
      case NETCDF:
        return (
          <div>
            <TextField
              id={LABEL_NETCDF}
              name="resource"
              fullWidth
              value={this.props.value}
              onChange={(event, value) => this.props.handleChange(event, this.props.uniqueIdentifier)}
              hintText={this.props.description}
              floatingLabelText={this.props.title} />
          </div>
        );
      case STRING:
        if (this.props.name === 'typename') {
          console.log('we have at least one typename');
          return (
            <div>
              <TextField
                id={LABEL_SHAPEFILE}
                name={this.props.name}
                fullWidth
                value={this.props.value}
                onChange={(event, value) => this.props.handleChange(event, this.props.uniqueIdentifier)}
                hintText={this.props.description}
                floatingLabelText={this.props.title} />
            </div>
          );
        } else if (this.props.name === 'featureids') {
          return (
            <div>
              <TextField
                name={this.props.name}
                fullWidth
                value={this.props.value}
                onChange={(event, value) => this.props.handleChange(event, this.props.uniqueIdentifier)}
                hintText={this.props.description}
                floatingLabelText={this.props.title} />
            </div>
          );
        }
        return (
          <div>
            <TextField
              id={this.props.name}
              name={this.props.name}
              fullWidth
              value={this.props.value}
              onChange={(event, value) => this.props.handleChange(event, this.props.uniqueIdentifier)}
              hintText={this.props.description}
              floatingLabelText={this.props.title} />
          </div>
        );
      default:
        return (
          <div>
            <TextField
              id={this.props.name}
              name={this.props.name}
              fullWidth
              value={this.props.value}
              onChange={(event, value) => this.props.handleChange(event, this.props.uniqueIdentifier)}
              hintText={this.props.description}
              floatingLabelText={this.props.title} />
          </div>
        );
    }
  }

  render () {
    return this.createMarkup();
  }
}
