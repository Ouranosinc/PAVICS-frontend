import React from 'react'

export class FacetLabel extends React.Component {
  static propTypes = {
    facet: React.PropTypes.object.isRequired,
    onRemoveFacet: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onRemoveFacet = this.onRemoveFacet.bind(this);
    this.whiteStyle = {
      color: "#FFF"
    };
  }

  onRemoveFacet(event){
    this.props.onRemoveFacet(this.props.facet.key, this.props.facet.value);
  }

  render () {
    return (
    <div>
      <span className="label label-primary">
        <span>{ `${this.props.facet.key} - ${this.props.facet.value} ` }</span>
        <a href="#" onClick={ this.onRemoveFacet }>
          <i style={ this.whiteStyle } className="glyphicon glyphicon-remove-sign" title="Remove"></i>
        </a>
      </span>
    </div>
    )
  }
}

export default FacetLabel
