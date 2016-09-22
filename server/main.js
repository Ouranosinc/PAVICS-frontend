import Koa from 'koa'
import route from 'koa-route'
import convert from 'koa-convert'
import webpack from 'webpack'
import webpackConfig from '../build/webpack.config'
import historyApiFallback from 'koa-connect-history-api-fallback'
import serve from 'koa-static'
import proxy from 'koa-proxy'
import _debug from 'debug'
import config from '../config'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new Koa();
//Controllers
import {birdhouse, datasets, facets, wms} from './controllers'
//Routes
app.use(route.get('/api/wms/capabilities', birdhouse.getCapabilities));
app.use(route.get('/api/wms/dataset/layers', wms.getLayers));
app.use(route.get('/api/facets', facets.getFacets));
app.use(route.get('/api/datasets', datasets.getDatasets));
app.use(route.get('/api/dataset', datasets.getDataset));
// Enable koa-proxy if it has been enabled in the config.
// Because it's been enabled, so I guess we should enable it
if (config.proxy && config.proxy.enabled) {
  app.use(convert(proxy(config.proxy.options)))
}
// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false
})));
// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig);
  // Enable webpack-dev and webpack-hot middleware
  const {publicPath} = webpackConfig.output;
  app.use(webpackDevMiddleware(compiler, publicPath));
  app.use(webpackHMRMiddleware(compiler));
  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(convert(serve(paths.client('static'))))
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  );
  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(convert(serve(paths.dist())))
}
export default app
