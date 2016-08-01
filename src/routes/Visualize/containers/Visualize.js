import React from 'react'
import classes from './Visualize.scss'

var me;

//This is actually a smart component...

class Visualize extends React.Component {
  static propTypes = {
    /*wms: React.PropTypes.object,
    saved: React.PropTypes.array.isRequired,
    fetchWms: React.PropTypes.func.isRequired,
    saveCurrentwms: React.PropTypes.func.isRequired,
    onSelectedDataset: React.PropTypes.func.isRequired*/
  }

  constructor(props) {
    super(props);
    console.log(props);
    this.props.fetchCatalogs();
    this.lastKey = 0;
    this.lastValue = 0;
    me = this;
  }

  onFetchClick(){
    me.props.fetchCatalogs();
  }

  onAddSelectedField(){
    me.lastKey++;
    me.lastValue++;
    me.props.addCatalogKeyValue(me.lastKey, me.lastValue);
  }

  onRemoveSelectedField(){
    me.props.removeCatalogKeyValue(1, 1);
  }

  render () {
    return (
      <div className={classes['VisualizeContainer']}>
        <h1>Test props</h1>
        <div>{ this.props.catalogs }</div>
        <button onClick={this.onFetchClick}>Refetch</button>
        <button onClick={this.onAddSelectedField}>Add Field</button>
        <button onClick={this.onRemoveSelectedField}>Remove Field</button>
        <div></div>
        <div></div>
      </div>
    )
  }
}

export default Visualize
