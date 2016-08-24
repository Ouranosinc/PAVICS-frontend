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
    <Link to='/cesium' activeClassName={classes.activeRoute}>
      Cesium
    </Link>
    {' · '}
    <Link to='/Visualize' activeClassName={classes.activeRoute}>
      Visualize
    </Link>
  </div>
)

export default Header
