import React from 'react';
import PropTypes from 'prop-types';
import * as labels from './../../constants';
import { constants } from './../../redux/modules/Widgets';
import OLComponent from '../OLComponent';
import SpeedDialMenu from '../SpeedDialMenu'
import TimeSlider from '../TimeSlider';
import InformationPanel from '../InformationPanel';
import TimeSeriesChart from './../TimeSeriesChart';
import MapControls from './../MapControls';
import { constants } from './../../redux/modules/Widgets';
import * as labels from './../../constants';
import BigColorPalette from '../BigColorPalette/BigColorPalette';
import VisualizeWidget from './VisualizeWidget';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LayersIcon from '@material-ui/icons/Layers';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Description';
import ChartIcon from '@material-ui/icons/Timeline';
import DrawIcon from '@material-ui/icons/Edit';
// FIXME: Widgets to containers
import WidgetDrawFeaturesContainer from './../../containers/WidgetDrawFeatures';
import WidgetLayerSwitcherContainer from './../../containers/WidgetLayerSwitcher';

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
    height: '400px',
    overflow: 'auto',
    width: '400px',
    opacity: OPACITY
  }
};

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
    this.props.visualizeActions.selectBasemap('Aerial');
  }

  render () {
    return (
      <React.Fragment>
        <div style={styles.mapContainer}>
          <OLComponent
            visualize={this.props.visualize}
            visualizeActions={this.props.visualizeActions} />
        </div>
        <BigColorPalette />
        <SpeedDialMenu widgets={this.props.widgets}
                       widgetsActions={this.props.widgetsActions} />

        <div style={styles.left}>
          <div style={{display: 'contents'}}>
            {
              (this.props.widgets.info) ?
                <div style={styles.panel}>
                  <VisualizeWidget
                    title={labels.INFO_WIDGET_TITLE}
                    icon={<InfoIcon />}
                    rootStyle={styles.info}
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_INFO_KEY)}>
                    <InformationPanel
                      visualize={this.props.visualize} />
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
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_CHART_KEY)}>
                    <TimeSeriesChart
                      visualize={this.props.visualize}
                      visualizeActions={this.props.visualizeActions}/>
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
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_TIME_SLIDER_KEY)}>
                    <TimeSlider
                      monthsRange={false}
                      yearsRange={false}
                      visualize={this.props.visualize}
                      visualizeActions={this.props.visualizeActions} />
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
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_MAP_CONTROLS_KEY)}>
                    <MapControls
                      visualize={this.props.visualize}
                      visualizeActions={this.props.visualizeActions} />
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
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_LAYER_SWITCHER_KEY)}>
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
                  onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_CUSTOM_REGIONS_KEY)}>
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
