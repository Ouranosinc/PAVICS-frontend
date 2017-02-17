import React from 'react';
import { connect } from 'react-redux';
require('rc-slider/assets/index.css');
import classes from './TimeSlider.scss';
import Slider  from 'rc-slider';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon } from 'react-bootstrap'
import Loader from '../../components/Loader';
import Paper from 'material-ui/Paper';

/* Constants */
const DIVIDER = 100000;
/* Step controls actions */
const FAST_BACKWARD_ACTION = 'fast-backward';
const FAST_FORWARD_ACTION = 'fast-forward';
const PAUSE_ACTION = 'pause';
const PLAY_ACTION = 'play';
const STEP_BACKWARD_ACTION = 'step-backward';
const STEP_FORWARD_ACTION = 'step-forward';
/* Time values */
const DAY_VALUE = 'day';
const HOUR_VALUE = 'hour';
const MINUTE_VALUE = 'minute';
const MONTH_VALUE = 'month';
const YEAR_VALUE = 'year';

export class TimeSlider extends React.Component {
  static propTypes = {
    monthsRange: React.PropTypes.bool.isRequired,
    yearsRange: React.PropTypes.bool.isRequired,
    currentDateTime: React.PropTypes.string.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired,
    fetchWMSLayerDetails: React.PropTypes.func.isRequired,
    fetchWMSLayerTimesteps: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this._onChangedCurrentDate = this._onChangedCurrentDate.bind(this);
    this._onChangedStepGranularity = this._onChangedStepGranularity.bind(this);
    this._onChangedStepLength = this._onChangedStepLength.bind(this);
    this._onChangedStepSpeed = this._onChangedStepSpeed.bind(this);
    this._onChangedMonthSlider = this._onChangedMonthSlider.bind(this);
    this._onChangedYearSlider = this._onChangedYearSlider.bind(this);
    this._onSelectedTime = this._onSelectedTime.bind(this);
    this.state = {
      currentDate: props.currentDateTime.substring(0, 10),
      currentMonthDay: props.currentDateTime.substring(11, 15),
      currentTime: props.currentDateTime.substring(11, 24),
      currentYear: 1900,
      firstDay: 1,
      firstMonth: 1,
      firstYear: 1900,
      lastDay: 31,
      lastYear: 2020,
      lastMonth: 12,
      isPlaying: false,
      marksYears: {
        1900: '1900',
        1940: '1940',
        1980: '1980',
        2020: '2020'
      },
      stepLength: 1,
      stepGranularity: DAY_VALUE,
      stepSpeed: 5000,
      timesteps: ['00:00:00.000Z']
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedDatasetCapabilities && nextProps.selectedDatasetCapabilities !== this.props.selectedDatasetCapabilities) {
      let capabilities = nextProps.selectedDatasetCapabilities;
      let url = capabilities['Service']['OnlineResource'];
      let layer = capabilities['Capability']['Layer']['Layer'][0]['Layer'][0];
      let layerName = layer['Name'];
      let date = layer['Dimension'][0].values.split('/')[0];
      // TODO MAKE THIS WORK!!!
      this.props.fetchWMSLayerDetails(url, layerName);
      this.props.fetchWMSLayerTimesteps(url, layerName, date);
    }

    if (nextProps.selectedWMSLayerDetails && nextProps.selectedWMSLayerDetails.data && (nextProps.selectedWMSLayerDetails.data !== this.props.selectedWMSLayerDetails.data)) {
      this.changeGlobalRange(nextProps.selectedWMSLayerDetails.data);
    }

    // TODO DISABLE SOME MONTHS/YEARS IF NO DATA
    if (nextProps.selectedWMSLayerTimesteps && nextProps.selectedWMSLayerTimesteps.data &&
      (nextProps.selectedWMSLayerTimesteps.data !== this.props.selectedWMSLayerTimesteps.data)) {
      this.changeTimesteps(nextProps.selectedWMSLayerTimesteps.data);
    }
  }

