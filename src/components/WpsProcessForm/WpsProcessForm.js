import React from 'react';
import PropTypes from 'prop-types';
import * as constants from './../../constants';
import { WpsProcessFormInput } from '../WpsProcessFormInput';
import { WpsInput } from './../../data-models/WpsInput';
import Typography from'@material-ui/core/Typography';
import Paper from'@material-ui/core/Paper';
import Button from'@material-ui/core/Button';
import ExecuteIcon from '@material-ui/icons/Done';
import { WPS_TYPE_COMPLEXDATA } from './../../constants';

const styles = {
  paper: {
    maxeight: '450px',
    overflowY: 'auto',
    margin: '10px 0',
    overflowX: 'hidden'
  }
};

/*
Wps Process Form
this module builds and updates the values of the inputs of a simple wps process
it uses the custom routes of twitcher api to fetch the inputs of a specified provider and process or multiple of them (for workflows)

the inputs of the selected process are available in props.workflow.selectedProcessInputs

We need to be able to automatically fill some of the fields as well as represent them in a meaningful way
 - for dataType ComplexData and defaultValue.mimeType being application/x-netcdf, fill the field with the url property of the selected dataset
   if there are multiple urls in the selected dataset, we should populate one input for each urls
 - for dataType string and name resource, fill the field with the opendap_url of the selected dataset
 - for dataType string and input.allowedValues.length > 0, make a select with the allowedValues.
   if the maxOccurs is more than one the user might want to choose multiple values, so they should be allowed to
   if maxOccurs is one, then only one value is allowd, so a simple select will be enough
 - for dataType boolean make a checkbox
 - if minOccurs is 0, the input is optional, if it's one, it should be required to submit the form
 - for dataType dateTime create a date picker

Of interest here, is that we need to keep track of each inputs in the form, and arbitrarily set their values both from user input and map interaction
we use material's usual controlled inputs linked to the state of the component
we have to do this dynamically because we don't know beforehand the actual quantity or names the inputs will have
*/

