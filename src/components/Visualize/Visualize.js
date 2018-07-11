import React from 'react';
import PropTypes from 'prop-types';
import classes from './Visualize.scss';
import OLComponent from '../OLComponent';
import SpeedDialMenu from '../SpeedDialMenu'
import TimeSlider from '../TimeSlider';
import InformationPanel from '../InformationPanel';
import LayerSwitcher from '../LayerSwitcher';
import TimeSeriesChart from './../TimeSeriesChart';
import MapControls from './../MapControls';
import { constants } from './../../redux/modules/Widgets';
import BigColorPalette from '../BigColorPalette/BigColorPalette';

class Visualize extends React.Component {
  static propTypes = {
    sectionActions: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    visualize: PropTypes.object.isRequired,
    visualizeActions:  PropTypes.object.isRequired,
    widgets:  PropTypes.object.isRequired,
    widgetsActions:  PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
  }

  componentDidMount() {

  }

  render () {
    return (
      <div>
        <div className={classes['Visualize']}>
          <div className={classes['mapContainer']}>
            <OLComponent
              visualize={this.props.visualize}
              visualizeActions={this.props.visualizeActions} />
          </div>
          <BigColorPalette
            visualize={this.props.visualize}
            visualizeActions={this.props.visualizeActions} />
          <SpeedDialMenu widgets={this.props.widgets}
                         widgetsActions={this.props.widgetsActions} />
          <div className={classes['left']}>
            {
              (this.props.widgets.info) ?
                <div className={classes['panel']}>
                  <InformationPanel
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_INFO_KEY)}
                    currentScalarValue={this.props.visualize.currentScalarValue} />
                </div>
              : null
            }
            {
              (this.props.widgets.chart) ?
                <div className={classes['panel']}>
                    <TimeSeriesChart
                      currentScalarValue={this.props.visualize.currentScalarValue}
                      currentDisplayedDataset={this.props.visualize.currentDisplayedDataset}
                      onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_CHART_KEY)}
                      plotlyData={this.props.visualize.plotlyData}
                      fetchPlotlyData={this.props.visualizeActions.fetchPlotlyData}
                    />
                </div>
                : null
            }
            {
              (this.props.widgets.layerSwitcher)?
                <div className={classes['panel']}>
                  <LayerSwitcher
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_LAYER_SWITCHER_KEY)}
                    visualize={this.props.visualize}
                    visualizeActions={this.props.visualizeActions} />
                </div>
                : null
            }
            {
              (this.props.widgets.timeSlider)?
                <div className={classes['panel']}>
                  <TimeSlider
                    monthsRange={false}
                    yearsRange={false}
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_TIME_SLIDER_KEY)}
                    visualize={this.props.visualize}
                    visualizeActions={this.props.visualizeActions} />
                </div>
                : null
            }
            {
              (this.props.widgets.mapControls)?
                <div className={classes['panel']} style={{clear: 'left'}}>
                  <MapControls
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_MAP_CONTROLS_KEY)}
                    visualize={this.props.visualize}
                    visualizeActions={this.props.visualizeActions} />
                </div>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Visualize;
