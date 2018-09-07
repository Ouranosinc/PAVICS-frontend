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
import BigColorPalette from '../BigColorPalette/BigColorPalette';
import VisualizeWidget from './VisualizeWidget';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LayersIcon from '@material-ui/icons/Layers';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Description';
import ChartIcon from '@material-ui/icons/Timeline';
import DrawIcon from '@material-ui/icons/Edit';
import classes from './Visualize.scss';
// FIXME: Widgets to containers
import WidgetDrawFeaturesContainer from './../../containers/WidgetDrawFeatures';
import WidgetLayerSwitcherContainer from './../../containers/WidgetLayerSwitcher';
import SectionalPanel from './../../containers/SectionalPanel';

const OPACITY = 0.9;
const styles = {
  mapContainer: {
    zIndex: 0,
    padding: 0,
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
  widget: {
    height: '100%',
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

        <div className={classes.container}>
          <div className={classes.widgets}>
            {
              (this.props.widgets.info) ?
                <div className={classes.info}>
                  <VisualizeWidget
                    title={labels.INFO_WIDGET_TITLE}
                    icon={<InfoIcon />}
                    rootStyle={styles.widget}
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_INFO_KEY)}>
                    <InformationPanel
                      visualize={this.props.visualize} />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.chart) ?
                <div className={classes.chart}>
                  <VisualizeWidget
                    title={labels.CHART_WIDGET_TITLE}
                    icon={<ChartIcon />}
                    rootStyle={styles.widget}
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_CHART_KEY)}>
                    <TimeSeriesChart
                      style={{overflow: 'auto'}}
                      visualize={this.props.visualize}
                      visualizeActions={this.props.visualizeActions}/>
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.timeSlider)?
                <div className={classes.timeSlider}>
                  <VisualizeWidget
                    title={labels.TIME_SLIDER_WIDGET_TITLE}
                    icon={<AccessTimeIcon />}
                    rootStyle={styles.widget}
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
                <div className={classes.mapControls}>
                  <VisualizeWidget
                    title={labels.MAP_CONTROLS_WIDGET_TITLE}
                    icon={<MapControlsIcon />}
                    rootStyle={styles.widget}
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
                <div className={classes.layerSwitcher}>
                  <VisualizeWidget
                    title={labels.LAYER_SWITCHER_WIDGET_TITLE}
                    icon={<LayersIcon />}
                    rootStyle={styles.widget}
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_LAYER_SWITCHER_KEY)}>
                    <WidgetLayerSwitcherContainer />
                  </VisualizeWidget>
                </div>
                : null
            }
            {
              (this.props.widgets.customRegions)?
                <div className={classes.customRegions}>
                  <VisualizeWidget
                    title={labels.CUSTOM_REGIONS_WIDGET_TITLE}
                    icon={<DrawIcon />}
                    rootStyle={styles.widget}
                    onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_CUSTOM_REGIONS_KEY)}>
                    <WidgetDrawFeaturesContainer />
                  </VisualizeWidget>
                </div>
                : null
            }
            </div>
          <div className={classes.sectionalPanel}><SectionalPanel /></div>
        </div>
      </React.Fragment>
    );
  }
}
export default Visualize;