  changeGlobalRange (selectedWMSLayerDetailsData) {
    let yearArr = [];
    let firstYear = this.state.firstYear;
    let lastYear = this.state.lastYear;
    let marksYears = {};

    for (let year in selectedWMSLayerDetailsData.datesWithData) {
      yearArr.push(year);
    }
    yearArr.sort();
    firstYear = parseInt(yearArr[0]);
    lastYear = parseInt(yearArr[yearArr.length - 1]);
    if (yearArr <= 10) {
      yearArr.forEach((year) => {
        marksYears[year] = year;
      });
    } else {
      marksYears[firstYear] = firstYear;

      // Following algorithm works but is subject to rendering mismatch if min/max is near defined gaps
      // Find appropriate year gap between marks (5-10-25-100)
      let distance = lastYear - firstYear;
      let gap = 0;
      if (distance <= 200) {
        if (distance <= 75) {
          if (distance <= 40) {
            gap = 5;
          } else {
            gap = 10;
          }
        } else {
          gap = 25;
        }
      } else {
        gap = 100;
      }

      // Find first multiple
      let found = false;
      let i = 0;
      let firstMultiple = 0;
      while (!found) {
        if (((firstYear + i) % gap) === 0) {
          found = true;
          firstMultiple = firstYear + i;
        }
        i++;
      }

      // Add marks in between extremities
      let j = firstMultiple;
      while (j < lastYear) {
        marksYears[j] = j;
        j = j + gap;
      }

      marksYears[lastYear] = lastYear;
    }
    // TODO SET CURRENTDATE AND CURRENTMONTHDAY CORRECTLY
    this.setState({
      currentDate: `${this.props.currentDateTime.substring(0, 10)}`,
      currentMonthDay: `${this.props.currentDateTime.substring(4, 10)}`,
      // currentTime: `${this.props.currentDateTime.substring(3, 7)}`,
      currentYear: firstYear,
      firstYear: firstYear,
      lastYear: lastYear,
      marksYears: marksYears
    });
  }

  changeTimesteps (selectedWMSLayerTimestepsData){
    // CALCULATE TIME STEP
    // TODO TIMESTEPS FOR HOURS/MINUTES
    console.log('timesteps arrived!!');
    let currentTime = this.state.currentTime;
    if (selectedWMSLayerTimestepsData.timesteps && selectedWMSLayerTimestepsData.timesteps.length) {
      currentTime = selectedWMSLayerTimestepsData.timesteps[0];
    }
    this.setState({
      timesteps: selectedWMSLayerTimestepsData.timesteps,
      currentTime: currentTime
    });
    console.log(`current time is now ${currentTime}`);
  }

  changeCurrentDateTime () {
    this.props.setCurrentDateTime(`${this.state.currentYear}-${this.state.currentMonthDay}T${this.state.currentTime}`);
  }

