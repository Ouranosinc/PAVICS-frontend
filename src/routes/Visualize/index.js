import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'visualize',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Visualize = require('./containers/Visualize').default
      const reducer = require('./modules/Visualize').default

      /*  Add the reducer to the store on key 'Visualize'  */
      injectReducer(store, { key: 'visualize', reducer })

      /*  Return getComponent   */
      cb(null, Visualize)

    /* Webpack named bundle   */
    }, 'visualize')
  }
})
