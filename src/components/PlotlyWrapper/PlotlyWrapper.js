import React from 'react';
import Plotly from 'plotly.js';
import * as constants from './../../routes/Visualize/constants';
class PlotlyWrapper extends React.Component {
  static propTypes = {
    panelControls: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    layout: React.PropTypes.object.isRequired,
    fetchPlotlyData: React.PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.props.fetchPlotlyData('PCP', 124, 360, 100, 101, 130, 131);
    this._bindRef = this._bindRef.bind(this);
  }

  componentDidMount () {
    Plotly.plot(this.container, this.props.data, this.props.layout);
  }

  componentDidUpdate () {
    this.container.data = this.props.data;
    this.container.layout = this.props.layout;
    Plotly.redraw(this.container);
    Plotly.Plots.resize(this.container);
  }

  _bindRef (node) {
    this.container = node;
  }

  render () {
    return (
      <div className={this.props.panelControls[constants.PANEL_PLOTLY].show ? '' : 'hidden'}>
        <div id="plotly" ref={this._bindRef}></div>
      </div>
    );
  }
}
export default PlotlyWrapper;
