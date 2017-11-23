import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import * as classes from './BigColorPalette.scss';

/*
this component show the current preferences for the selected dataset's variable
it should allow the user to update the preferences for the variable

we should validate that the min is lower than the max before propagating the new values
 */
export default class BigColorPalette extends React.Component {
  static propTypes = {
    selectedColorPalette: React.PropTypes.object.isRequired,
    variableMin: React.PropTypes.string.isRequired,
    variableMax: React.PropTypes.string.isRequired,
    setVariableMin: React.PropTypes.func.isRequired,
    setVariableMax: React.PropTypes.func.isRequired
  };
  constructor (props) {
    super(props);
    this.changeMin = this.changeMin.bind(this);
    this.changeMax = this.changeMax.bind(this);
  }

  changeMin (event) {
    this.props.setVariableMin(event.target.value);
  }

  changeMax (event) {
    this.props.setVariableMax(event.target.value);
  }

  render () {
    return (
      <Grid className={classes.BigColorPalette}>
        <Row>
          <Col xs={2} md={1} mdOffset={2}>
            <div className={classes.BoundaryInput}>
              <TextField
                fullWidth
                id="variable-min"
                onChange={this.changeMin}
                value={this.props.variableMin} />
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
                onChange={this.changeMax}
                value={this.props.variableMax} />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
