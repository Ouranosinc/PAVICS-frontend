import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as constants from '../../constants';
require('rc-slider/assets/index.css');
import moment from 'moment';
import classes from './TimeSlider.scss';
import Slider  from 'rc-slider';
import { Col, Row} from 'react-bootstrap'
import Paper from'@material-ui/core/Paper';
import AppBar from'@material-ui/core/AppBar';
import Select from'@material-ui/core/Select';
import MenuItem from'@material-ui/core/MenuItem';
import Button from'@material-ui/core/Button';
import TextField from'@material-ui/core/TextField';
import IconButton from'@material-ui/core/IconButton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ForwardIcon from '@material-ui/icons/SkipNext';
import BackwardIcon from '@material-ui/icons/SkipPrevious';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastBackwardIcon from '@material-ui/icons/FastRewind';
import MinimizeIcon from '@material-ui/icons/Remove';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
const buttonStyle = {
  margin: '0 5px 0 5px',
  width: '18%'
};

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
  yearDataMarks: [],
  stepLength: 1,
  stepGranularity: DAY_VALUE,
  stepSpeed: 5000,
  timesteps: ['00:00:00.000Z']
};

export class TimeSlider extends React.Component {
  static propTypes = {
    // Not sure why monthsRange and yearsRange, but maybe for future range selection?
    monthsRange: PropTypes.bool.isRequired,
    yearsRange: PropTypes.bool.isRequired,
    currentDateTime: PropTypes.string.isRequired,
    currentDisplayedDataset: PropTypes.object.isRequired,
    selectedDatasetCapabilities: PropTypes.object.isRequired,
    selectedWMSLayerDetails: PropTypes.object.isRequired,
    selectedWMSLayerTimesteps: PropTypes.object.isRequired,
    setCurrentDateTime: PropTypes.func.isRequired,
    selectCurrentDisplayedDataset: PropTypes.func.isRequired,
    onToggleMapPanel: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.playLoopTimeout =  null;
    this.hasDatasetChanged = false;
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
    if(nextProps.currentDisplayedDataset && nextProps.currentDisplayedDataset !== this.props.currentDisplayedDataset ) {
      if (!nextProps.currentDisplayedDataset['dataset_id']) {
        this.setState(DEFAULT_STATE);
      }
      if (nextProps.currentDisplayedDataset['uniqueLayerSwitcherId'] !== this.props.currentDisplayedDataset['uniqueLayerSwitcherId']) {
        this.hasDatasetChanged = true;
      }
    }
  }

  componentWillUnmount(){
    this.stopPlayLoop();
  }

  componentDidMount() {
    this.init();
  }

  init() {
    if (!this.props.selectedWMSLayerDetails.isFetching && !this.props.selectedWMSLayerTimesteps.isFetching) {
      if (this.props.selectedWMSLayerDetails.data.datesWithData) {
        this.setState({disabled: false});
        if(this.hasDatasetChanged){
          this.changeGlobalRange(); // This will also triggers -­> this.dispatchCurrentDateTime (this.state.minDatetime);
          this.changeTimesteps();
          this.hasDatasetChanged = false;
        }
      }
    }else {
      this.setState({disabled: true});
    }
    // TODO DISABLE SOME MONTHS/YEARS IF MISSING DATA
  }

