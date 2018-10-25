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
const serverHost = process.env.PAVICS_FRONTEND_IP || localip;
const serverProto = process.env.PAVICS_FRONTEND_PROTO || 'https';
const birdhouseHost = process.env.BIRDHOUSE_HOST || 'pluvier.crim.ca';
const ncwmsHost = process.env.NCWMS_HOST || `https://${birdhouseHost}/twitcher/ows/proxy/ncWMS2/wms`;
const catalogHost = process.env.CATALOG_HOST || `https://${birdhouseHost}/twitcher/ows/proxy/catalog/pywps`;
const malleefowlHost = process.env.MALLEEFOWL_HOST || `https://${birdhouseHost}/twitcher/ows/proxy/malleefowl/wps`;
const PAVICS_WORKFLOW_PROVIDER = process.env.PAVICS_WORKFLOW_PROVIDER || 'malleefowl';
const PAVICS_RUN_WORKFLOW_IDENTIFIER = process.env.PAVICS_RUN_WORKFLOW_IDENTIFIER || 'custom_workflow';
const PAVICS_VISUALIZE_IDENTIFIER = process.env.PAVICS_VISUALIZE_IDENTIFIER || 'TODO';
const PAVICS_PERSIST_IDENTIFIER = process.env.PAVICS_PERSIST_IDENTIFIER || 'TODO';
const PAVICS_PUBLISH_IDENTIFIER = process.env.PAVICS_PUBLISH_IDENTIFIER || 'TODO';
const PAVICS_DEFAULT_WORKSPACE_FOLDER = process.env.PAVICS_DEFAULT_WORKSPACE_FOLDER || 'workspaces';
const serverPort = process.env.PORT || 3000;
const serverExternalPort = process.env.PAVICS_FRONTEND_PORT || serverPort;
const URL_BASE = `${serverProto}://${birdhouseHost}`;
const config = {
  env: process.env.NODE_ENV || 'development',
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: serverHost, // use string 'localhost' to prevent exposure on local network
  server_port: serverPort,
  server_external_port: serverExternalPort,
  server_proto: serverProto,
  // ----------------------------------
  // PAVICS Configs
  // ----------------------------------
  pavics_malleefowl_path: malleefowlHost,
  pavics_phoenix_path: `${URL_BASE}:8443`,
  pavics_geoserver_path: `${URL_BASE}/geoserver`,
  pavics_geoserver_api_path: process.env.PAVICS_GEOSERVER_API || `${URL_BASE}/twitcher/ows/proxy/geoserver-api`,
  pavics_geoserver_workspaces_service_name: process.env.PAVICS_GEOSERVER_WORKSPACES_SERVICE_NAME || 'geoserver-api',
  pavics_ncwms_path: ncwmsHost,
  pavics_catalog_path: catalogHost,
  pavics_project_api_path: process.env.PAVICS_PROJECT_API_URL || `${URL_BASE}/project-api/api`,
  // pavics_project_api_internal_url is needed in dev mode since centos vm etc/hosts hasn't its value modified but windows host has (pluvier -­> dev IP)
  pavics_project_api_internal_url: process.env.PAVICS_PROJECT_API_INTERNAL_URL || `${URL_BASE}/project-api/api`, // DEV
  pavics_magpie_host: `${URL_BASE}/magpie`,
  PAVICS_WORKFLOW_PROVIDER: PAVICS_WORKFLOW_PROVIDER,
  PAVICS_RUN_WORKFLOW_IDENTIFIER: PAVICS_RUN_WORKFLOW_IDENTIFIER,
  PAVICS_VISUALIZE_IDENTIFIER: PAVICS_VISUALIZE_IDENTIFIER,
  PAVICS_PERSIST_IDENTIFIER: PAVICS_PERSIST_IDENTIFIER,
  PAVICS_PUBLISH_IDENTIFIER: PAVICS_PUBLISH_IDENTIFIER,
  PAVICS_DEFAULT_WORKSPACE_FOLDER: PAVICS_DEFAULT_WORKSPACE_FOLDER,
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
  '__PAVICS_NCWMS_PATH__': JSON.stringify(config.pavics_ncwms_path),
  '__PAVICS_PHOENIX_PATH__': JSON.stringify(config.pavics_phoenix_path),
  '__PAVICS_MAGPIE_PATH__': JSON.stringify(config.pavics_magpie_host),
  '__PAVICS_GEOSERVER_PATH__': JSON.stringify(config.pavics_geoserver_path),
  '__PAVICS_GEOSERVER_API_PATH__': JSON.stringify(config.pavics_geoserver_api_path),
  '__PAVICS_GEOSERVER_WORKSPACES_SERVICE_NAME__': JSON.stringify(config.pavics_geoserver_workspaces_service_name),
  '__PAVICS_PROJECT_API_PATH__': JSON.stringify(config.pavics_project_api_path),
  '__MAGPIE_HOST__': JSON.stringify(config.pavics_magpie_host),
  '__PAVICS_WORKFLOW_PROVIDER__': JSON.stringify(config.PAVICS_WORKFLOW_PROVIDER),
  '__PAVICS_RUN_WORKFLOW_IDENTIFIER__': JSON.stringify(config.PAVICS_RUN_WORKFLOW_IDENTIFIER),
  '__PAVICS_VISUALIZE_IDENTIFIER__': JSON.stringify(config.PAVICS_VISUALIZE_IDENTIFIER),
  '__PAVICS_PERSIST_IDENTIFIER__': JSON.stringify(config.PAVICS_PERSIST_IDENTIFIER),
  '__PAVICS_PUBLISH_IDENTIFIER__': JSON.stringify(config.PAVICS_PUBLISH_IDENTIFIER),
  '__PAVICS_DEFAULT_WORKSPACE_FOLDER__': JSON.stringify(config.PAVICS_DEFAULT_WORKSPACE_FOLDER)
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
