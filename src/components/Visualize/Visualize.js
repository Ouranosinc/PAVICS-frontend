import React from 'react';
import PropTypes from 'prop-types';
import OLComponent from '../OLComponent';
import SpeedDialMenu from '../SpeedDialMenu'
import TimeSlider from '../TimeSlider';
import InformationPanel from '../InformationPanel';
import LayerSwitcher from '../LayerSwitcher';
import TimeSeriesChart from './../TimeSeriesChart';
import MapControls from './../MapControls';
import SectionalPanel from './../../containers/SectionalPanel';
import { constants } from './../../redux/modules/Widgets';
import * as labels from './../../constants';
import BigColorPalette from '../BigColorPalette/BigColorPalette';
import VisualizeWidget from './VisualizeWidget';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LayersIcon from '@material-ui/icons/Layers';
import MapControlsIcon from '@material-ui/icons/MyLocation';
import InfoIcon from '@material-ui/icons/Description';
import ChartIcon from '@material-ui/icons/Timeline';

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
  container: {
    // width: '50%',
    display: 'grid',
    gridColumnGap: '2px',
    gridGap: '2px',
    justifyItems: 'stretch',
    gridAutoFlow: 'dense',
    // This way, there's always minimum of 6 columns + 5(4+1+n)(min 110px) + 1(40%)
    gridTemplateColumns: 'repeat(4, minmax(115px, 1fr)) repeat(auto-fit, minmax(115px, 1fr)) [last-col] minmax(45px, 40%) [end-col]', // TODO: 40% -> auto
    gridTemplateRows: 'repeat(auto-fit, 100px) [last-row] 200px [end-row]',
  },
  widget: {
    height: '100%',
    width: '100%',
    opacity: OPACITY
  },
  info: {
    gridArea: 'span 3 / span 4'
  },
  chart: {
    gridArea: 'span 3 / span 4'
  },
  timeSlider: {
    gridArea: 'span 3 / span 5'
  },
  mapControls: {
    gridArea: 'span 3 / span 2'
  },
  layerSwitcher: {
    gridArea: 'span 3 / span 4'
  },
  sectionalPanel: {

    gridColumn: 'last-col / span 1',
    gridRow: 'span 16 / end-row', // 16 rows should be enough (max 3x5+1)
    // gridRowStart: 'span 9000',
    // gridArea: '1 / last-col/ last-line / span 1'
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

        <div style={styles.container}>
          {
            (this.props.widgets.info) ?
              <div style={styles.info}>
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
              <div style={styles.chart}>
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
              <div style={styles.timeSlider}>
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
              <div style={styles.mapControls}>
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
              <div style={styles.layerSwitcher}>
                <VisualizeWidget
                  title={labels.LAYER_SWITCHER_WIDGET_TITLE}
                  icon={<LayersIcon />}
                  rootStyle={styles.widget}
                  onMinimizeClicked={() => this.props.widgetsActions.toggleWidget(constants.WIDGET_LAYER_SWITCHER_KEY)}>
                  <LayerSwitcher
                    visualize={this.props.visualize}
                    visualizeActions={this.props.visualizeActions} />
                </VisualizeWidget>
              </div>
              : null
          }
          <div style={styles.sectionalPanel}>
            <SectionalPanel />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Visualize;
