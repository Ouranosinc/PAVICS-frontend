import React from 'react';
import Plotly from 'plotly.js';
import classes from './TimeSeriesChart.scss';
import * as constants from './../../constants';
import Loader from './../../components/Loader';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import TimelineIcon from 'material-ui/svg-icons/action/timeline';
import MinimizeIcon from 'material-ui/svg-icons/content/remove';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const LAYOUT = {
  // autosize: false,
  // showlegend: false,
  title: '',
  margin: {
    l: 60,
    r: 20,
    b: 50,
    t: 20,
    pad: 4
  },
  paper_bgcolor: 'inherit',
  plot_bgcolor: 'inherit',
  height: 351,
  width: 650
};

class TimeSeriesChart extends React.Component {
  static propTypes = {
    currentScalarValue: React.PropTypes.object.isRequired,
    selectedDatasetLayer: React.PropTypes.object.isRequired,
    onToggleMapPanel: React.PropTypes.func.isRequired,
    plotlyData: React.PropTypes.object.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._bindRef = this._bindRef.bind(this);
    this._onHideChartPanel = this._onHideChartPanel.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.currentScalarValue.data && nextProps.currentScalarValue.data.variable && nextProps.currentScalarValue.data !== this.props.currentScalarValue.data) {
      if (this.props.selectedDatasetLayer && this.props.selectedDatasetLayer['opendap_urls'].length) {
        let opendapUrl = this.props.selectedDatasetLayer['opendap_urls'][0];
        let variable = nextProps.currentScalarValue.data.variable;
        this.props.fetchPlotlyData(
          opendapUrl,
          variable['name'],
          0,
          1000000000,
          variable['_indices']['lat'],
          variable['_indices']['lat'] + 1,
          variable['_indices']['lon'],
          variable['_indices']['lon'] + 1);
      }
    }

    if (nextProps.plotlyData.data && nextProps.plotlyData.data !== this.props.plotlyData.data) {
      this.container.data = nextProps.plotlyData.data;
      // We merge this.props.plotlyData.layout with predefined LAYOUT
      this.container.layout = JSON.parse(JSON.stringify(nextProps.plotlyData.layout));
      for (let propName in LAYOUT) {
        if (LAYOUT.hasOwnProperty(propName)) {
          this.container.layout[propName] = LAYOUT[propName];
        }
      }
      Plotly.redraw(this.container);
      Plotly.Plots.resize(this.container);
    }
  }

  componentDidMount () {
    // We merge this.props.plotlyData.layout with predefined LAYOUT
    let layout = JSON.parse(JSON.stringify(this.props.plotlyData.layout));
    for (let propName in LAYOUT) {
      if (LAYOUT.hasOwnProperty(propName)) {
        layout[propName] = LAYOUT[propName];
      }
    }
    Plotly.plot(this.container, this.props.plotlyData.data, layout, { displayModeBar: false });
  }

  _onHideChartPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_CHART_PANEL);
  }

  _bindRef (node) {
    this.container = node;
  }

  render () {
    let card = null;
    if (this.props.currentScalarValue.data && this.props.plotlyData.layout) {
      card = (<Card>
        <CardHeader
          title={this.props.plotlyData.layout.title.split('/')[this.props.plotlyData.layout.title.split('/').length - 1]}
          subtitle={`Latitude: ${this.props.currentScalarValue.data._dimensions.lat.value} / Longitude: ${this.props.currentScalarValue.data._dimensions.lon.value}`}
        />
      </Card>);
    }
    return (
      <Paper className={classes['TimeSeriesChart']}>
        <AppBar
          title="Time Series Chart"
          iconElementLeft={<IconButton><TimelineIcon /></IconButton>}
          iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideChartPanel()} /></IconButton>} />
        <div style={{height: '422px', width: '650px', opacity: '0.9'}}>
          {
            (this.props.plotlyData.isFetching || this.props.currentScalarValue.isFetching) ? <Loader name="chart" /> : null
          }
          <div className={this.props.plotlyData.isFetching || this.props.currentScalarValue.isFetching ? 'hidden' : ''}>
            {card}
            <div id="plotly" ref={this._bindRef}></div>
          </div>
        </div>
      </Paper>
    );
  }
}
export default TimeSeriesChart;
