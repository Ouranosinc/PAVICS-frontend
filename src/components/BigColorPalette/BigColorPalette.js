import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from'@material-ui/core/TextField';
import * as constants from '../../constants';
import { NotificationManager } from 'react-notifications';

const ARBITRARY_MAX_DECIMAL_QUANTITY = 15;

const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: '60px',
    left: 0,
  },
  imageContainer: {
    backgroundSize: '100% auto',
    height: '60px',
    width: '100%',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
  boundaryInput: {
    padding: '0 7px',
    height: '60px',
    backgroundColor: theme.palette.primary.contrastText
  }
});

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
class BigColorPalette extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currentDisplayedDataset: PropTypes.object.isRequired,
    preference: PropTypes.object,
    setVariablePreferenceBoundaries: PropTypes.func.isRequired
  };

  state = {
    localMin: '0',
    localMax: '1'
  };

  constructor (props) {
    super(props);
  }

  /*
  the local min and max values are used for filling the text fields
  as such, they always will be strings, however they can arrive as integers from the backends
  here, we will cast them to strings so that the validations do not fail horribly later on
   */
  componentWillReceiveProps (nextProps) {
    const { preference } = nextProps;
    if (preference) {
      if (this.props.preference !== preference) {
        this.setState({
          localMin: (preference.min)? preference.min.toString(): '',
          localMax: (preference.max)? preference.max.toString(): ''
        });
      }
    }
  }

  changeMin = (event) => {
    this.setState({
      localMin: event.target.value
    });
  };

  changeMax = (event) => {
    this.setState({
      localMax: event.target.value
    });
  };

  persistBoundaries = () => {
    const { localMax, localMin } = this.state;

    // javascript does not handle very small numbers well which is problematic for comparison
    // we'd expect parseFloat(1e-7) to return 0.0000001 but we get 1e-7 back
    // whereas parseFloat(1e-6) returns the expected 0.000001
    let min = (localMin.indexOf('e') !== -1) ? parseFloat(localMin).toFixed(ARBITRARY_MAX_DECIMAL_QUANTITY) : localMin;
    let max = (localMax.indexOf('e') !== -1) ? parseFloat(localMax).toFixed(ARBITRARY_MAX_DECIMAL_QUANTITY) : localMax;
    if (min < max) {
      this.props.setVariablePreferenceBoundaries(localMin, localMax);
    } else {
      NotificationManager.warning('Please input valid min max values (min should be smaller than max).', 'Warning', 10000);
    }
  };

  catchReturn = (event) => {
    if (event.key === constants.KEY_ENTER) {
      this.persistBoundaries();
    }
  };

  render () {
    const { classes, currentDisplayedDataset, preference } = this.props;
    const { localMax, localMin } = this.state;

    if (preference && preference.colorPalette) {
      return (
        <Grid container spacing={24} id="cy-big-color-palette" className={classes.root}>
          <Grid item md={2}>

          </Grid>
          <Grid item xs={2} md={1}>
            <div className={classes.boundaryInput}>
              <TextField
                fullWidth
                id="variable-min"
                onKeyPress={this.catchReturn}
                onBlur={this.persistBoundaries}
                onChange={this.changeMin}
                value={localMin}
                label={`Min (${currentDisplayedDataset.units})`}/>
            </div>
          </Grid>
          <Grid item xs={8} md={6}>
            <div
              className={classes.imageContainer}
              style={{backgroundImage: `url(${__PAVICS_NCWMS_PATH__}?REQUEST=GetLegendGraphic&PALETTE=${preference.colorPalette}&COLORBARONLY=true&WIDTH=600&HEIGHT=60&VERTICAL=false)`}}>
              {preference.colorPalette}
            </div>
          </Grid>
          <Grid item xs={2} md={1}>
            <div className={classes.boundaryInput}>
              <TextField
                fullWidth
                id="variable-max"
                onKeyPress={this.catchReturn}
                onBlur={this.persistBoundaries}
                onChange={this.changeMax}
                value={localMax}
                label={`Max (${currentDisplayedDataset.units})`}/>
            </div>
          </Grid>
          <Grid item md={2}>

          </Grid>
        </Grid>
      );
    }
    return null;
  }
}

export default withStyles(styles)(BigColorPalette)
