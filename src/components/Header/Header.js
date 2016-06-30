import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.scss'

export const Header = () => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName={classes.activeRoute}>
      Counter
    </Link>
    {' · '}
    <Link to='/openlayers' activeClassName={classes.activeRoute}>
      OpenLayers
    </Link>
    {' · '}
    <Link to='/cesium' activeClassName={classes.activeRoute}>
      Cesium
    </Link>
    {' · '}
    <Link to='/wms' activeClassName={classes.activeRoute}>
      WMS
    </Link>
  </div>
)

export default Header
