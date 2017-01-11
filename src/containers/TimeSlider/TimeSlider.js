import React from 'react'
import { connect } from 'react-redux'
require('rc-slider/assets/index.css');
import classes from './TimeSlider.scss'
import Slider  from 'rc-slider';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon } from 'react-bootstrap'
import Loader from '../../components/Loader';

const DIVIDER = 1000;
const FAST_BACKWARD_ACTION = 'fast-backward';
const FAST_FORWARD_ACTION = 'fast-forward';
const PAUSE_ACTION = 'pause';
const PLAY_ACTION = 'play';
const STEP_BACKWARD_ACTION = 'step-backward';
const STEP_FORWARD_ACTION = 'step-forward';

export class TimeSlider extends React.Component {
  static propTypes = {
    // selectedWMSLayerDetails: React.PropTypes.object.isRequired,
    // selectedWMSLayerTimesteps: React.PropTypes.object.isRequired,
    monthsRange: React.PropTypes.bool.isRequired,
    yearsRange: React.PropTypes.bool.isRequired,
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
    this._onSelectedDay = this._onSelectedDay.bind(this);
    this._onSelectedHour = this._onSelectedHour.bind(this);
    this._onSelectedMinute = this._onSelectedMinute.bind(this);
    this.state = {
      currentDate: props.currentDateTime.substring(0, 10),
      currentMonthDay: '01-01',
      currentYear: 1900,
      currentTime: props.currentDateTime.substring(11, 24),
      firstYear: 1900,
      isPlaying: false,
      lastYear: 2020,
      marksYears: {
        1900: '1900',
        1940: '1940',
        1980: '1980',
        2020: '2020'
      },
      stepLength: 1,
      stepGranularity: 'minute',
      stepSpeed: 5000,
      timesteps: ["00:00:00.000Z"]
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedWMSLayerDetails && nextProps.selectedWMSLayerDetails.data && (nextProps.selectedWMSLayerDetails.data !== this.props.selectedWMSLayerDetails.data)) {
      this.changeYearRange(nextProps.selectedWMSLayerDetails.data);
    }

    //TODO DISABLE SOME MONTHS/YEARS IF NO DATA

    if (nextProps.selectedWMSLayerTimesteps && nextProps.selectedWMSLayerTimesteps.data && (nextProps.selectedWMSLayerTimesteps.data !== this.props.selectedWMSLayerTimesteps.data)) {
      this.changeTimesteps(nextProps.selectedWMSLayerTimesteps.data)
    }
  }

  changeYearRange(selectedWMSLayerDetailsData) {
    let yearArr = [],
        firstYear = 1900,
        lastYear = 2000,
        marksYears = {};
    for(let year in selectedWMSLayerDetailsData.datesWithData){
      yearArr.push(year);
    }
    yearArr.sort();
    firstYear = parseInt(yearArr[0]);
    lastYear = parseInt(yearArr[yearArr.length-1]);
    if(yearArr <= 10){
      yearArr.forEach((year) => {
        marksYears[year] = year;
      })
    }else {
      marksYears[firstYear] = firstYear;

      // Following algorithm works but is subject to rendering mismatch if min/max is near defined gaps
      // Find appropriate year gap between marks (5-10-25-100)
      let distance = lastYear - firstYear;
      let gap = 0;
      if(distance <= 200){
        if(distance <= 75){
          if(distance <= 40){
            gap = 5;
          }else{
            gap = 10;
          }
        }else{
          gap = 25;
        }
      }else{
        gap = 100;
      }

      // Find first multiple
      let found = false;
      let i = 0;
      let firstMultiple = 0;
      while(!found){
        let test = firstYear + i;
        let test2 = test % gap;
        if(((firstYear + i )% gap) === 0){
          found = true;
          firstMultiple = firstYear + i;
        }
        i++;
      }

      // Add marks in between extremities
      let j = firstMultiple;
      while(j < lastYear){
        marksYears[j] = j;
        j = j+gap;
      }

      marksYears[lastYear] = lastYear;
    }
    //TODO SET CURRENTDATE AND CURRENTMONTHDAY CORRECTLY
    this.setState({
      currentDate: `${firstYear}-01-01`,
      currentYear: firstYear,
      firstYear: firstYear,
      lastYear: lastYear,
      marksYears: marksYears
    });
  }

