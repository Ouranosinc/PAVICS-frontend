import React from 'react';
import PropTypes from 'prop-types';
import OLComponent from '../OLComponent';
import SpeedDialMenu from '../SpeedDialMenu'
import TimeSlider from '../TimeSlider';
import InformationPanel from '../InformationPanel';
import LayerSwitcher from '../LayerSwitcher';
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
    width: '50%',
    display: 'grid',
    gridColumnGap: '2px',
    gridRowGap: '2px',
    justifyItems: 'stretch',
    gridAutoFlow: 'row dense',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    // gridTemplateColumns: 'repeat(8, minmax(120px, 1fr))',
    gridAutoRows: '100px'
  },
  widget: {
    height: '100%',
    width: '100%',
    opacity: OPACITY
  },
  info: {
    gridArea: 'span 4 / span 3'
  },
  chart: {
    //gridColumn: 'span 3',
    //gridRow: 'span 4',
    gridArea: 'span 4 / span 5'
  },
  timeSlider: {
    gridArea: 'span 3 / span 5'
  },
  mapControls: {
    gridArea: 'span 3 / span 2'
  },
  layerSwitcher: {
    gridArea: 'span 4 / span 3'
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
        </div>
      </React.Fragment>
    );
  }
}
export default Visualize;
