import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'pavics',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Pavics = require('./containers/Pavics').default;
      const reducer = require('./modules/Pavics').default;
      injectReducer(store, { key: 'pavics', reducer });
      cb(null, Pavics);
    }, 'pavics');
  }
});