  changeTimesteps(selectedWMSLayerTimestepsData){
    //CALCULATE TIME STEP
    // TODO TIMESTEPS FOR HOURS/MINUTES
    this.setState({
      timesteps: selectedWMSLayerTimestepsData.timesteps
    });
    console.log('timesteps arrived!!');
  }

  changeCurrentDateTime(){
    this.props.setCurrentDateTime(`${this.state.currentYear}-${this.state.currentMonthDay}T${this.state.currentTime}`);
  }

  render() {
    let marksMonths = {};
    marksMonths[new Date(2016, 1, 1).valueOf() / DIVIDER] = 'Jan';
    marksMonths[new Date(2016, 2, 1).valueOf() / DIVIDER] = 'Feb';
    marksMonths[new Date(2016, 3, 1).valueOf() / DIVIDER] = 'Mar';
    marksMonths[new Date(2016, 4, 1).valueOf() / DIVIDER] = 'Apr';
    marksMonths[new Date(2016, 5, 1).valueOf() / DIVIDER] = 'May';
    marksMonths[new Date(2016, 6, 1).valueOf() / DIVIDER] = 'Jun';
    marksMonths[new Date(2016, 7, 1).valueOf() / DIVIDER] = 'Jul';
    marksMonths[new Date(2016, 8, 1).valueOf() / DIVIDER] = 'Aug';
    marksMonths[new Date(2016, 9, 1).valueOf() / DIVIDER] = 'Sept';
    marksMonths[new Date(2016, 10, 1).valueOf() / DIVIDER] = 'Oct';
    marksMonths[new Date(2016, 11, 1).valueOf() / DIVIDER] = 'Nov';
    marksMonths[new Date(2016, 12, 1).valueOf() / DIVIDER] = 'Dec';
    return(
      <div className={classes['TimeSlider']}>
        <Form className={classes['CurrentDateTime']} inline>
          <ControlLabel>
            Current Date Time:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl type="text" placeholder="Current" value={this.state.currentDate} onChange={this._onChangedCurrentDate}/>
          </FormGroup>
          {/*<FormGroup className={classes['InlineFormGroup']}>
           <FormControl componentClass="select" placeholder="Day" onChange={this._onSelectedDay}>
           <option value="">Day</option>
           <option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           </FormControl>
           </FormGroup>*/}

          <ControlLabel>
            Time:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Hour" value={this.state.currentTime} onChange={this._onSelectedTime}>
              {
                (this.state.timesteps && this.state.timesteps.length)?
                  this.state.timesteps.map((x) => <option key={x} value={x}>{x}</option>):
                  <option value="00:00:00.000Z">00:00:00.000Z</option>
              }
            </FormControl>
          </FormGroup>

          {/*<FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Hour" onChange={this._onSelectedHour}>
              <option value="">Hr.</option>
                {[...Array(24)].map((x, i) => <option key={i} value={(i<10)?'0'+i:i}>{(i<10)?'0'+i:i}</option>)}
            </FormControl>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Minute" onChange={this._onSelectedMinute}>
              <option value="">Min.</option>
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </FormControl>
          </FormGroup>*/}
        </Form>
        <Col sm={12}>
          <Slider tipFormatter={(v) => {
            let date = new Date(v * 1000); // * 1000 To divide by 1000 the number of values
            // console.log(date); //Logged date is 1 month early than what's returned by date.getMonth() (????)
            // Same problem with moment.js
            return ((date.getMonth() === 0)? "12": date.getMonth()) +"/" + date.getDate();
          }}
                  className={classes['SliderMonths']}
                  min={new Date(2016, 1, 1).valueOf()/DIVIDER}
                  max={new Date(2016, 12, 31).valueOf()/DIVIDER}
                  marks={marksMonths}
                  included={false}
                  range={false}
                  defaultValue={new Date(2016, 1, 1).valueOf()/DIVIDER}
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
            <FormControl disabled style={{width:'90px'}} type="number" placeholder="Number" value={this.state.stepLength} onChange={this._onChangedStepLength}/>
          </FormGroup>
          <ControlLabel>
            Granularity:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl disabled componentClass="select" placeholder="Granularity Level" onChange={this._onChangedStepGranularity}>
              <option value="">Choose</option>
              <option value="minute">minutes</option>
              <option value="hour">hours</option>
              <option value="day">days</option>
              <option value="month">months</option>
              <option value="year">years</option>
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
      </div>
    )
  }

