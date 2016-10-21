/**
 * Created by beaulima on 16-10-20.
 */
import classes from './MapViewToolbar.scss'
var React = require('react')
var Bootstrap = require('react-bootstrap');

var ButtonToolbar = Bootstrap.ButtonToolbar
var ButtonGroup = Bootstrap.ButtonGroup
var Button = Bootstrap.Button

var MapViewToolbar = React.createClass(
  {

  componentDidMount(){

  },

  getInitialState: function() {
    console.log("MapViewToolbar:getInitialState : ")
    return {buttonClick:{id:"", changed:false}};
  },

  handleOnClick(option){
    console.log("MapViewToolbar:handleOnClick : ")
    this.props.onMapViewToolbarClick({buttonClick:{id:option,changed:true}});
    this.setState({buttonClick:{id:option, changed:true}});
    this.setState({option: option});
  },

  render: function() {
    return (
      <ButtonToolbar>
        <ButtonGroup>
          <Button id="zoom-in-id" onClick={this.handleOnClick.bind(this,"zoom-in-id")} active={this.state.option === "zoom-in-id"}>zoom in</Button>
          <Button id="zoom-out-id" onClick={this.handleOnClick.bind(this,"zoom-out-id")} active={this.state.option === "zoom-out-id"}>zoom out </Button>
          <Button id="zoom-selection-id" onClick={this.handleOnClick.bind(this,"zoom-selection-id")} active={this.state.option === "zoom-selection-id"}>zoom selection </Button>
          <Button id="select-id" onClick={this.handleOnClick.bind(this,"select-id")} active={this.state.option === "select-id"}>select</Button>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
});

module.exports = MapViewToolbar;