  componentDidUpdate (prevProps, prevState) {
    // Context: We have two async fetch requests and we have no idea which one will be proceeded first
    // And we need both values to be fetched to calculate ranges and steps
    if (this.props.selectedWMSLayerDetails && this.props.selectedWMSLayerDetails.data &&
      (this.props.selectedWMSLayerDetails.data !== prevProps.selectedWMSLayerDetails.data)) {
      this.init();
    }

    if (this.props.selectedWMSLayerTimesteps && this.props.selectedWMSLayerTimesteps.data &&
      (this.props.selectedWMSLayerTimesteps.data !== prevProps.selectedWMSLayerTimesteps.data)) {
      this.init();
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
    let minDatetime = this.props.currentDisplayedDataset.datetime_min[0];
    let maxDatetime = this.props.currentDisplayedDataset.datetime_max[this.props.currentDisplayedDataset.datetime_max.length - 1];

    // Define MIN and MAX dataset datetime values
    /*this.setState({
      minDatetime: minDatetime,
      maxDatetime: maxDatetime
    });*/

    let marksYears = {},
        firstYear = parseInt(moment.parseZone(minDatetime).year(), 10),
        lastYear = parseInt(moment.parseZone(maxDatetime).year(), 10),
        yearArr = [];

    // Load yearArr
    for (let i = firstYear; i < lastYear; ++i) {
      yearArr.push(i);
    }
    yearArr.sort(); //Useless...

    // Define disabled year's marks
    let percentageByYear = 100 / yearArr.length;
    let yearDataMarks = [];
    yearArr.forEach(year => {
      let yearBegin = moment.parseZone(`${year}-01-01`/*T00:00:00Z*/);
      let yearEnd = moment.parseZone(`${year}-12-31`/*T24:00:00Z*/);
      let found = false;
      for (let i = 0; i < this.props.currentDisplayedDataset.datetime_min.length && !found; ++i) {
        let currentFileMomentMin = moment.parseZone(this.props.currentDisplayedDataset.datetime_min[i]);
        let currentFileMomentMax = moment.parseZone(this.props.currentDisplayedDataset.datetime_max[i]);
        if ((yearBegin.isSameOrBefore(currentFileMomentMax) && yearBegin.isSameOrAfter(currentFileMomentMin)) ||
          (yearEnd.isSameOrBefore(currentFileMomentMax) && yearEnd.isSameOrAfter(currentFileMomentMin))) {
          console.log('Found data for year ' + year);
          found = true;
        }
      }
      yearDataMarks.push({
        hasData: found,
        width: percentageByYear
      })
    });
    yearDataMarks.map( x => x.width += "%");

    // Define year's marks based on number of yearArr values
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
        minDatetime: minDatetime,
        maxDatetime: maxDatetime,
        firstYear: firstYear,
        lastYear: lastYear,
        marksYears: marksYears,
        yearDataMarks: yearDataMarks,
      }
    );
    this.dispatchCurrentDateTime (minDatetime);
  }

  changeTimesteps () {
    // NOTE: Calculated timestep is based on one file datesWithData + timesteps values
    // Aggregated files should always have same timesteps
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
  }

  changeCurrentDateTime () {
    let newDateTime = `${this.state.currentYear}-${this.state.currentMonthDay}T${this.state.currentTime}`;
    if (this.props.currentDateTime !== newDateTime) {
      // console.log("New datetime provided by TimeSlider: %s", newDateTime);
      this.props.setCurrentDateTime(newDateTime);
      let currentFileMomentMin = moment.parseZone(this.props.currentDisplayedDataset.datetime_min[this.props.currentDisplayedDataset.currentFileIndex]);
      let currentFileMomentMax = moment.parseZone(this.props.currentDisplayedDataset.datetime_max[this.props.currentDisplayedDataset.currentFileIndex]);
      let currentMoment = moment.parseZone(newDateTime);
      let newCurrentFileIndex = -1;
      if(currentMoment.isAfter(currentFileMomentMax) || currentMoment.isBefore(currentFileMomentMin)){
        // Search for new matching fileIndex
        for(let i = 0; i < this.props.currentDisplayedDataset.datetime_min.length; ++i){
          currentFileMomentMin = moment.parseZone(this.props.currentDisplayedDataset.datetime_min[i]);
          currentFileMomentMax = moment.parseZone(this.props.currentDisplayedDataset.datetime_max[i]);
          if (currentMoment.isSameOrBefore(currentFileMomentMax) && currentMoment.isSameOrAfter(currentFileMomentMin)) {
            newCurrentFileIndex = i;
          }
        }
        if(newCurrentFileIndex >= 0){
          // console.log(newCurrentFileIndex);
          // this.props.selectCurrentDisplayedDataset({
          //   ...this.props.currentDisplayedDataset,
          //   currentFileIndex: newCurrentFileIndex,
          //   opacity: 0.8
          // });
        }else {
          // If not found, ncWMS won't be able to process datetime so we'll force a valid datetime (??)
          // This will force a valid newDateTime in a valid newCurrentFileIndex
          // This introduce a new bug if user manually pick an invalid date, we over-write his value ??
          // TODO If backward or forward timestep clicked.. nearest datetime is irrelevant, we know the direction
          // This is usefull actually only when a slider is activated (month-day or year)
          // TODO: LOCK one or multiple value (YEAR / MONTH-DAY)

          // let newMomentDatetime = moment.parseZone(newDateTime),
          //     nearestIndex = -1,
          //     nearestDayDiff = Number.MAX_SAFE_INTEGER,
          //     isMax = false;

          // for(let i = 0; i < this.props.currentDisplayedDataset.datetime_min.length; ++i){
          //   let currentFileMinDiff = Math.abs(newMomentDatetime.diff(moment.parseZone(this.props.currentDisplayedDataset.datetime_min[i]))),
          //       currentFileMaxDiff = Math.abs(newMomentDatetime.diff(moment.parseZone(this.props.currentDisplayedDataset.datetime_max[i])));
          //   if(currentFileMinDiff < nearestDayDiff) {
          //     isMax = false;
          //     nearestIndex = i;
          //     nearestDayDiff = currentFileMinDiff;
          //   }
          //   if(currentFileMaxDiff < nearestDayDiff) {
          //     isMax = true;
          //     nearestIndex = i;
          //     nearestDayDiff = currentFileMaxDiff;
          //   }
          // }
          // if(nearestIndex > -1) {
          //   let propertyName = (isMax)? 'datetime_max': 'datetime_min';
          //   newDateTime = this.props.currentDisplayedDataset[propertyName][nearestIndex];
          //   newCurrentFileIndex = nearestIndex;
          //   console.log('Data hole, Best match is with file index %i for date %s', nearestIndex, newDateTime);
          //   this.props.setCurrentDateTime(newDateTime);
          //
        }
        this.props.selectCurrentDisplayedDataset({
          ...this.props.currentDisplayedDataset,
          currentFileIndex: newCurrentFileIndex,
          opacity: 0.8
        });
      }else{
        // newDateTime fits current file, everything is fine just propagate newDateTime
        // console.log("New datetime provided by TimeSlider: %s", newDateTime);
        // this.props.setCurrentDateTime(newDateTime);
      }
    }
  }

  onChangedMonthSlider = (values) => {
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
      if(monthDay !== this.state.currentMonthDay || `${this.state.currentYear}-${monthDay}` !== this.state.currentDate) {
        this.setState(
          {
            currentMonthDay: monthDay,
            currentDate: `${this.state.currentYear}-${monthDay}`
          }, () => this.changeCurrentDateTime()
        );
      }
    }
  };

  onChangedYearSlider = (values) => {
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
  };

  onChangedCurrentDate = (event) => {
    const value = event.target.value;
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
  };

  onChangedStepLength = (event) => {
    this.setState(
      {
        stepLength: event.target.value
      });
  };

  onChangedStepGranularity = (event) => {
    this.setState(
      {
        stepGranularity: event.target.value
      });
  };

  onChangedStepSpeed = (event) => {
    this.setState(
      {
        stepSpeed: event.target.value
      });
  };

  onSelectedTime = (event) => {
    this.setState(
      {
        currentTime: event.target.value
      },
      () => this.changeCurrentDateTime()
    );
  };

  onClickedStepControls = (key)  => {
    switch (key) {
      case FAST_BACKWARD_ACTION:
        if(!this.state.isPlaying) this.dispatchCurrentDateTime(this.state.minDatetime);
        break;
      case FAST_FORWARD_ACTION:
        if(!this.state.isPlaying) this.dispatchCurrentDateTime(this.state.maxDatetime);
        break;
      case PAUSE_ACTION:
        if(this.state.isPlaying){
          this.stopPlayLoop();
          this.setState(
            {
              isPlaying: false
            });
        }
        break;
      case PLAY_ACTION:
        if(!this.state.isPlaying) {
          this.setState(
            {
              isPlaying: true
            });
          this.playLoop(true);
        }
        break;
      case STEP_BACKWARD_ACTION:
        if(!this.state.isPlaying) this.moveOneStep(false);
        break;
      case STEP_FORWARD_ACTION:
        if(!this.state.isPlaying) this.moveOneStep(true);
        break;
      default:
        break;
    }
  };

  stopPlayLoop(){
    clearTimeout(this.playLoopTimeout);
  }

  playLoop (first) {
    this.stopPlayLoop();
    this.playLoopTimeout = setTimeout(
      () => {
        console.log('Play loop executed');
        this.moveOneStep(true);
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
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton disableRipple color="inherit"><AccessTimeIcon /></IconButton>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Temporal Slider
            </Typography>
            <IconButton color="inherit"className="cy-minimize-btn" onClick={(event) => this._onHideTimeSliderPanel()}><MinimizeIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <div className="container" id="cy-timeslider" data-cy-enabled={!this.state.disabled}>
          <Row>
            <Col md={4} lg={4}>
              {/* helperText="Format 9999-99-99" */}
              <TextField
                disabled={this.state.disabled}
                value={this.state.currentDate}
                fullWidth
                onChange={(event) => this.onChangedCurrentDate(event)}
                label="Current Date" />
            </Col>
            <Col md={4} lg={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="time">Time</InputLabel>
                <Select
                  disabled={this.state.disabled}
                  value={this.state.currentTime}
                  inputProps={{
                    name: 'time',
                    id: 'time',
                  }}
                  onChange={(event) => this.onSelectedTime(event)}>
                   {
                    (this.state.timesteps && this.state.timesteps.length) ?
                    this.state.timesteps.map((x) => <MenuItem key={x} value={x}>{x.substring(0, 8)}</MenuItem>) :
                    <MenuItem value="00:00:00.000Z">
                      00:00:00
                    </MenuItem>
                  }
                </Select>
              </FormControl>
            </Col>
            <Col md={4} lg={4}>
              {/*helperText="Format 9999-99-99 00:00:00"*/}
              <TextField
                disabled={true}
                value={this.props.currentDateTime.substring(0, 10) + ' ' + this.props.currentDateTime.substring(11, 19)}
                fullWidth
                label="Current Datetime" />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Slider
                disabled={this.state.disabled}
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
                onChange={(values) => this.onChangedMonthSlider(values)}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Slider className={classes['SliderYears']}
                disabled={this.state.disabled}
                min={this.state.firstYear}
                max={this.state.lastYear}
                marks={this.state.marksYears}
                range={false}
                included={false}
                value={this.state.currentYear}
                defaultValue={1900}
                handleStyle={{
                  zIndex: 1000
                }}
                dotStyle={{
                  zIndex: 1000
                }}
                onChange={(values) => this.onChangedYearSlider(values)}
              />
            </Col>
            <Col sm={12} style={{height:"4px", marginTop: '-8px', zIndex: "1", pointerEvents: 'none'}}>
              {
                this.state.yearDataMarks.map((x, i) => {
                  return <span key={i} style={{height:"3px", width: x.width, background: x.hasData? 'transparent':'#8b0000', float: 'left'}}>&nbsp;</span>;
                })
              }
            </Col>
          </Row>
          <Row className={classes['StepControls']}>
            <Col md={4} lg={4}>
              <TextField
                disabled={this.state.disabled}
                type="number"
                value={this.state.stepLength}
                onChange={(event) => this.onChangedStepLength(event)}
                helperText="Number"
                fullWidth
                label="Timestep Length" />
            </Col>
            <Col md={4} lg={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="granularity-level">Timestep Granularity Level</InputLabel>
                <Select
                  disabled={this.state.disabled}
                  value={this.state.stepGranularity}
                  inputProps={{
                    name: 'granularity-level',
                    id: 'granularity-level',
                  }}
                  onChange={(event) => this.onChangedStepGranularity(event)}>
                  <MenuItem value={MINUTE_VALUE}>Minute(s)</MenuItem>
                  <MenuItem value={HOUR_VALUE}>Hour(s)</MenuItem>
                  <MenuItem value={DAY_VALUE}>Day(s)</MenuItem>
                  <MenuItem value={MONTH_VALUE}>Month(s)</MenuItem>
                  <MenuItem value={YEAR_VALUE}>Year(s)</MenuItem>
                </Select>
              </FormControl>
            </Col>
            <Col md={4} lg={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="speed-level">Play Speed Level</InputLabel>
                <Select
                  disabled={this.state.disabled}
                  value={this.state.stepSpeed}
                  inputProps={{
                    name: 'speed-level',
                    id: 'speed-level',
                  }}
                  onChange={(event) => this.onChangedStepSpeed(event)}>
                  <MenuItem value={10000}>Very Slow (10 seconds</MenuItem>
                  <MenuItem value={5000}>Slow (5 seconds)</MenuItem>
                  <MenuItem value={3000}>Medium (3 seconds)</MenuItem>
                  <MenuItem value={1000}>Fast (Every second)</MenuItem>
                </Select>
              </FormControl>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Button variant="contained"
                disabled={(this.state.minDatetime === this.props.currentDateTime) || this.state.disabled || this.state.isPlaying}
                onClick={() => this.onClickedStepControls(FAST_BACKWARD_ACTION)}
                style={buttonStyle}
                color="primary">
                <FastBackwardIcon />
              </Button>
              <Button variant="contained"
                disabled={(this.state.minDatetime === this.props.currentDateTime) || this.state.disabled || this.state.isPlaying}
                color="primary"
                style={buttonStyle}
                onClick={() => this.onClickedStepControls(STEP_BACKWARD_ACTION)}>
                <BackwardIcon />
              </Button>
              {
                (this.state.isPlaying)?
                  <Button variant="contained"
                          disabled={this.state.disabled}
                          color="primary"
                          style={buttonStyle}
                          onClick={() => this.onClickedStepControls(PAUSE_ACTION)}>
                    <PauseIcon />
                  </Button>:
                <Button variant="contained"
                        disabled={this.state.disabled}
                        color="primary"
                        style={buttonStyle}
                        onClick={() => this.onClickedStepControls(PLAY_ACTION)}>
                  <PlayIcon />
                </Button>
              }
              <Button variant="contained"
                disabled={(this.state.maxDatetime === this.props.currentDateTime) || this.state.disabled || this.state.isPlaying}
                color="primary"
                style={buttonStyle}
                onClick={() => this.onClickedStepControls(STEP_FORWARD_ACTION)}>
                <ForwardIcon />
              </Button>
              <Button variant="contained"
                disabled={(this.state.maxDatetime === this.props.currentDateTime) || this.state.disabled || this.state.isPlaying}
                color="primary"
                style={buttonStyle}
                onClick={() => this.onClickedStepControls(FAST_FORWARD_ACTION)}>
                <FastForwardIcon />
              </Button>
            </Col>
          </Row>
        </div>
      </Paper>
    );
  }
}

export default TimeSlider
