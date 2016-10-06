import React from 'react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
class MapNavBar extends React.Component {
  render () {
    return (
      <Navbar>
        <Nav>
          <NavItem>bouton</NavItem>
        </Nav>
        <Navbar.Text pullRight id="mouseCoordinates" />
      </Navbar>
    )
  }
}
export default MapNavBar
