import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'gandalf',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Gandalf = require('./containers/Gandalf').default;
      const reducer = require('./modules/Gandalf').default;
      injectReducer(store, { key: 'gandalf', reducer });
      cb(null, Gandalf);
    }, 'gandalf');
  }
});
