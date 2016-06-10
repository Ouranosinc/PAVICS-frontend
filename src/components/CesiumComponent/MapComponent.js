import React from 'react';
import BuildModuleUrl from 'cesium/Source/Core/buildModuleUrl';
BuildModuleUrl.setBaseUrl('./');
import CesiumViewer from 'cesium/Source/Widgets/Viewer/Viewer';
import Entity from 'cesium/Source/DataSources/Entity';
import CesiumPatcher from './cesium.patcher.js';
import Cartesian3 from 'cesium/Source/Core/Cartesian3';
require('./CesiumComponent.css');

let cesiumViewerOptions = {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  automaticallyTrackDataSourceClocks: false
};

class CesiumComponent extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    // Create the Cesium Viewer
    this.viewer = new CesiumViewer(this.refs.map, cesiumViewerOptions);

    // Add the initial points
    this.props.cities.forEach((city) => {
      this.viewer.entities.add(new Entity({
        id: city.id,
        show: city.visible,
        position: new Cartesian3.fromDegrees(city.longitude, city.latitude),
        billboard: {
          image: require('./pin.svg'),
          width: 30,
          height: 30
        }
      }));
    });
  }

  componentWillReceiveProps(nextProps) {
    let patches = CesiumPatcher.calculatePatches(this.props, nextProps);

    // Map patch operations to Cesium's Entity API
    patches.forEach((patch) => {
      if (patch.attribute === 'visible') {
        this.viewer.entities.getById(patch.id).show = patch.nextValue;
      }
      // else if (patch.attribute === 'name') { .. and so on .. }
    });
  }
  render() {
    return (
      <div ref="map" style={{ width: '100%' }}>
      </div>
    );
  }
}
export default CesiumComponent;
