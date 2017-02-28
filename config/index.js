/* eslint key-spacing:0 spaced-comment:0 */
import path from 'path';
import _debug from 'debug';
import {argv} from 'yargs';
import ip from 'ip';
const localip = ip.address();
const debug = _debug('app:config');
debug('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
let serverHost = process.env.PAVICS_FRONTEND_IP || localip;
let birdhouseHost = process.env.BIRDHOUSE_HOST || 'outarde.crim.ca';
let serverPort = process.env.PORT || 3000;
const config = {
  env: process.env.NODE_ENV || 'development',
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: serverHost, // use string 'localhost' to prevent exposure on local network
  server_port: serverPort,
  // ----------------------------------
  // PAVICS Configs
  // ----------------------------------
  pavics_solr_path: `http://${birdhouseHost}:8091`,
  pavics_phoenix_path: `https://${birdhouseHost}:8443`,
  pavics_geoserver_path: `http://${birdhouseHost}:8087/geoserver`,
  pavics_ncwms_path: `http://${birdhouseHost}:8080/ncWMS2`,
  pavics_pywps_path: `http://${birdhouseHost}:8086/pywps`,
  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_client: 'src',
  dir_dist: 'dist',
  dir_server: 'server',
  dir_test: 'tests',
  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules: true,
  compiler_devtool: 'source-map',
  compiler_hash_type: 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '/',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true
  },
  compiler_vendor: [
    'history',
    'react',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux'
  ],
  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters: [
    {type: 'text-summary'},
    {type: 'lcov', dir: 'coverage'}
  ]
};
/************************************************
 -------------------------------------------------

 All Internal Configuration Below
 Edit at Your Own Risk

 -------------------------------------------------
 ************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(config.env)
  },
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
  '__PROD__': config.env === 'production',
  '__TEST__': config.env === 'test',
  '__DEBUG__': config.env === 'development' && !argv.no_debug,
  '__COVERAGE__': !argv.watch && config.env === 'test',
  '__BASENAME__': JSON.stringify(process.env.BASENAME || ''),
  '__PAVICS_PHOENIX_PATH__': JSON.stringify(config.pavics_phoenix_path),
  '__PAVICS_GEOSERVER_PATH__': JSON.stringify(config.pavics_geoserver_path)
};
// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');
config.compiler_vendor = config.compiler_vendor
  .filter((dep) => {
    if (pkg.dependencies[dep]) {
      return true;
    }
    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from vendor_dependencies in ~/config/index.js`
    );
  });
// ------------------------------------
// Utilities
// ------------------------------------
const resolve = path.resolve;
const base = (...args) =>
  Reflect.apply(resolve, null, [config.path_base, ...args]);
config.utils_paths = {
  base: base,
  client: base.bind(null, config.dir_client),
  dist: base.bind(null, config.dir_dist)
};
// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments').default;
const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}
export default config;
