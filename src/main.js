import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {useRouterHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { persistStore, getStoredState } from 'redux-persist';

// ========================================================
// Fix for mobile tap event, waiting for material-ui to phase towards onClick instead of onTap
// ========================================================
injectTapEventPlugin();

// ========================================================
// Browser History Setup
// ========================================================
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
});
// ========================================================
// Store and History Instantiation
// ========================================================
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
getStoredState({}, (err, restoredState) => {
  let store;
  if (err) {
    const initialState = window.___INITIAL_STATE__;
    store = createStore(initialState, browserHistory);
  } else {
    store = createStore(restoredState, browserHistory);
  }

  // Save Store locally every 60 seconds
  const loop = () => {
    setTimeout(() => {
      persistStore(store, {}, () => {
        console.log('Persistency completed at ' + new Date());
        loop();
      });
    }, 60000);
  };
  loop();

  const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.router
  });
  // ========================================================
  // Developer Tools Setup
  // ========================================================
  if (__DEBUG__) {
    if (window.devToolsExtension) {
      window.devToolsExtension.open()
    }
  }
  // ========================================================
  // Render Setup
  // ========================================================
  const MOUNT_NODE = document.getElementById('root');
  let render = (routerKey = null) => {
    const routes = require('./routes/index').default(store);
    ReactDOM.render(
      <AppContainer
        store={store}
        history={history}
        routes={routes}
        routerKey={routerKey}
      />,
      MOUNT_NODE
    );
  };
  // Enable HMR and catch runtime errors in RedBox
  // This code is excluded from production bundle
  if (__DEV__ && module.hot) {
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react');
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };
    render = () => {
      try {
        renderApp(Math.random());
      } catch (error) {
        renderError(error);
      }
    };
    module.hot.accept(['./routes/index'], () => render());
  }

  // ========================================================
  // Go!
  // ========================================================
  render();
});
