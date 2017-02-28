import React from 'react';
import Plotly from 'plotly.js';
import Paper from 'material-ui/Paper';
class PlotlyWrapper extends React.Component {
  static propTypes = {
    panelControls: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    layout: React.PropTypes.object.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    /*
    this.data = [
      {
        x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
        y: [1, 3, 6],
        type: 'scatter'
      }
    ];
    */
    this._bindRef = this._bindRef.bind(this);
  }

  componentDidMount () {
    Plotly.plot(this.container, this.props.data, this.props.layout, { displayModeBar: false });
  }

  componentDidUpdate () {
    this.container.data = this.props.data;
    this.container.layout = {
      autosize: false,
      showlegend: false,
      height: 300,
      width: 450,
      margin: {
        l: 50,
        r: 10,
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

  _bindRef (node) {
    this.container = node;
  }

  render () {
    console.log('rendering plotly wrapper');
    return (
      <Paper zDepth={0}>
        <div id="plotly" ref={this._bindRef}></div>
      </Paper>
    );
  }
}
export default PlotlyWrapper;
