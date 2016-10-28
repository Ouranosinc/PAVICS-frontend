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

import ZoomInImg from './assets/mActionZoomIn.png';
import ZoomOutImg from './assets/mActionZoomIn.png';
import ZoomToSelectedImg from './assets/mActionZoomToSelected.png';
import ZoomFullExtentImg from './assets/mActionZoomFullExtent.png';
import SelectImg  from './assets/mActionSelect.png';

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
          <Button id="zoom-selection-id" onClick={this.handleClick.bind(this,"zoom-selection-id")}>
            <Image src={ZoomToSelectedImg} responsive></Image>
          </Button>
          <Button id="zoom-full-extend-id" onClick={this.handleClick.bind(this,"zoom-full-extend-id")}>
            <Image src={ZoomFullExtentImg} responsive></Image>
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