export default class WpsProcessForm extends React.Component {
  static propTypes = {
    execute: PropTypes.func.isRequired,
    layerDataset: PropTypes.object.isRequired,
    layerRegion: PropTypes.object.isRequired,
    sectionActions: PropTypes.object.isRequired,
    workflow: PropTypes.object.isRequired,
    workflowActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      wpsInputs: []
    };
  }

  componentWillMount () {
    this.buildWpsInputs(this.props);
  }

  buildWpsInputs (props) {
    let wpsInputs = [];
    props.workflow.selectedProcessInputs.forEach((input) => {
      // TODO: process id ??
      wpsInputs.push(new WpsInput(input)); // Filled with default values if any
    });
    this.setState({
      wpsInputs: wpsInputs
    }, this.verifyMeaningfulValues(props));
  }

  /*
  we hook reacts built in componentWillReceiveProps to update specific relevant parts if the state when necessary
  since the form data is a map of dataType.name, we can update the state when the defined values change externally
  that is, if the selected dataset changes, and we have an entry for ComplexData.resource, update that input with the value of the change
  likewise, if we have an string.resource and the dataset changes, update the state with the opendap_urls

  these are the external changes that can affect the forms (to date)
   - dataset change
   - feature layer selected
   - region (feature) selected

  if dataset change
   if exists ComplexData.resource update state with urls
   if exists string.resource update state with opendap_urls
   TODO if exists string.url update state with catalog_urls
  if feature layer change
   if exists string.typename update state with layer name
  if region selected
   if exists string.featureids update state with currently selected regions ids

   */

  verifyMeaningfulValues (props, oldProps = {}) {
    console.log('verifying meaningful values in %o, current state: %o', props, this.state);

    let newWpsInputs = this.state.wpsInputs.map(input => {

      if (input.dataType === constants.WPS_TYPE_COMPLEXDATA && input.inputDefinition.label === constants.WPS_LABEL_RESOURCE) {
        // ComplexData.resource
        if (props.layerDataset.currentDisplayedDataset['url']) {
          input.value = props.layerDataset.currentDisplayedDataset['url'];
        } else {
          // If dataset unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.layerDataset.currentDisplayedDataset && oldProps.layerDataset.currentDisplayedDataset['url']) {
            input.value = '';
          }
        }
      } else if (input.dataType === constants.WPS_TYPE_STRING && input.inputDefinition.label === constants.WPS_LABEL_RESOURCE) {
        // string.resource
        if (props.layerDataset && props.layerDataset.currentDisplayedDataset['opendap_url']) {
          input.value =  props.layerDataset.currentDisplayedDataset['opendap_url'];
        } else {
          // If dataset unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.layerDataset && oldProps.layerDataset.currentDisplayedDataset && oldProps.layerDataset.currentDisplayedDataset['opendap_url']) {
            input.value = '';
          }
        }
      } else if (input.dataType === constants.WPS_TYPE_STRING && input.inputDefinition.label === constants.WPS_LABEL_TYPENAME) {
        // string.typename
        if (props.layerRegion.selectedFeatureLayer['wmsParams'] && props.layerRegion.selectedFeatureLayer['wmsParams']['LAYERS']) {
          input.value = props.layerRegion.selectedFeatureLayer['wmsParams']['LAYERS'];
        } else {
          // If feature layer unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.layerRegion && oldProps.layerRegion.selectedFeatureLayer && oldProps.layerRegion.selectedFeatureLayer['wmsParams'] &&
            oldProps.layerRegion.selectedFeatureLayer['wmsParams']['LAYERS']) {
            input.value = '';
            // TODO: empty selectedRegions array since value won't fit anymore
          }
        }
      } else if (input.dataType === constants.WPS_TYPE_STRING && input.inputDefinition.label === constants.WPS_LABEL_FEATURE_IDS) {
        // string.featuresids
        if (props.layerRegion.selectedRegions && props.layerRegion.selectedRegions.length) {
          input.value =  props.layerRegion.selectedRegions;
        } else {
          // If region unselected => reset value, else value might be the workflow default value (so do nothing)
          if (oldProps.layerRegion && oldProps.layerRegion.selectedRegions && oldProps.layerRegion.selectedRegions.length) {
            input.value  = []
          }
        }
      }
      return input;
    });

    this.setState({
      wpsInputs: newWpsInputs
    });
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.workflow.selectedProcessInputs && this.props.workflow.selectedProcessInputs !== nextProps.workflow.selectedProcessInputs) {
      this.buildWpsInputs(nextProps)
    } else {
      this.verifyMeaningfulValues(nextProps, this.props);
    }
  }

  /*
   ATTENTION

   while it does seem like there is data handling and stuff
   it's all lies
   actually, the data is captured in the workflow wizard stepper, with a FormData built directly from a document.querySelector
   likewise, the handleSelectedProcessValueChange was never fully implemented
   */
  handleChange  = (value, inputDefinition, process = '') => {
    // TODO eventually this will probably go in the redux store
    let newWpsInputs = this.state.wpsInputs.slice(0);
    let input = newWpsInputs.find(input => input.inputDefinition.id === inputDefinition.id && input.process === process);
    input.value = value;
    this.setState({
      wpsInputs: newWpsInputs
    });
  };

  handleArrayChange = (value, inputDefinition, index, process = '') => {
    // TODO eventually this will probably go in the redux store
    let newWpsInputs = this.state.wpsInputs.slice(0);
    let input = newWpsInputs.find(input => input.inputDefinition.id === inputDefinition.id && input.process === process);
    input.value[index] = value;
    this.setState({
      wpsInputs: newWpsInputs
    });

    /*let wholeArray = this.state.formData[uniqueIdentifier];
    wholeArray[index] = value;
    this.setState({
      formData: {
        ...this.state.formData,
        [uniqueIdentifier]: wholeArray
      }
    });*/
  };

  render () {
    return (
      <React.Fragment>
        <Paper elevation={2} style={styles.paper}>
        <div className="container">
          <Typography variant="headline">
            Required inputs
          </Typography>
          <form id="cy-process-form">
            {
              this.state.wpsInputs.map((wpsInput, i) => {
                // FIXME: Srsly not the place to do such thing
                /*const uniqueIdentifier = this.makeUniqueIdentifier(inputDefinition);
                let value = this.state.formData[uniqueIdentifier];

                if (inputDefinition.dataType === WPS_TYPE_COMPLEXDATA) {
                  // PAVICS platform support ComplexData inputs as reference only (URL)
                  // Consider adding validation: && inputDefinition.defaultValue.mimeType === 'application/x-netcdf'
                  // Consider validating: typeof value === 'object'
                  // TODO: ComplexData with minOccurs > 1 = Array
                  value = '';
                }*/
                return (
                  <div key={i} className="cy-process-form-field">
                    <WpsProcessFormInput
                      inputDefinition={wpsInput.inputDefinition}
                      process={wpsInput.process}
                      value={wpsInput.value}
                      handleArrayChange={this.handleArrayChange}
                      handleChange={this.handleChange} />
                  </div>
                );
              })
            }
          </form>
        </div>
        </Paper>
        <Button
          color="primary"
          variant="contained"
          id="cy-execute-process-btn"
          onClick={(event) => this.props.execute(this.state.wpsInputs)}>
          <ExecuteIcon />Execute process
        </Button>
      </React.Fragment>
    );
  }
}