  _onChangedMonthSlider(values) {
    if(values[0]){
      //Datetime range
      let dates = [
        new Date(values[0] * DIVIDER),
        new Date(values[1] * DIVIDER)
      ];
      console.log("[" +
        (((dates[0].getMonth() === 0)? "12": dates[0].getMonth()) +"-" + dates[0].getDate()) + ", " +
        (((dates[1].getMonth() === 0)? "12": dates[1].getMonth()) +"-" + dates[1].getDate()) + "]");
    }else{
      // Only one
      let date = new Date(values * DIVIDER);
      let month = date.getMonth();
      let day = date.getDate();
      let monthDay = ((month === 0)? "12": (month < 10 ? '0'+month : month)) +"-" + (day < 10 ? '0'+day : day);
      this.setState({
        currentMonthDay: monthDay,
        currentDate: `${this.state.currentYear}-${monthDay}`
      }, () => this.changeCurrentDateTime());
      console.log(monthDay);
    }

  }

  _onChangedYearSlider(values) {
    if(values[0]){
      //TODO: Year range
    }else{
      this.setState({currentYear: values}, () => this.changeCurrentDateTime());
      console.log(values);
    }
  }

  _onChangedCurrentDate (event) {
    this.setState({currentDate: event.target.value});
    if(event.target.value.length === 10){
      console.log('Changed manually current datetime: ' + event.target.value);
      this.setState({
        currentYear: event.target.value.substring(0,4),
        currentMonthDay: event.target.value.substring(5,10)
      }, () => this.changeCurrentDateTime());
    }
  }

  _onChangedStepLength (event) {
    this.setState({ stepLength: event.target.value });
    console.log("Step length changed: " + event.target.value);
  }

  _onChangedStepGranularity (event) {
    this.setState({ stepGranularity: event.target.value });
    console.log("Step granularity changed: " + event.target.value);
  }

  _onChangedStepSpeed (event) {
    this.setState({ stepSpeed: event.target.value });
    console.log("Step speed changed: " + event.target.value);
  }

  _onSelectedTime (event) {
    console.log("Time selected: " + event.target.value);
    this.setState({currentTime: event.target.value}, () => this.changeCurrentDateTime());
    // TODO: Complete
  }


  _onSelectedHour (event) {
    console.log("Hour selected: " + event.target.value);
  }

  _onSelectedDay (event) {
    console.log("Day selected: " + event.target.value);
    // TODO: Complete
  }

  _onSelectedMinute (event) {
    console.log("Minute selected: " + event.target.value);
    // TODO: Complete
  }

  _onClickedStepControls (key) {
    switch(key){
      case FAST_BACKWARD_ACTION:
      case FAST_FORWARD_ACTION:
        break;
      case PAUSE_ACTION:
        this.setState({isPlaying: false});
        //TODO: Destroy Play Loop, IT'S IMPORTANT
        break;
      case PLAY_ACTION:
        this.setState({isPlaying: true});
        this.playLoop(true);
        break;
      case STEP_BACKWARD_ACTION:
        this.oneStepBackward();
        break;
      case STEP_FORWARD_ACTION:
        this.oneStepForward();
        break;
      default:
        break;
    }
    console.log("Step controls clicked: " + key);
  }

  playLoop(first) {
    setTimeout(() => {
      this.oneStepForward();
      if (this.state.isPlaying) {
        this.playLoop(false);
      }
    }, (first)? 0: this.state.stepSpeed)
  }

  dispatchCurrentDateTime(dateStringified){
    this.setState( {
      currentDate: dateStringified.substring(0, 10),
      currentMonthDay: dateStringified.substring(5, 10),
      currentTime: dateStringified.substring(11, 24),
      currentYear: dateStringified.substring(0, 4)
    }, () => this.changeCurrentDateTime());
  }

  oneStepBackward(){
    let date = new Date(this.props.currentDateTime);
    date.setHours(date.getHours() - 6); // TODO: Dynamise added hours
    this.dispatchCurrentDateTime(date.toISOString());
  }

  oneStepForward(){
    let date = new Date(this.props.currentDateTime);
    date.setHours(date.getHours() + 6); // TODO: Dynamise added hours
    this.dispatchCurrentDateTime(date.toISOString());
  }

}

const mapStateToProps = (state) => {
    return {}
  }
  ;
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeSlider)
