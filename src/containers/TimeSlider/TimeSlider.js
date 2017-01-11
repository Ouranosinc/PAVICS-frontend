import React from 'react'
import { connect } from 'react-redux'
require('rc-slider/assets/index.css');
import classes from './TimeSlider.scss'
import Slider  from 'rc-slider';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon } from 'react-bootstrap'
import Loader from '../../components/Loader';

const gap = 1000;

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
    this._onChangedMonthSlider = this._onChangedMonthSlider.bind(this);
    this._onSelectedDay = this._onSelectedDay.bind(this);
    this._onSelectedHour = this._onSelectedHour.bind(this);
    this._onSelectedMinute = this._onSelectedMinute.bind(this);
    this.state = {
      current: '1960-05-01',
      stepLength: 10,
      stepGranularity: 'minute',
      stepSpeed: 1,
      firstYear: 1900,
      lastYear: 2020,
      marksYears: {
        1900: '1900',
        1940: '1940',
        1980: '1980',
        2020: '2020'
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedWMSLayerDetails && nextProps.selectedWMSLayerDetails.data && (nextProps.selectedWMSLayerDetails.data !== this.props.selectedWMSLayerDetails.data)) {
      this.changeYearRange(nextProps.selectedWMSLayerDetails.data);
    }

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

      console.log('gap: ' + gap);

      marksYears[lastYear] = lastYear;
    }
    this.setState({
      firstYear: firstYear,
      lastYear: lastYear,
      marksYears: marksYears
    });
    console.log('layer details arrived!!');
    console.log('datesWithData: ' + selectedWMSLayerDetailsData.datesWithData);
  }

  changeTimesteps(selectedWMSLayerTimestepsData){
    // TODO TIMESTEPS FOR HOURS/MINUTES
    console.log('timesteps arrived!!');
  }

  render() {
    let marksMonths = {};
    marksMonths[new Date(2016, 1, 1).valueOf() / gap] = 'Jan';
    marksMonths[new Date(2016, 2, 1).valueOf() / gap] = 'Feb';
    marksMonths[new Date(2016, 3, 1).valueOf() / gap] = 'Mar';
    marksMonths[new Date(2016, 4, 1).valueOf() / gap] = 'Apr';
    marksMonths[new Date(2016, 5, 1).valueOf() / gap] = 'May';
    marksMonths[new Date(2016, 6, 1).valueOf() / gap] = 'Jun';
    marksMonths[new Date(2016, 7, 1).valueOf() / gap] = 'Jul';
    marksMonths[new Date(2016, 8, 1).valueOf() / gap] = 'Aug';
    marksMonths[new Date(2016, 9, 1).valueOf() / gap] = 'Sept';
    marksMonths[new Date(2016, 10, 1).valueOf() / gap] = 'Oct';
    marksMonths[new Date(2016, 11, 1).valueOf() / gap] = 'Nov';
    marksMonths[new Date(2016, 12, 1).valueOf() / gap] = 'Dec';
    return(
      <div className={classes['TimeSlider']}>
        <Form className={classes['CurrentDateTime']} inline>
          <ControlLabel>
            Current Date Time:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl type="text" placeholder="Current" value={this.state.current} onChange={this._onChangedCurrentDate}/>
          </FormGroup>
          {/*<FormGroup className={classes['InlineFormGroup']}>
           <FormControl componentClass="select" placeholder="Day" onChange={this._onSelectedDay}>
           <option value="">Day</option>
           <option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           </FormControl>
           </FormGroup>*/}
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Hour" onChange={this._onSelectedHour}>
              <option value="">Hr.</option>
                {[...Array(24)].map((x, i) => <option key={i} value={(i<10)?'0'+i:i}>{(i<10)?'0'+i:i}</option>)}
            </FormControl>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Minute" onChange={this._onSelectedMinute}>
              <option value="">Min.</option>
              <option value="1">00</option>
              <option value="2">15</option>
              <option value="2">30</option>
              <option value="2">45</option>
            </FormControl>
          </FormGroup>
        </Form>
        <Col sm={12}>
          <Slider tipFormatter={(v) => {
            let date = new Date(v * 1000); // * 1000 To divide by 1000 the number of values
            // console.log(date); //Logged date is 1 month early than what's returned by date.getMonth() (????)
            // Same problem with moment.js
            return ((date.getMonth() === 0)? "12": date.getMonth()) +"/" + date.getDate();
          }}
                  className={classes['SliderMonths']}
                  min={new Date(2016, 1, 1).valueOf()/gap}
                  max={new Date(2016, 12, 31).valueOf()/gap}
                  marks={marksMonths}
                  included={false}
                  range={false}
                  defaultValue={new Date(2016, 1, 1).valueOf()/gap}
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
                  defaultValue={1960}
                  onChange={this._onChangedYearSlider}
          />
        </Col>
        <Form className={classes['StepControls']} inline>
          <ControlLabel>
            Time steps:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl style={{width:'90px'}} type="number" placeholder="Number" value={this.state.stepLength} onChange={this._onChangedStepLength}/>
          </FormGroup>
          <ControlLabel>
            Granularity:
          </ControlLabel>
          <FormGroup className={classes['InlineFormGroup']}>
            <FormControl componentClass="select" placeholder="Granularity Level" onChange={this._onChangedStepGranularity}>
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
            <FormControl componentClass="select" placeholder="Speed Level" onChange={this._onChangedStepSpeed}>
              <option value="">Choose</option>
              <option value="slow">slow</option>
              <option value="medium">medium</option>
              <option value="fast">fast</option>
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
            <Button onClick={this._onClickedStepControls.bind(this, 'play')}>
              <Glyphicon glyph="play" />
            </Button>
          </FormGroup>
          <FormGroup className={classes['InlineFormGroup']}>
            <Button onClick={this._onClickedStepControls.bind(this, 'pause')}>
              <Glyphicon glyph="pause" />
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
        new Date(values[0] * gap),
        new Date(values[1] * gap)
      ];
      console.log("[" +
        (((dates[0].getMonth() === 0)? "12": dates[0].getMonth()) +"/" + dates[0].getDate()) + ", " +
        (((dates[1].getMonth() === 0)? "12": dates[1].getMonth()) +"/" + dates[1].getDate()) + "]");
    }else{
      // Only one
      let date = new Date(values * gap);
      console.log(((date.getMonth() === 0)? "12": date.getMonth()) +"/" + date.getDate());
    }

  }

  _onChangedYearSlider(value) {
    console.log(value);
  }

  _onChangedCurrentDate (event) {
    this.setState({ current: event.target.value });
    console.log('Changed current datetime: ' + event.target.value);
    // TODO: Complete
    // TODO: Validate user input with allowed time steps & available data
    // Actually the input could be informational only
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


  _onSelectedHour (event) {
    console.log("Hour selected: " + event.target.value);
    // TODO: Complete
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
    console.log("Step controls clicked: " + key);
    // TODO: Complete
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