  render () {
    let marksMonths = {};
    marksMonths[new Date(this.state.currentYear, 1, 1).valueOf() / DIVIDER] = 'Jan';
    marksMonths[new Date(this.state.currentYear, 2, 1).valueOf() / DIVIDER] = 'Feb';
    marksMonths[new Date(this.state.currentYear, 3, 1).valueOf() / DIVIDER] = 'Mar';
    marksMonths[new Date(this.state.currentYear, 4, 1).valueOf() / DIVIDER] = 'Apr';
    marksMonths[new Date(this.state.currentYear, 5, 1).valueOf() / DIVIDER] = 'May';
    marksMonths[new Date(this.state.currentYear, 6, 1).valueOf() / DIVIDER] = 'Jun';
    marksMonths[new Date(this.state.currentYear, 7, 1).valueOf() / DIVIDER] = 'Jul';
    marksMonths[new Date(this.state.currentYear, 8, 1).valueOf() / DIVIDER] = 'Aug';
    marksMonths[new Date(this.state.currentYear, 9, 1).valueOf() / DIVIDER] = 'Sept';
    marksMonths[new Date(this.state.currentYear, 10, 1).valueOf() / DIVIDER] = 'Oct';
    marksMonths[new Date(this.state.currentYear, 11, 1).valueOf() / DIVIDER] = 'Nov';
    marksMonths[new Date(this.state.currentYear, 12, 1).valueOf() / DIVIDER] = 'Dec';
    return (
      <Paper className={classes['TimeSlider']}>
        <Form className={classes['CurrentDateTime']} inline>
          <ControlLabel>
            Date:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl type="text" placeholder="Current" value={this.state.currentDate} onChange={this._onChangedCurrentDate}/>
          </FormGroup>

          <ControlLabel>
            Time:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Hour" value={this.state.currentTime.substring(0,7)} onChange={this._onSelectedTime}>
              {
                (this.state.timesteps && this.state.timesteps.length)?
                  this.state.timesteps.map((x) => <option key={x} value={x}>{x.substring(0,8)}</option>):
                  <option value="00:00:00.000Z">00:00:00</option>
              }
            </FormControl>
          </FormGroup>
          <ControlLabel>
            Current Date Time:
          </ControlLabel>
          <strong style={{ fontWeigth: 'bold'}}> {this.props.currentDateTime.substring(0, 10)} {this.props.currentDateTime.substring(11, 19)}</strong>
        </Form>
        <Col sm={12}>
          <Slider tipFormatter={(v) => {
            let date = new Date(v * DIVIDER);
            // Same problem with moment.js
            return ((date.getMonth() === 0)? '12': date.getMonth()) +'/' + date.getDate();
          }}
            className={classes['SliderMonths']}
            min={new Date(this.state.currentYear, 1, 1).valueOf() / DIVIDER}
            max={new Date(this.state.currentYear, 12, 31).valueOf() / DIVIDER}
            marks={marksMonths}
            included={false}
            range={false}
            value={new Date(this.state.currentYear, this.state.currentMonthDay.substring(0, 2), this.state.currentMonthDay.substring(3, 5)).valueOf() / DIVIDER}
            onChange={this._onChangedMonthSlider}
          />
        </Col>
        <Col sm={12}>
          <Slider className={classes['SliderYears']}
            min={this.state.firstYear}
            max={this.state.lastYear}
            marks={this.state.marksYears}
            range={false}
            included={false}
            value={this.state.currentYear}
            defaultValue={1900}
            onChange={this._onChangedYearSlider}
          />
        </Col>
        <Form className={classes['StepControls']} inline>
          <ControlLabel>
            Time steps:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl style={{width: '90px'}} type="number" placeholder="Number" value={this.state.stepLength} onChange={this._onChangedStepLength} />
          </FormGroup>
          <ControlLabel>
            Granularity:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Granularity Level" value={this.state.stepGranularity} onChange={this._onChangedStepGranularity}>
              <option value={MINUTE_VALUE}>minute(s)</option>
              <option value={HOUR_VALUE}>hour(s)</option>
              <option value={DAY_VALUE}>day(s)</option>
              <option value={MONTH_VALUE}>month(s)</option>
              <option value={YEAR_VALUE}>year(s)</option>
            </FormControl>
          </FormGroup>
          <ControlLabel>
            Speed:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Speed Level" value={this.state.stepSpeed} onChange={this._onChangedStepSpeed}>
              <option value="10000">super slow</option>
              <option value="5000">slow</option>
              <option value="3000">medium</option>
              <option value="1000">fast</option>
            </FormControl>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, 'fast-backward')}>
              <Glyphicon glyph="fast-backward" />
            </Button>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, 'step-backward')}>
              <Glyphicon glyph="step-backward" />
            </Button>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, PLAY_ACTION)}>
              <Glyphicon glyph={PLAY_ACTION} />
            </Button>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, PAUSE_ACTION)}>
              <Glyphicon glyph={PAUSE_ACTION} />
            </Button>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, 'step-forward')}>
              <Glyphicon glyph="step-forward" />
            </Button>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, 'fast-forward')}>
              <Glyphicon glyph="fast-forward" />
            </Button>
          </FormGroup>
        </Form>
      </Paper>
    );
  }

  _onChangedMonthSlider (values) {
    if (values[0]) {
      // Datetime range
      let dates = [
        new Date(values[0] * DIVIDER),
        new Date(values[1] * DIVIDER)
      ];
      console.log('[' +
        (((dates[0].getMonth() === 0) ? '12' : dates[0].getMonth()) + '-' + dates[0].getDate()) + ', ' +
        (((dates[1].getMonth() === 0) ? '12' : dates[1].getMonth()) + '-' + dates[1].getDate()) + ']');
    } else {
      // Only one
      let date = new Date(values * DIVIDER);
      let month = date.getMonth();
      let day = date.getDate();
      let monthDay = ((month === 0) ? '12' : (month < 10 ? '0' + month : month)) + '-' + (day < 10 ? '0' + day : day);
      this.setState({
        currentMonthDay: monthDay,
        currentDate: `${this.state.currentYear}-${monthDay}`
      }, () => this.changeCurrentDateTime());
      console.log(monthDay);
    }
  }

  _onChangedYearSlider (values) {
    if (values[0]) {
      // TODO: Year range
    } else {
      this.setState({
        currentYear: values,
        currentDate: `${values}-${this.state.currentMonthDay}`
      }, () => this.changeCurrentDateTime());
      console.log(values);
    }
  }

  _onChangedCurrentDate (event) {
    this.setState({currentDate: event.target.value});
    if (event.target.value.length === 10) {
      console.log('Changed manually current datetime: ' + event.target.value);
      this.setState({
        currentYear: event.target.value.substring(0, 4),
        currentMonthDay: event.target.value.substring(5, 10)
      }, () => this.changeCurrentDateTime());
    }
  }

  _onChangedStepLength (event) {
    this.setState({ stepLength: event.target.value });
    console.log('Step length changed: ' + event.target.value);
  }

  _onChangedStepGranularity (event) {
    this.setState({ stepGranularity: event.target.value });
    console.log('Step granularity changed: ' + event.target.value);
  }

  _onChangedStepSpeed (event) {
    this.setState({ stepSpeed: event.target.value });
    console.log('Step speed changed: ' + event.target.value);
  }

  _onSelectedTime (event) {
    console.log('Time selected: ' + event.target.value);
    this.setState({currentTime: event.target.value}, () => this.changeCurrentDateTime());
    // TODO: Complete
  }

  _onClickedStepControls (key) {
    switch (key) {
      case FAST_BACKWARD_ACTION:
      case FAST_FORWARD_ACTION:
        break;
      case PAUSE_ACTION:
        this.setState({isPlaying: false});
        // TODO: Destroy Play Loop, IT'S IMPORTANT
        break;
      case PLAY_ACTION:
        this.setState({isPlaying: true});
        this.playLoop(true);
        break;
      case STEP_BACKWARD_ACTION:
        this.moveOneStep(false);
        break;
      case STEP_FORWARD_ACTION:
        this.moveOneStep(true);
        break;
      default:
        break;
    }
    console.log('Step controls clicked: ' + key);
  }

  playLoop (first) {
    setTimeout(() => {
      this.moveOneStep(true);
      if (this.state.isPlaying) {
        this.playLoop(false);
      }
    }, (first) ? 0: this.state.stepSpeed)
  }

  dispatchCurrentDateTime (dateStringified){
    this.setState ({
      currentDate: dateStringified.substring(0, 10),
      currentMonthDay: dateStringified.substring(5, 10),
      currentTime: dateStringified.substring(11, 24),
      currentYear: dateStringified.substring(0, 4)
    }, () => this.changeCurrentDateTime());
  }

  moveOneStep (forward = true) {
    let date = new Date(this.props.currentDateTime);
    let stepLength = parseInt(this.state.stepLength);
    switch (this.state.stepGranularity) {
      case MINUTE_VALUE:
        if (forward) date.setMinutes(date.getMinutes() + stepLength);
        else date.setMinutes(date.getMinutes() - stepLength);
        break;
      case HOUR_VALUE:
        if (forward) date.setHours(date.getHours() + stepLength);
        else date.setHours(date.getHours() - stepLength);
        break;
      case DAY_VALUE:
        // Work-around
        if (forward) date.setHours(date.getHours() + (stepLength * 24));
        else date.setHours(date.getHours() - (stepLength * 24));
        break;
      case MONTH_VALUE:
        if (forward) date.setMonth(date.getMonth() + stepLength);
        else date.setMonth(date.getMonth() - stepLength);
        break;
      case YEAR_VALUE:
        if (forward) date.setFullYear(date.getFullYear() + stepLength);
        else date.setFullYear(date.getFullYear() - stepLength);
        break;
      default:
        break;
    }
    // date.setHours(date.getHours() - 6); // TODO: Dynamise added hours
    let newdate = date.toISOString();
    this.dispatchCurrentDateTime(newdate);
  }

}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeSlider);
