/**
 * Created by beaulima on 10/28/16.
 */

import React from 'react'

var ListGroup=Bootstrap.ListGroup;
var ListGroupItem=Bootstrap.ListGroupItem;


class LayerManagerPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = {toolId: "no-state-id"};
  }

  componentDidMount(){
  };

  handleClick(toolId){
    console.log("LayerManagerPanel:handleOnClick : ")
    this.props.onLayerManagerPanelClick({layerId:layerId});
    this.setState({layerId:layerId});
  };

  render(){
    return (
      <ListGroup>
        <ListGroupItem href="#link1">Link 1</ListGroupItem>
        <ListGroupItem href="#link2">Link 2</ListGroupItem>
        <ListGroupItem onClick={alertClicked}>
          Trigger an alert
        </ListGroupItem>
      </ListGroup>
    );
  };
}

module.exports = LayerManagerPanel;
