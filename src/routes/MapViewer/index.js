import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'mapviewer',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Visualize = require('./containers/MapViewer').default
      const reducer = require('./modules/MapViewer').default

      /*  Add the reducer to the store on key 'Visualize'  */
      injectReducer(store, { key: 'mapviewer', reducer })

      /*  Return getComponent   */
      cb(null, Visualize)

      /* Webpack named bundle   */
    }, 'mapviewer')
  }
})
