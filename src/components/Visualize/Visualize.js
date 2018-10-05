import React from 'react';
import PropTypes from 'prop-types';
import OLComponent from '../OLComponent';
import SpeedDialMenu from '../SpeedDialMenu'
import { constants } from './../../redux/modules/Widgets';
import * as labels from './../../constants';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LayersIcon from '@material-ui/icons/Layers';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Description';
import ChartIcon from '@material-ui/icons/Timeline';
import DrawIcon from '@material-ui/icons/Edit';
import VisualizeWidget from './../VisualizeWidget';
import BigColorPaletteContainer from './../../containers/BigColorPalette';
import WidgetDrawFeaturesContainer from './../../containers/WidgetDrawFeatures';
import WidgetLayerSwitcherContainer from './../../containers/WidgetLayerSwitcher';
import WidgetMapControlsContainer from './../../containers/WidgetMapControls';
import WidgetPointInformationsContainer from './../../containers/WidgetPointInformations';
import WidgetTimeSeriesContainer from './../../containers/WidgetTimeSeries';
import WidgetTimeSliderContainer from './../../containers/WidgetTimeSlider';

const OPACITY = 0.9;
const styles = {
  mapContainer: {
    zIndex: 0,
    padding: 0 ,
    margin: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  left: {
    maxWidth: '65%',
    float: 'left'
  },
  panel: {
    margin: '3px 0 0 3px',
    float: 'left',
    /*display: 'contents'*/
  },
  mapControls: {
    textAlign: 'left',
    opacity: OPACITY,
    overflow: 'hidden',
    height: '310px',
    width: '250px'
  },
  timeSlider: {
    height: '310px',
    width: '620px',
    bottom: 0,
    textAlign: 'left',
    opacity: OPACITY,
  },
  layerSwitcher: {
    width: '400px',
    bottom: 0,
    textAlign: 'left',
    opacity: OPACITY,
    height: '436px'
  },
  chart: {
    opacity: OPACITY,
    overflow: 'hidden',
    height: '310px',
    width: '500px'
  },
  info: {
    height: '310px',
    overflow: 'auto',
    width: '500px',
    opacity: OPACITY
  },
  customRegions: {
    height: '420px',
    overflow: 'auto',
    width: '400px',
    opacity: OPACITY
  }
};

class Visualize extends React.Component {
  static propTypes = {
    selectBasemap: PropTypes.func.isRequired,
    toggleWidget:  PropTypes.func.isRequired,
    widgets:  PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
  }

  componentDidMount() {
    this.props.selectBasemap('Aerial');
  }

  handleToggleWidget = widgetName => event => {
    this.props.widgetsActions.toggleWidget(widgetName);
  };

  render () {
    return (
      <React.Fragment>
        <div style={styles.mapContainer}>
          <OLComponent />
        </div>
        <BigColorPaletteContainer />
        <SpeedDialMenu widgets={this.props.widgets}
                       toggleWidget={this.props.toggleWidget} />

        <div style={styles.left}>
          <div style={{display: 'contents'}}>
            {
              (this.props.widgets.info) ?
                <div style={styles.panel}>
                  <VisualizeWidget
                    title={labels.INFO_WIDGET_TITLE}
                    icon={<InfoIcon />}
                    rootStyle={styles.info}
                    onMinimizeClicked={this.handleToggleWidget(constants.WIDGET_INFO_KEY)}>
                    <WidgetPointInformationsContainer />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.chart) ?
                <div style={styles.panel}>
                  <VisualizeWidget
                    title={labels.CHART_WIDGET_TITLE}
                    icon={<ChartIcon />}
                    rootStyle={styles.chart}
                    onMinimizeClicked={this.handleToggleWidget(constants.WIDGET_CHART_KEY)}>
                    <WidgetTimeSeriesContainer />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.timeSlider)?
                <div style={styles.panel}>
                  <VisualizeWidget
                    title={labels.TIME_SLIDER_WIDGET_TITLE}
                    icon={<AccessTimeIcon />}
                    rootStyle={styles.timeSlider}
                    onMinimizeClicked={this.handleToggleWidget(constants.WIDGET_TIME_SLIDER_KEY)}>
                    <WidgetTimeSliderContainer monthsRange={false} yearsRange={false} />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.mapControls)?
                <div style={styles.panel}>
                  <VisualizeWidget
                    title={labels.MAP_CONTROLS_WIDGET_TITLE}
                    icon={<MapControlsIcon />}
                    rootStyle={styles.mapControls}
                    onMinimizeClicked={this.handleToggleWidget(constants.WIDGET_MAP_CONTROLS_KEY)}>
                    <WidgetMapControlsContainer />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.layerSwitcher)?
                <div style={styles.panel}>
                  <VisualizeWidget
                    title={labels.LAYER_SWITCHER_WIDGET_TITLE}
                    icon={<LayersIcon />}
                    rootStyle={styles.layerSwitcher}
                    onMinimizeClicked={this.handleToggleWidget(constants.WIDGET_LAYER_SWITCHER_KEY)}>
                    <WidgetLayerSwitcherContainer />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.customRegions)?
                <div style={styles.panel}>
                <VisualizeWidget
                  title={labels.CUSTOM_REGIONS_WIDGET_TITLE}
                  icon={<DrawIcon />}
                  rootStyle={styles.customRegions}
                  onMinimizeClicked={this.handleToggleWidget(constants.WIDGET_CUSTOM_REGIONS_KEY)}>
                  <WidgetDrawFeaturesContainer />
                </VisualizeWidget>
                </div>
                : null
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Visualize;
