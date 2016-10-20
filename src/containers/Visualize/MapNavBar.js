import React from 'react'
import * as constants from './../../routes/Visualize/constants'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
class MapNavBar extends React.Component {
  static propTypes = {
    panelControls: React.PropTypes.object.isRequired,
    clickTogglePanel: React.PropTypes.func.isRequired
  };
  constructor (props) {
    super(props)
    this._togglePanel = this._togglePanel.bind(this)
    this._togglePlotly = this._togglePlotly.bind(this)
  }
  _togglePanel (panel) {
    let newState = !this.props.panelControls[panel].show
    this.props.clickTogglePanel(panel, newState)
  }
  _togglePlotly () {
    this._togglePanel(constants.PANEL_PLOTLY)
  }
  render () {
    return (
      <Navbar>
        <Nav>
          <NavItem onClick={this._togglePlotly}>Plotly</NavItem>
        </Nav>
        <Navbar.Text pullRight id="mouseCoordinates" />
      </Navbar>
    )
  }
}
export default MapNavBar
