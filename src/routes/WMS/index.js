import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'wms',
  getComponent (nextState, next) {
    require.ensure([
      './containers/wmsContainer',
      './modules/wms'
    ], (require) => {
      /*  These modules are lazily evaluated using require hook, and
      will not loaded until the router invokes this callback. */
      const wms = require('./containers/wmsContainer').default
      const wmsReducer = require('./modules/wms').default

      injectReducer(store, {
        key: 'wms',
        reducer: wmsReducer
      })

      next(null, wms)
    })
  }
})
