import React from 'react';
import { connect } from 'react-redux';
import * as constants from './../../constants';
require('rc-slider/assets/index.css');
import classes from './TimeSlider.scss';
import Slider  from 'rc-slider';
import { Col, Row} from 'react-bootstrap'
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import AccessTimeIcon from 'material-ui/svg-icons/device/access-time';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import ForwardIcon from 'material-ui/svg-icons/av/skip-next';
import BackwardIcon from 'material-ui/svg-icons/av/skip-previous';
import FastForwardIcon from 'material-ui/svg-icons/av/fast-forward';
import FastBackwardIcon from 'material-ui/svg-icons/av/fast-rewind';
import MinimizeIcon from 'material-ui/svg-icons/content/remove';

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

const DEFAULT_STATE = {
  disabled: true,
  maxDatetime: '2020-12-31T00:00:00.000Z',
  minDatetime: '1900-01-01T00:00:00.000Z',
  currentDate: '1900-01-01', // props.currentDateTime.substring(0, 10),
  currentMonthDay: '01-01', // props.currentDateTime.substring(5, 10),
  currentTime: '00:00:00.000Z', // props.currentDateTime.substring(11, 24),
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

export class TimeSlider extends React.Component {
  static propTypes = {
    // Not sure why monthsRange and yearsRange, but maybe for future range selection?
    monthsRange: React.PropTypes.bool.isRequired,
    yearsRange: React.PropTypes.bool.isRequired,
    currentDateTime: React.PropTypes.string.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    selectedDatasetCapabilities: React.PropTypes.object.isRequired,
    selectedWMSLayerDetails: React.PropTypes.object.isRequired,
    selectedWMSLayerTimesteps: React.PropTypes.object.isRequired,
    setCurrentDateTime: React.PropTypes.func.isRequired,
    onToggleMapPanel: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._onChangedCurrentDate = this._onChangedCurrentDate.bind(this);
    this._onChangedStepGranularity = this._onChangedStepGranularity.bind(this);
    this._onChangedStepLength = this._onChangedStepLength.bind(this);
    this._onChangedStepSpeed = this._onChangedStepSpeed.bind(this);
    this._onChangedMonthSlider = this._onChangedMonthSlider.bind(this);
    this._onChangedYearSlider = this._onChangedYearSlider.bind(this);
    this._onHideTimeSliderPanel = this._onHideTimeSliderPanel.bind(this);
    this._onSelectedTime = this._onSelectedTime.bind(this);
    this.state = DEFAULT_STATE;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentDateTime && nextProps.currentDateTime !== this.props.currentDateTime) {
      this.setState(
        {
          currentDate: nextProps.currentDateTime.substring(0, 10),
          currentMonthDay: nextProps.currentDateTime.substring(5, 10),
          currentTime: nextProps.currentDateTime.substring(11, 24),
          currentYear: nextProps.currentDateTime.substring(0, 4)
        }
      );
    }
    if (nextProps.selectedDatasetLayer && nextProps.selectedDatasetLayer !== this.props.selectedDatasetLayer && !nextProps.selectedDatasetLayer['dataset_id']) {
      this.setState(DEFAULT_STATE);
    }
  }

  // TODO DELETE
  componentDidUpdate (prevProps, prevState) {
    // Context: We have two async fetch requests and we have no idea which one will be proceeded first
    // And we need both values to be fetched to calculate ranges and steps
    if (this.props.selectedWMSLayerDetails && this.props.selectedWMSLayerDetails.data &&
      (this.props.selectedWMSLayerDetails.data !== prevProps.selectedWMSLayerDetails.data)) {
      if (!this.props.selectedWMSLayerDetails.isFetching && !this.props.selectedWMSLayerTimesteps.isFetching) {
        if (this.props.selectedWMSLayerDetails.data.datesWithData) {
          this.changeGlobalRange();
          this.changeTimesteps();
          this.setState({disabled: false});
        } else {
          this.setState(DEFAULT_STATE);
        }
      }
      // TODO DISABLE SOME MONTHS/YEARS IF MISSING DATA
    }

    if (this.props.selectedWMSLayerTimesteps && this.props.selectedWMSLayerTimesteps.data &&
      (this.props.selectedWMSLayerTimesteps.data !== prevProps.selectedWMSLayerTimesteps.data)) {
      if (!this.props.selectedWMSLayerDetails.isFetching && !this.props.selectedWMSLayerTimesteps.isFetching) {
        if (this.props.selectedWMSLayerDetails.data.datesWithData) {
          this.changeGlobalRange();
          this.changeTimesteps();
          this.setState({disabled: false});
        } else {
          this.setState(DEFAULT_STATE);
        }
      }
      // TODO DISABLE SOME MONTHS/YEARS IF MISSING DATA
    }
  }

  _onHideTimeSliderPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_TIME_SLIDER_PANEL);
  }

  // TODO duplicated in OLComponent
  findDimension (dimensions, dimensionName) {
    for (let i = 0; i < dimensions.length; i++) {
      if (dimensions[i]['name'] === dimensionName) {
        return dimensions[i];
      }
    }
  }

  parseTimeDimensionString (boundDates) {
    let realDates = {};
    for (let i = 0, nb = boundDates.length; i !== nb; i++) {
      let year = boundDates[i].substr(0, 4);
      realDates[year] = true;
    }
    return Object.keys(realDates);
  }

  changeGlobalRange () {
    let layerDetails = this.props.selectedWMSLayerDetails.data;
    let timeSteps = this.props.selectedWMSLayerTimesteps.data.timesteps;

    // Define MIN and MAX dataset datetime values
    let year = Object.keys(layerDetails.datesWithData)[0];
    let monthObj = layerDetails.datesWithData[year];
    let month = Object.keys(monthObj)[0];
    let day = monthObj[month][0];
    let realMonth = parseInt(month) + 1;
    let realDay = parseInt(day);
    realMonth = (realMonth < 10) ? '0' + realMonth : realMonth.toString();
    realDay = (realDay < 10) ? '0' + realDay : realDay.toString();
    this.setState({
      minDatetime: `${year}-${realMonth}-${realDay}T${timeSteps[0]}`,
      maxDatetime: layerDetails.nearestTimeIso
    });

    let marksYears = {};
    let yearArr = [];
    for (let year in layerDetails.datesWithData) {
      yearArr.push(parseInt(year));
    }
    yearArr.sort();

    let firstYear = parseInt(yearArr[0]);
    let lastYear = parseInt(yearArr[yearArr.length - 1]);
    if (yearArr <= 10) {
      yearArr.forEach(
        (year) => {
          marksYears[year] = year;
        }
      );
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
    this.setState(
      {
        currentDate: this.props.currentDateTime.substring(0, 10),
        currentMonthDay: this.props.currentDateTime.substring(5, 10),
        currentTime: `${this.props.currentDateTime.substring(11, 24)}`,
        currentYear: firstYear,
        firstYear: firstYear,
        lastYear: lastYear,
        marksYears: marksYears
      }
    );
  }

  changeTimesteps () {
    let datesWithData = this.props.selectedWMSLayerDetails.data.datesWithData;
    let timeSteps = this.props.selectedWMSLayerTimesteps.data.timesteps;
    let stepLength = 1;
    let stepGranularity = DAY_VALUE;

    // Calculate steps length and granularity based on timesteps OR datesWithData
    if (timeSteps.length) {
      if (timeSteps.length > 24) {
        // Minutes
        stepGranularity = MINUTE_VALUE;
        stepLength = Math.round(60 / (Math.round(timeSteps.length) / 24));
      } else if (timeSteps.length >= 2 && timeSteps.length < 24) {
        // Hours
        stepGranularity = HOUR_VALUE;
        stepLength = Math.round(24 / timeSteps.length);
      } else {
        // Exactly one day
        stepGranularity = DAY_VALUE;
        stepLength = 1;
      }
    } else {
      let yearObj = datesWithData[Object.keys(datesWithData)[0]];
      if (Object.keys(yearObj).length < 12) {
        // Months
        stepGranularity = MONTH_VALUE;
        stepLength = Math.round(12 / Object.keys(yearObj).length);
      } else {
        let monthObj = yearObj[Object.keys(yearObj)[0]];
        if (monthObj.length < 30) {
          // Days
          stepGranularity = DAY_VALUE;
          stepLength = Math.round(30 / monthObj.length);
        } else {
          // Years
          stepGranularity = YEAR_VALUE;
          stepLength = 1; // TODO Support multiple years frequency?
        }
      }
    }

    let currentTime = this.state.currentTime;
    if (timeSteps && timeSteps.length) {
      currentTime = timeSteps[0];
    }
    this.setState(
      {
        stepLength: stepLength,
        stepGranularity: stepGranularity,
        timesteps: timeSteps,
        currentTime: currentTime
      }
    );
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
        <AppBar
          title="Temporal Slider"
          iconElementLeft={<IconButton><AccessTimeIcon /></IconButton>}
          iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideTimeSliderPanel()} /></IconButton>} />
        <div className="container">
          <Row>
            <Col md={4} lg={4}>
              <TextField
                disabled={this.state.disabled}
                value={this.state.currentDate}
                hintText="Format 9999-99-99"
                fullWidth={true}
                onChange={(event, value) => this._onChangedCurrentDate(value)}
                floatingLabelText="Current Date" />
            </Col>
            <Col md={4} lg={4}>
              <SelectField
                value={this.state.currentTime}
                fullWidth={true}
                floatingLabelText="Time"
                onChange={(event, index, value) => this._onSelectedTime(value)}>
                 {
                  (this.state.timesteps && this.state.timesteps.length) ?
                  this.state.timesteps.map((x) => {return <MenuItem key={x} value={x} primaryText={x.substring(0, 8)} />; }) :
                  <MenuItem value="00:00:00.000Z" primaryText="00:00:00" />
                }
              </SelectField>
            </Col>
            <Col md={4} lg={4}>
              <TextField
                value={this.props.currentDateTime.substring(0, 10) + ' ' + this.props.currentDateTime.substring(11, 19)}
                hintText="Format 9999-99-99 00:00:00"
                fullWidth={true}
                disabled={true}
                floatingLabelText="Current Datetime" />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Slider
                tipFormatter={(v) => {
                  let date = new Date(v * DIVIDER);
                  // Same problem with moment.js
                  return ((date.getMonth() === 0) ? '12' : date.getMonth()) + '/' + date.getDate();
                }}
                className={classes['SliderMonths']}
                min={new Date(this.state.currentYear, 1, 1).valueOf() / DIVIDER}
                max={new Date(this.state.currentYear, 12, 31).valueOf() / DIVIDER}
                marks={marksMonths}
                included={false}
                range={false}
                value={new Date(
                  this.state.currentYear, this.state.currentMonthDay.substring(0, 2), this.state.currentMonthDay.substring(3, 5)
                ).valueOf() / DIVIDER}
                onChange={this._onChangedMonthSlider}
              />
            </Col>
          </Row>
          <Row>
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
          </Row>
          <Row className={classes['StepControls']}>
            <Col md={4} lg={4}>
              <TextField
                type="number"
                value={this.state.stepLength}
                onChange={(event, value) => this._onChangedStepLength(value)}
                hintText="Number"
                fullWidth={true}
                floatingLabelText="Timestep Length" />
            </Col>
            <Col md={4} lg={4}>
              <SelectField
                value={this.state.stepGranularity}
                fullWidth={true}
                floatingLabelText="Timestep Granularity Level"
                onChange={(event, index, value) => this._onChangedStepGranularity(value)}>
                <MenuItem value={MINUTE_VALUE} primaryText="minute(s)" />
                <MenuItem value={HOUR_VALUE} primaryText="hour(s)" />
                <MenuItem value={DAY_VALUE} primaryText="day(s)" />
                <MenuItem value={MONTH_VALUE} primaryText="month(s)" />
                <MenuItem value={YEAR_VALUE} primaryText="year(s)" />
              </SelectField>
            </Col>
            <Col md={4} lg={4}>
              <SelectField
                value={this.state.stepSpeed}
                fullWidth={true}
                floatingLabelText="Play Speed Level"
                onChange={(event, index, value) => this._onChangedStepSpeed(value)}>
                <MenuItem value={10000} primaryText="super slow" />
                <MenuItem value={5000} primaryText="slow" />
                <MenuItem value={3000} primaryText="medium" />
                <MenuItem value={1000} primaryText="fast" />
              </SelectField>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <RaisedButton
                disabled={this.state.minDatetime === this.props.currentDateTime}
                primary={true}
                icon={<FastBackwardIcon />}
                style={{margin: '0 5px 0 5px', width: '13%'}}
                onClick={this._onClickedStepControls.bind(this, FAST_BACKWARD_ACTION)} />
              <RaisedButton
                disabled={this.state.minDatetime === this.props.currentDateTime}
                primary={true}
                icon={<BackwardIcon />}
                style={{margin: '0 5px 0 5px', width: '13%'}}
                onClick={this._onClickedStepControls.bind(this, STEP_BACKWARD_ACTION)} />
              <RaisedButton
              primary={true}
              icon={<PlayIcon />}
              style={{margin: '0 5px 0 5px', width: '19%'}}
              onClick={this._onClickedStepControls.bind(this, PLAY_ACTION)} />
              <RaisedButton
                primary={true}
                icon={<PauseIcon />}
                style={{margin: '0 5px 0 5px', width: '19%'}}
                onClick={this._onClickedStepControls.bind(this, PAUSE_ACTION)} />
              <RaisedButton
                disabled={this.state.maxDatetime === this.props.currentDateTime}
                primary={true}
                icon={<ForwardIcon />}
                style={{margin: '0 5px 0 5px', width: '13%'}}
                onClick={this._onClickedStepControls.bind(this, STEP_FORWARD_ACTION)} />
              <RaisedButton
                disabled={this.state.maxDatetime === this.props.currentDateTime}
                primary={true}
                icon={<FastForwardIcon />}
                style={{margin: '0 5px 0 5px', width: '13%'}}
                onClick={this._onClickedStepControls.bind(this, FAST_FORWARD_ACTION)} />
            </Col>
          </Row>
        </div>
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
      console.log(
        '[' +
        (((dates[0].getMonth() === 0) ? '12' : dates[0].getMonth()) + '-' + dates[0].getDate()) + ', ' +
        (((dates[1].getMonth() === 0) ? '12' : dates[1].getMonth()) + '-' + dates[1].getDate()) + ']'
      );
    } else {
      // Only one
      let date = new Date(values * DIVIDER);
      let month = date.getMonth();
      let day = date.getDate();
      let monthDay = ((month === 0) ? '12' : (month < 10 ? '0' + month : month)) + '-' + (day < 10 ? '0' + day : day);
      this.setState(
        {
          currentMonthDay: monthDay,
          currentDate: `${this.state.currentYear}-${monthDay}`
        }, () => this.changeCurrentDateTime()
      );
    }
  }

  _onChangedYearSlider (values) {
    if (values[0]) {
      // TODO: Year range
    } else {
      this.setState(
        {
          currentYear: values,
          currentDate: `${values}-${this.state.currentMonthDay}`
        }, () => this.changeCurrentDateTime()
      );
    }
  }

  _onChangedCurrentDate (value) {
    this.setState(
      {
        currentDate: value
      });
    if (value.length === 10) {
      this.setState(
        {
          currentYear: value.substring(0, 4),
          currentMonthDay: value.substring(5, 10)
        }, () => this.changeCurrentDateTime()
      );
    }
  }

  _onChangedStepLength (value) {
    this.setState(
      {
        stepLength: value
      });
  }

  _onChangedStepGranularity (value) {
    this.setState(
      {
        stepGranularity: value
      });
  }

  _onChangedStepSpeed (value) {
    this.setState(
      {
        stepSpeed: value
      });
  }

  _onSelectedTime (value) {
    this.setState(
      {
        currentTime: value
      },
      () => this.changeCurrentDateTime()
    );
  }

  _onClickedStepControls (key) {
    switch (key) {
      case FAST_BACKWARD_ACTION:
        this.dispatchCurrentDateTime(this.state.minDatetime);
        break;
      case FAST_FORWARD_ACTION:
        this.dispatchCurrentDateTime(this.state.maxDatetime);
        break;
      case PAUSE_ACTION:
        this.setState(
          {
            isPlaying: false
          });
        break;
      case PLAY_ACTION:
        this.setState(
          {
            isPlaying: true
          });
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
  }

  playLoop (first) {
    setTimeout(
      () => {
        this.moveOneStep(true);
        console.log('looping');
        if (this.state.isPlaying) {
          this.playLoop(false);
        }
      }, (first) ? 0 : this.state.stepSpeed
    );
  }

  dispatchCurrentDateTime (dateStringified) {
    this.setState(
      {
        currentDate: dateStringified.substring(0, 10),
        currentMonthDay: dateStringified.substring(5, 10),
        currentTime: dateStringified.substring(11, 24),
        currentYear: dateStringified.substring(0, 4)
      }, () => this.changeCurrentDateTime()
    );
  }

  moveOneStep (forward = true) {
    let date = new Date(this.props.currentDateTime);
    let stepLength = parseInt(this.state.stepLength);
    switch (this.state.stepGranularity) {
      case MINUTE_VALUE:
        if (forward) {
          date.setMinutes(date.getMinutes() + stepLength);
        } else {
          date.setMinutes(date.getMinutes() - stepLength);
        }
        break;
      case HOUR_VALUE:
        if (forward) {
          date.setHours(date.getHours() + stepLength);
        } else {
          date.setHours(date.getHours() - stepLength);
        }
        break;
      case DAY_VALUE:
        // Work-around
        if (forward) {
          date.setHours(date.getHours() + (stepLength * 24));
        } else {
          date.setHours(date.getHours() - (stepLength * 24));
        }
        break;
      case MONTH_VALUE:
        if (forward) {
          date.setMonth(date.getMonth() + stepLength);
        } else {
          date.setMonth(date.getMonth() - stepLength);
        }
        break;
      case YEAR_VALUE:
        if (forward) {
          date.setFullYear(date.getFullYear() + stepLength);
        } else {
          date.setFullYear(date.getFullYear() - stepLength);
        }
        break;
      default:
        break;
    }
    let dateStringified = date.toISOString();
    if (forward && date.valueOf() <= new Date(this.state.maxDatetime).valueOf()) {
      this.dispatchCurrentDateTime(dateStringified);
    } else if (!forward && date.valueOf() >= new Date(this.state.minDatetime).valueOf()) {
      this.dispatchCurrentDateTime(dateStringified);
    } else if (forward) {
      this.dispatchCurrentDateTime(this.state.maxDatetime);
      console.log('New step forward request is out of dataset range (too late). Targeted MAX dataset date.');
    } else {
      this.dispatchCurrentDateTime(this.state.minDatetime);
      console.log('New step backward request is out of dataset range (too early). Targeted MIN dataset date.');
    }
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
