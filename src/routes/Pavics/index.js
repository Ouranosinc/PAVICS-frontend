import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'gandalf',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Gandalf = require('./containers/Pavics').default;
      const reducer = require('./modules/Pavics').default;
      injectReducer(store, { key: 'pavics', reducer });
      cb(null, Gandalf);
    }, 'gandalf');
  }
});
