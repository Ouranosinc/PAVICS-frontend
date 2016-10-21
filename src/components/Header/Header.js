import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = () => (
  <div>
    <h1>PAVICS Platform</h1>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Home
    </IndexLink>
    {' · '}
    <Link to='/cesium' activeClassName={classes.activeRoute}>
      Cesium
    </Link>
    {' · '}
    <Link to='/WMS' activeClassName={classes.activeRoute}>
    WMS
    </Link>
    {' · '}
    <Link to='/Visualize' activeClassName={classes.activeRoute}>
      Visualize
    </Link>
    {' · '}
    <Link to='/MapViewer' activeClassName={classes.activeRoute}>
      MapViewer
    </Link>

  </div>
)

export default Header
