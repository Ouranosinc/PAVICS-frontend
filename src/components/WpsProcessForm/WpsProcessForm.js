import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import classes from '../WorkflowWizard/WorkflowWizard.scss';
import DeformWrapper from '../DeformWrapper/DeformWrapper';
const BOOLEAN = '//www.w3.org/TR/xmlschema-2/#boolean';
const STRING = '//www.w3.org/TR/xmlschema-2/#string';
const NETCDF = 'ComplexData';
const LABEL_NETCDF = 'LABEL_NETCDF';
const LABEL_SHAPEFILE = 'LABEL_SHAPEFILE';
const LABEL_FEATURE_IDS = 'LABEL_FEATURE_IDS';
export default class WpsProcessForm extends React.Component {
  static propTypes = {
    executeProcess: React.PropTypes.func.isRequired,
    formId: React.PropTypes.string.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired,
    workflow: React.PropTypes.object.isRequired,
    workflowActions: React.PropTypes.object.isRequired
  };

  /*
  ATTENTION

  while it does seem like there is data handling and stuff
  it's all lies
  actually, the data is captured in the workflow wizard stepper, with a FormData built directly from a document.querySelector
  likewise, the handleSelectedProcessValueChange was never fully implemented
   */


  constructor (props) {
    super(props);

    // Initially fill formData with input defaultValues if any
    let formData = {};
    this.props.workflow.selectedProcessInputs.forEach((input) => {
      formData[input.name] = input.defaultValue || "";
    });
    this.state = {
      formData: formData
    };
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    console.log('form will receive props', nextProps);
    if (nextProps.selectedDatasetLayer['urls']) {
      // TODO when unhardcoding files, remove the [0]
      if (this.state.formData[LABEL_NETCDF] !== nextProps.selectedDatasetLayer['urls'][0]) {
        this.setState({
          ...this.state,
          formData: {
            ...this.state.formData,
            [LABEL_NETCDF]: nextProps.selectedDatasetLayer['urls'][0]
          }
        });
      }
    }
    if (nextProps.selectedShapefile['wmsParams']) {
      if (this.state.formData[LABEL_SHAPEFILE] !== nextProps.selectedShapefile['wmsParams']['LAYERS']) {
        this.setState({
          ...this.state,
          formData: {
            ...this.state.formData,
            [LABEL_SHAPEFILE]: nextProps.selectedShapefile['wmsParams'] ? nextProps.selectedShapefile['wmsParams']['LAYERS'] : ''
          }
        });
      }
    } else {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          [LABEL_SHAPEFILE]: ''
        }
      });
    }
    let thisFeatureIdsString = nextProps.selectedRegions.join(', ');
    if (this.state.formData[LABEL_FEATURE_IDS] !== thisFeatureIdsString) {
      this.setState({
        ...this.state,
        formData: {
          ...this.state.formData,
          [LABEL_FEATURE_IDS]: thisFeatureIdsString
        }
      });
    }
  }

  handleChange (event) {
    // TODO eventually this will probably go in the global state
    // so use the handleProcessFormValueChange func passed in props
    let elem = event.target;
    this.setState({
      formData: {
        ...this.state.formData,
        [elem.id]: elem.value
      }
    });
  }

  handleCheckBoxChange(event) {
    this.setState({
      formData: {
        ...this.state.formData,
        [event.target.id]: event.target.checked
      }
    });
  }

  makeInnerInput (input) {
    switch (input.dataType) {
      case BOOLEAN:
        let value = false;
        if (typeof (this.state.formData[input.name]) === 'boolean') {
          value = this.state.formData[input.name];
        } else if (typeof (this.state.formData[input.name]) === 'string') {
          if (this.state.formData[input.name] === 'True') {
            value = true;
          }
        }
        return (
          <div>
            <Checkbox
              id={input.name}
              name={input.name}
              label={input.title}
              labelPosition="right"
              labelStyle={{textAlign: "left"}}
              checked={value}
              onCheck={(event, value) => this.handleCheckBoxChange(event)}
              value={value} />
            <small>{input.description}</small>
          </div>
        );
      case NETCDF:
        return (
          <div>
            <TextField
              id={LABEL_NETCDF}
              name="resource"
              fullWidth
              value={this.state.formData[LABEL_NETCDF]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
      case STRING:
        if (input.name === 'typename') {
          return (
            <div>
              <TextField
                id={LABEL_SHAPEFILE}
                name={input.name}
                fullWidth
                value={this.state.formData[LABEL_SHAPEFILE]}
                onChange={(event, value) => this.handleChange(event)}
                hintText={input.description}
                floatingLabelText={input.title} />
            </div>
          );
        } else if (input.name === 'featureids') {
          return (
            <div>
              <TextField
                id={LABEL_FEATURE_IDS}
                name={input.name}
                fullWidth
                value={this.state.formData[LABEL_FEATURE_IDS]}
                onChange={(event, value) => this.handleChange(event)}
                hintText={input.description}
                floatingLabelText={input.title} />
            </div>
          );
        }
        return (
          <div>
            <TextField
              id={input.name}
              name={input.name}
              fullWidth
              value={this.state.formData[input.name]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
      default:
        return (
          <div>
            <TextField
              id={input.name}
              name={input.name}
              fullWidth
              value={this.state.formData[input.name]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
    }
  }

  makeInput (input) {
    console.log('making react component for input %o', input);
    return (
      <div>
        {input['maxOccurs'] > 1 ? <input type="hidden" name="__start__" value="resource:sequence" /> : ''}
        {this.makeInnerInput(input)}
        {input['maxOccurs'] > 1 ? <input type="hidden" name="__end__" value="resource:sequence" /> : ''}
      </div>
    );
  }

  render () {
    return (
      <DeformWrapper
        formId={this.props.formId}
        execute={this.props.executeProcess}>
        {
          this.props.workflow.selectedProcessInputs.map((elem, i) => {
            return (
              <div key={i}>
                {this.makeInput(elem)}
              </div>
            );
          })
        }
      </DeformWrapper>
    );
  }
}
