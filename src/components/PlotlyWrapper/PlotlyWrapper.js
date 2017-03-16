import React from 'react';
import Plotly from 'plotly.js';
import classes from './PlotlyWrapper.scss';
import * as constants from './../../constants';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import TimelineIcon from 'material-ui/svg-icons/action/timeline';
import MinimizeIcon from 'material-ui/svg-icons/content/remove';

class PlotlyWrapper extends React.Component {
  static propTypes = {
    onToggleMapPanel: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired,
    layout: React.PropTypes.object.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this._bindRef = this._bindRef.bind(this);
    this._onHideChartPanel = this._onHideChartPanel.bind(this);
  }

  componentDidMount () {
    Plotly.plot(this.container, this.props.data, this.props.layout, { displayModeBar: false });
  }

  componentDidUpdate () {
    this.container.data = this.props.data;
    this.container.layout = {
      autosize: false,
      showlegend: false,
      height: 372,
      width: 650,
      margin: {
        l: 50,
        r: 20,
        b: 50,
        t: 10,
        pad: 4
      },
      paper_bgcolor: 'inherit',
      plot_bgcolor: 'inherit'
    };
    Plotly.redraw(this.container);
    Plotly.Plots.resize(this.container);
  }

  _onHideChartPanel () {
    this.props.onToggleMapPanel(constants.VISUALIZE_CHART_PANEL);
  }

  _bindRef (node) {
    this.container = node;
  }

  render () {
    console.log('rendering plotly wrapper');
    return (
      <Paper className={classes['PieMenu']}>
        <AppBar
          title="Time Series Chart"
          iconElementLeft={<IconButton><TimelineIcon /></IconButton>}
          iconElementRight={<IconButton><MinimizeIcon onTouchTap={(event) => this._onHideChartPanel()} /></IconButton>} />
        <div style={{height: '372px', width: '650px', opacity: '0.9'}} id="plotly" ref={this._bindRef}></div>
      </Paper>
    );
  }
}
export default PlotlyWrapper;
