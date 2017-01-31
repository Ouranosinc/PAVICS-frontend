import React from 'react';
import LayerSwitcher from './../../components/LayerSwitcher';
export default class LayerSwitcherContainer extends React.Component {
  static propTypes = {
    publicShapeFiles: React.PropTypes.array.isRequired
  };
  constructor () {
    super();
    this.displayShapeFile = this.displayShapeFile.bind(this);
    this.removeShapeFile = this.removeShapeFile.bind(this);
  }
  displayShapeFile (shapeFile) {
    console.log('displaying shape file', shapeFile);
  }
  removeShapeFile (shapeFile) {
    console.log('removing shape file', shapeFile);
  }
  render () {
    return (
      <LayerSwitcher
        setShapeFile={this.displayShapeFile}
        removeShapeFile={this.removeShapeFile}
        publicShapeFiles={this.props.publicShapeFiles} />
    );
  }
}
