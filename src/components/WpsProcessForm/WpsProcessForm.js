import React from 'react';
import {Form, FormGroup, Col, FormControl} from 'react-bootstrap';
import {ExecuteButton} from './../../components/WorkflowWizard';
import Paper from 'material-ui/Paper';
import classes from '../WorkflowWizard/WorkflowWizard.scss';
const BOOLEAN = '//www.w3.org/TR/xmlschema-2/#boolean';
const STRING = '//www.w3.org/TR/xmlschema-2/#string';
const NETCDF = 'ComplexData';
const LABEL_NETCDF = 'LABEL_NETCDF';
const LABEL_SHAPEFILE = 'LABEL_SHAPEFILE';
const LABEL_FEATURE_IDS = 'LABEL_FEATURE_IDS';
export default class WpsProcessForm extends React.Component {
  static propTypes = {
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


  constructor (props) {
    super(props);
    this.state = {
      formData: {}
    };
    this.execute = this.execute.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.makePostRequest = this.makePostRequest.bind(this);
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

  makePostRequest (url, data, callable, params) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (callable !== undefined) {
        callable(xhr.responseText, params);
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('accept', 'text/html');
    xhr.send(data);
  }

  handleChange (event) {
    // TODO eventually this will probably go in the global state
    // so use the handleProcessFOrmValueChange func passed in props
    let elem = event.target;
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        [elem.id]: elem.value
      }
    });
  }

  execute () {
    // ugly hack to workaround making one extra trip to the backend
    // we already have had to put strange __start__ and __end__ inputs to work nicely with phoenix
    let formData = new FormData(document.querySelector('#process-form'));
    let url = `${__PAVICS_PHOENIX_PATH__}/processes/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    // let url = `/phoenix/execute?wps=${this.props.selectedProvider}&process=${this.props.selectedProcess.identifier}`;
    this.makePostRequest(url, formData, (res) => {
      // TODO actually do something once the post have been done
      console.log(res);
    });
    // this.props.executeProcess(provider, identifier, values);
    // this.props.goToSection(constants.PLATFORM_SECTION_MONITOR);
  }

  makeInput (input) {
    switch (input.dataType) {
      case BOOLEAN:
        return (
          <div>
            <FormControl
              bsClass={classes.checkbox}
              id={input.name}
              type="checkbox"
              name={input.name} />
            <p>{input.description}</p>
          </div>
        );
      case NETCDF:
        return (
          <div>
            <input type="hidden" name="__start__" value="resource:sequence" />
            <FormControl
              name="resource"
              id={LABEL_NETCDF}
              type="text"
              onChange={this.handleChange}
              value={this.state.formData[LABEL_NETCDF]} />
            <input type="hidden" name="__end__" value="resource:sequence" />
            <p>{input.description}</p>
          </div>
        );
      case STRING:
        if (input.name === 'typename') {
          return (
            <div>
              <FormControl
                id={LABEL_SHAPEFILE}
                type="text"
                name={input.name}
                onChange={this.handleChange}
                value={this.state.formData[LABEL_SHAPEFILE]} />
              <p>{input.description}</p>
            </div>
          );
        } else if (input.name === 'featureids') {
          return (
            <div>
              <FormControl
                id={LABEL_FEATURE_IDS}
                type="text"
                name={input.name}
                onChange={this.handleChange}
                value={this.state.formData[LABEL_FEATURE_IDS]} />
              <p>{input.description}</p>
            </div>
          );
        }
        return (
          <div>
            <FormControl
              id={input.name}
              type="text"
              name={input.name}
              value={this.state.formData[input.name]}
              onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
      default:
        return (
          <div>
            <FormControl
              id={input.name}
              type="text"
              name={input.name}
              value={this.state.formData[input.name]}
              onChange={this.handleChange} />
            <p>{input.description}</p>
          </div>
        );
    }
  }

  // the form needs a submit named input to actually be executed by phoenix
  // so 1990
  render () {
    // TODO validate that async is really something we want each time
    const gridStyle = {
      'height': '450px',
      'overflowY': 'auto',
      'margin': '10px 0',
      'overflowX': 'hidden'
    };
    return (
      <Form id="process-form" horizontal>
        <Paper zDepth={2} style={gridStyle}>
          <input type="hidden" name="_charset_" value="UTF-8" />
          <input type="hidden" name="__formid__" value="deform" />
          <input type="hidden" name="_async_check" value="true" />
          {
            this.props.selectedProcessInputs.map((elem, i) => {
              return (
                <Col sm={12}>
                  <FormGroup key={i}>
                    <Col sm={2}>{elem.title}</Col>
                    <Col sm={10}>
                      {this.makeInput(elem)}
                    </Col>
                  </FormGroup>
                </Col>
              );
            })
          }
        </Paper>
        <ExecuteButton executeProcess={this.execute} />
        <input type="hidden" name="submit" value="submit" />
      </Form>
    );
  }
}
