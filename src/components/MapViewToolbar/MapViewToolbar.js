/**
 * Created by beaulima on 16-10-20.
 */
import classes from './MapViewToolbar.scss'
var React = require('react')
var Bootstrap = require('react-bootstrap');

var ButtonToolbar = Bootstrap.ButtonToolbar
var ButtonGroup = Bootstrap.ButtonGroup
var Button = Bootstrap.Button

class MapViewToolbar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {toolId: "no-state-id"};
  }

  componentDidMount(){
  };

  handleClick(toolId){
    console.log("MapViewToolbar:handleOnClick : ")
    this.props.onMapViewToolbarClick({toolId:toolId});
    this.setState({toolId:toolId});
  };

  render(){
    return (
      <ButtonToolbar>
        <ButtonGroup>
          <Button id="zoom-in-id" onClick={this.handleClick.bind(this,"zoom-in-id")} active={this.state.toolId === "zoom-in-id"}>
            zoom in
          </Button>
          <Button id="zoom-out-id" onClick={this.handleClick.bind(this,"zoom-out-id")} active={this.state.toolId === "zoom-out-id"}>
            zoom out
          </Button>
          <Button id="zoom-selection-id" onClick={this.handleClick.bind(this,"zoom-selection-id")} active={this.state.toolId === "zoom-selection-id"}>
            zoom selection
          </Button>
          <Button id="select-id" onClick={this.handleClick.bind(this,"select-id")} active={this.state.toolId === "select-id"}>
            select</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  };
}

module.exports = MapViewToolbar;
