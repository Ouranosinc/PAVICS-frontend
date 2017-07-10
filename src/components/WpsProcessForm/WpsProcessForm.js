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
    formId: React.PropTypes.string.isRequired,
    selectedProcess: React.PropTypes.object.isRequired,
    selectedProcessInputs: React.PropTypes.array.isRequired,
    selectedProcessValues: React.PropTypes.object.isRequired,
    // keep the handleSelected[...] func for now, might use it later
    handleSelectedProcessValueChange: React.PropTypes.func.isRequired,
    executeProcess: React.PropTypes.func.isRequired,
    selectedProvider: React.PropTypes.string.isRequired,
    goToSection: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedRegions: React.PropTypes.array.isRequired
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
    this.state = {
      formData: {}
    };
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
      ...this.state,
      formData: {
        ...this.state.formData,
        [elem.id]: elem.value
      }
    });
  }

  makeInput (input) {
    switch (input.dataType) {
      case BOOLEAN:
        // TODO Default Boolean value
        {/*checked={this.state.formData[input.name] === "True"}*/}
        return (
          <div>
            <Checkbox
              id={input.name}
              name={input.name}
              label={input.title}
              labelPosition="right"
              labelStyle={{textAlign: "left"}}
              value={this.state.formData[input.name]}
              onCheck={this._onSelectRow} />
            <small>{input.description}</small>
          </div>
        );
      case NETCDF:
        return (
          <div>
            <input type="hidden" name="__start__" value="resource:sequence" />
            <TextField
              id={LABEL_NETCDF}
              name={LABEL_NETCDF}
              fullWidth={true}
              defaultValue={this.state.formData[LABEL_NETCDF]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
            <input type="hidden" name="__end__" value="resource:sequence" />
          </div>
        );
      case STRING:
        if (input.name === 'typename') {
          return (
            <div>
              <TextField
                id={LABEL_SHAPEFILE}
                name={LABEL_SHAPEFILE}
                fullWidth={true}
                defaultValue={this.state.formData[LABEL_SHAPEFILE]}
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
                name={LABEL_FEATURE_IDS}
                fullWidth={true}
                defaultValue={this.state.formData[LABEL_FEATURE_IDS]}
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
              fullWidth={true}
              defaultValue={this.state.formData[input.name]}
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
              fullWidth={true}
              defaultValue={this.state.formData[input.name]}
              onChange={(event, value) => this.handleChange(event)}
              hintText={input.description}
              floatingLabelText={input.title} />
          </div>
        );
    }
  }

  render () {
    return (
      <DeformWrapper
        formId={this.props.formId}
        execute={this.props.executeProcess}
        selectedProcessIdentifier={this.props.selectedProcess.identifier}
        selectedProvider={this.props.selectedProvider}>
        {
          this.props.selectedProcessInputs.map((elem, i) => {
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
