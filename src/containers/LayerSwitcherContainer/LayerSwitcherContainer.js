import React from 'react';
import LayerSwitcher from './../../components/LayerSwitcher';
export default class LayerSwitcherContainer extends React.Component {
  static propTypes = {
    publicShapeFiles: React.PropTypes.array.isRequired,
    baseMaps: React.PropTypes.array.isRequired,
    OLComponentReference: React.PropTypes.object.isRequired
  };
  constructor () {
    super();
    this.displayShapeFile = this.displayShapeFile.bind(this);
    this.displayBaseMap = this.displayBaseMap.bind(this);
    this.removeShapeFile = this.removeShapeFile.bind(this);
    this.removeBaseMap = this.removeBaseMap.bind(this);
  }
  displayShapeFile (shapeFile) {
    console.log('displaying shape file', shapeFile);
    this.props.OLComponentReference.addTileWMSLayer(
      shapeFile.title,
      this.props.OLComponentReference.getMapOverlayList(),
      shapeFile.wmsUrl,
      shapeFile.wmsParams
    );
  }
  removeShapeFile (shapeFile) {
    console.log('removing shape file', shapeFile);
    let layer = this.props.OLComponentReference.getTileWMSLayer(
      shapeFile.title,
      shapeFile.wmsUrl,
      shapeFile.wmsParams
    );
    this.props.OLComponentReference.map.removeLayer(
      layer
    );
  }
  displayBaseMap (map) {
    console.log('display base map:', map);
    this.props.OLComponentReference.addBingLayer(map, map);
  }
  removeBaseMap (map) {
    console.log('removing base map', map);
    let layer = this.props.OLComponentReference.getLayer(map);
    this.props.OLComponentReference.map.removeLayer(layer);
  }
  render () {
    return (
      <LayerSwitcher
        baseMaps={this.props.baseMaps}
        publicShapeFiles={this.props.publicShapeFiles}
        setBaseMap={this.displayBaseMap}
        removeBaseMap={this.removeBaseMap}
        setShapeFile={this.displayShapeFile}
        removeShapeFile={this.removeShapeFile} />
    );
  }
}
