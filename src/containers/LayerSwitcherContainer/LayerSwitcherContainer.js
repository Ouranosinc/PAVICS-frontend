import React from 'react';
import LayerSwitcher from './../../components/LayerSwitcher';
export default class LayerSwitcherContainer extends React.Component {
  static propTypes = {
    selectShapefile: React.PropTypes.func.isRequired,
    selectBasemap: React.PropTypes.func.isRequired,
    fetchShapefiles: React.PropTypes.func.isRequired,
    selectedShapefile: React.PropTypes.object.isRequired,
    selectedBasemap: React.PropTypes.string.isRequired,
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
    this.setLayerSwitcherReference = this.setLayerSwitcherReference.bind(this);
    this.state = {
      layerSwitcherReference: null
    };
    this.initiated = false;
  }

  componentDidMount () {
    this.props.fetchShapefiles();
  }

  componentDidUpdate () {
    if (
      this.props.OLComponentReference !== {} &&
      this.state.layerSwitcherReference !== null && !this.initiated
    ) {
      this.state.layerSwitcherReference.setSelectedBaseMap(null, 'Aerial');
      this.initiated = true;
    }
  }

  displayShapeFile (shapeFile) {
    this.props.OLComponentReference.layers['selectedRegions'].getSource().clear();
    this.props.selectShapefile(shapeFile);
    this.props.OLComponentReference.addTileWMSLayer(
      shapeFile.title,
      shapeFile.wmsUrl,
      shapeFile.wmsParams
    );
  }

  removeShapeFile (shapeFile) {
    this.props.OLComponentReference.layers['selectedRegions'].getSource().clear();
    this.props.selectShapefile({});
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
    this.props.selectBasemap(map);
    this.props.OLComponentReference.addBingLayer(map, map);
  }

  removeBaseMap (map) {
    this.props.selectBasemap('');
    let layer = this.props.OLComponentReference.getLayer(map);
    this.props.OLComponentReference.map.removeLayer(layer);
  }

  setLayerSwitcherReference (ref) {
    this.setState({
      layerSwitcherReference: ref
    });
  }

  render () {
    return (
      <LayerSwitcher
        selectedBasemap={this.props.selectedBasemap}
        selectedShapefile={this.props.selectedShapefile}
        ref={this.setLayerSwitcherReference}
        baseMaps={this.props.baseMaps}
        publicShapeFiles={this.props.publicShapeFiles}
        setBaseMap={this.displayBaseMap}
        removeBaseMap={this.removeBaseMap}
        setShapeFile={this.displayShapeFile}
        removeShapeFile={this.removeShapeFile} />
    );
  }
}
