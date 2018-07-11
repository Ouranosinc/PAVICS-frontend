import React from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import Loader from './../../components/Loader';
import Card from'@material-ui/core/Card';
import CardHeader from'@material-ui/core/CardHeader';

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
  width: 550
};

class TimeSeriesChart extends React.Component {
  static propTypes = {
    visualize: PropTypes.object.isRequired,
    visualizeActions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this._bindRef = this._bindRef.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const { nextCurrentScalarValue, nextPlotlyData } = nextProps.visualize;
    const { currentDisplayedDataset, plotlyData } = this.props.visualize;
    if (nextCurrentScalarValue && nextCurrentScalarValue.data && nextCurrentScalarValue.data.variable &&
      nextCurrentScalarValue.data !== this.props.visualize.currentScalarValue.data) {
      if (currentDisplayedDataset && currentDisplayedDataset['opendap_url'].length) {
        let opendapUrl = currentDisplayedDataset['opendap_url'][0];
        let variable = nextCurrentScalarValue.data.variable;
        this.props.visualizeActions.fetchPlotlyData(
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

    if (nextPlotlyData && nextPlotlyData.data && nextPlotlyData.data !== plotlyData.data) {
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
    const { plotlyData } = this.props.visualize;
    // We merge this.props.plotlyData.layout with predefined LAYOUT
    let layout = JSON.parse(JSON.stringify(plotlyData.layout));
    for (let propName in LAYOUT) {
      if (LAYOUT.hasOwnProperty(propName)) {
        layout[propName] = LAYOUT[propName];
      }
    }
    Plotly.plot(this.container, plotlyData.data, layout, { displayModeBar: false });
  }

  _bindRef (node) {
    this.container = node;
  }

  render () {
    const { currentScalarValue, plotlyData } = this.props.visualize;
    let content = null;
    if (currentScalarValue.data && currentScalarValue.data._dimensions && plotlyData.layout && plotlyData.layout.title) {
      content =
        <Card>
          <CardHeader
            title={plotlyData.layout.title.split('/')[plotlyData.layout.title.split('/').length - 1]}
            subtitle={`Latitude: ${currentScalarValue.data._dimensions.lat.value} / Longitude: ${currentScalarValue.data._dimensions.lon.value}`}
          />
        </Card>;
    } else if (plotlyData.isFetching || currentScalarValue.isFetching) {
      content = <Loader name="chart" />;
    } else if (!currentScalarValue.data || !currentScalarValue.data._dimensions) {
      content = null;
    }
    return (
      <div className={classes['Chart']}>
        {content}
        <div className={((plotlyData.isFetching || currentScalarValue.isFetching) &&
          (!currentScalarValue.data || !currentScalarValue.data._dimensions)) ? 'hidden' : ''}>
          <div id="plotly" ref={this._bindRef}></div>
        </div>
      </div>
    );
  }
}
export default TimeSeriesChart;
