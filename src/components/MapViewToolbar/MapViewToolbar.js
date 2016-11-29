/**
 * Created by beaulima on 16-10-20.
 */
import classes from './MapViewToolbar.scss'
var React = require('react')
var Bootstrap = require('react-bootstrap');

var ButtonToolbar = Bootstrap.ButtonToolbar;
var ButtonGroup = Bootstrap.ButtonGroup;
var Button = Bootstrap.Button;
var Image = Bootstrap.Image;
var DropdownButton =Bootstrap.DropdownButton;
var MenuItem =Bootstrap.MenuItem;

import ZoomInImg from './assets/mActionZoomIn.png';
import ZoomOutImg from './assets/mActionZoomOut.png';
import ZoomToSelectedImg from './assets/mActionZoomToSelected.png';
import ZoomFullExtentImg from './assets/mActionZoomFullExtent.png';
import SelectImg  from './assets/mActionSelect.png';
import WPSExecImg  from './assets/mActionExWpsLayer.png';

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
          <Button id="zoom-in-id" onClick={this.handleClick.bind(this,"zoom-in-id")}>
            <Image src={ZoomInImg} responsive></Image>
          </Button>
          <Button id="zoom-out-id" onClick={this.handleClick.bind(this,"zoom-out-id")}>
            <Image src={ZoomOutImg} responsive></Image>
          </Button>
          <Button id="zoom-full-extend-id" onClick={this.handleClick.bind(this,"zoom-full-extend-id")}>
            <Image src={ZoomFullExtentImg} responsive></Image>
          </Button>

          <Button id="wps-id" onClick={this.handleClick.bind(this,"wps-id")}>
            <Image src={WPSExecImg} responsive></Image>
          </Button>

        </ButtonGroup>

        <ButtonGroup>
          <Button id="select-id" onClick={this.handleClick.bind(this,"select-id")} active={this.state.toolId === "select-id"} >
            <Image src={SelectImg} responsive></Image>
          </Button>


        </ButtonGroup>


      </ButtonToolbar>
    );
  };
}

module.exports = MapViewToolbar;
