import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import * as classes from './BigColorPalette.scss';
import * as constants from '../../constants';
import {NotificationManager} from 'react-notifications';

/*
this component show the current preferences for the selected dataset's variable
it should allow the user to update the preferences for the variable

we should validate that the min is lower than the max before propagating the new values

we must allow for user to write the number they wish, then change the state with the value once they press enter
on input
  update local value state
on enter
  validate value (valid number?, min is lower than max)
  compare local value state to props values
  if they differ
    fire store update
on external changes
  if external values differ from local values
    update inputs values

 */
export default class BigColorPalette extends React.Component {
  static propTypes = {
    variablePreference: React.PropTypes.object,
    selectedColorPalette: React.PropTypes.object.isRequired,
    setVariablePreferenceBoundaries: React.PropTypes.func.isRequired
  };
  constructor (props) {
    super(props);
    this.changeMin = this.changeMin.bind(this);
    this.changeMax = this.changeMax.bind(this);
    this.catchReturn = this.catchReturn.bind(this);
    this.state = {
      localMin: '',
      localMax: ''
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.variablePreference) {
      if (this.props.variablePreference !== nextProps.variablePreference) {
        this.setState({
          ...this.state,
          localMin: nextProps.variablePreference.min,
          localMax: nextProps.variablePreference.max
        });
      }
    }
  }

  changeMin (event) {
    this.setState({
      ...this.state,
      localMin: event.target.value
    });
  }

  changeMax (event) {
    this.setState({
      ...this.state,
      localMax: event.target.value
    });
  }

  catchReturn (event) {
    if (event.key === constants.KEY_ENTER) {
      if (this.state.localMin < this.state.localMax) {
        this.props.setVariablePreferenceBoundaries(this.state.localMin, this.state.localMax);
      } else {
        NotificationManager.error('Please input valid min max values (min should be smaller than max).');
      }
    }
  }

  render () {
    if (this.props.variablePreference) {
      return (
        <Grid className={classes.BigColorPalette}>
          <Row>
            <Col xs={2} md={1} mdOffset={2}>
              <div className={classes.BoundaryInput}>
                <TextField
                  fullWidth
                  id="variable-min"
                  onKeyPress={this.catchReturn}
                  onChange={this.changeMin}
                  value={this.state.localMin} />
              </div>
            </Col>
            <Col xs={8} md={6}>
              <div className={classes.ImageContainer} style={{backgroundImage: `url(${this.props.selectedColorPalette.bigUrl})`}}>
                {this.props.selectedColorPalette.name}
              </div>
            </Col>
            <Col xs={2} md={1}>
              <div className={classes.BoundaryInput}>
                <TextField
                  fullWidth
                  id="variable-max"
                  onKeyPress={this.catchReturn}
                  onChange={this.changeMax}
                  value={this.state.localMax} />
              </div>
            </Col>
          </Row>
        </Grid>
      );
    }
    return null;
  }
}
