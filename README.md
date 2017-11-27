# PAVICS-frontend

This project focuses on answering the most-pressing needs we’ve identified: creation of standard and custom climate change scenarios for impacts and adaptation studies, exploration, analysis and validation of climate model simulations, as well as visualization of climate change scenarios at the watershed scale. These tasks currently require downloading terabytes of data and heavy data processing that convert raw data into useful products: statistics, graphics, time series, or maps. We plan to turn these time-consuming tasks into a streamlined click, drag and drop exercise. Over 20 collaborators have pledged their support to this vision of an hardware and software interface that gives both experienced researchers and non-specialists access to a highly advanced and powerful toolset.

## Abstract

Climate service providers are boundary organizations working at the interface of climate science research and users of climate information. Users include academics in other disciplines looking for credible, customized future climate scenarios, government planners, resource managers, asset owners, as well as service utilities. These users are looking for relevant information regarding the impacts of climate change as well as informing decisions regarding adaptation options. As climate change concerns become mainstream, the pressure on climate service providers to deliver tailored, high quality information in a timely manner increases rapidly. To meet this growing demand, Ouranos, a climate service center located in Montreal, is collaborating with the Centre de recherche informatique de Montreal (CRIM) to develop a climate data analysis web-based platform interacting with RESTful services covering data access and retrieval, geospatial analysis, bias correction, distributed climate indicator computing and results visualization.

The project, financed by CANARIE, relies on the experience of Earth System Grid Federation Compute Working Team (ESGF-CWT), as well as on the Birdhouse framework developed by the German Climate Research Center (DKRZ) and French IPSL.

Climate data is accessed through OPeNDAP, while computations are carried through WPS. Regions such as watersheds or user-defined polygons, used as spatial selections for computations, are managed by GeoServer, also providing WMS, WCS, WFS and WPS capabilities. The services are hosted on independent servers communicating by high throughput network. Deployment, maintenance and collaboration with other development teams are eased by the use of Docker and OpenStack VMs. Web-based tools are developed with modern web frameworks such as React-Redux, Koa, Webpack, OpenLayers 3 and Plotly.

Although the main objective of the project is to build a functioning, usable data analysis pipeline within two years, time is also devoted to explore emerging technologies and assess their potential. For instance, sandbox environments will store climate data in HDFS, process it with Apache Spark and allow interaction through Jupyter Notebooks. Data streaming of observational data with OpenGL and Cesium is also considered.

## Features
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [react-router](https://github.com/rackt/react-router)
* [react-router-redux](https://github.com/rackt/react-router-redux)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [koa](https://github.com/koajs/koa)
* [karma](https://github.com/karma-runner/karma)
* [eslint](http://eslint.org)
* [openlayers](http://openlayers.org/)
* [cesium](https://cesiumjs.org/)

## React-Redux tutorial
[React Redux Confluence Blog](https://www.crim.ca/confluence/display/VEILLE/2016/08/01/React+Redux)

## Requirements
* node `^4.2.0` but developped with Node v5.11.1
* npm `^3.0.0` but developped with Node v3.8.6

## Getting Started

After confirming that your development environment meets the specified [requirements](#requirements), you can follow these steps to get the project up and running:

```bash
$ git clone https://github.com/Ouranosinc/PAVICS-frontend.git
$ cd PAVICS-frontend
$ npm install                   # Install project dependencies
$ npm start                     # Compile and launch
```

## To modify Redux-rest-resource transpiled files

After changing files in src/lib/redux-rest-resource/src folder, Run the following commands to compile code

```bash
$ cd src/lib/redux-rest-resource
$ npm i
$ npm run compile # will be called by install anyway tho
```

If everything works, you should see the following:

<img src="http://i.imgur.com/zR7VRG6.png?2" />

## Docker
Install Docker, I followed CentOS guide: https://docs.docker.com/engine/installation/linux/centos/

Build & Run on Linux
```bash
$ git clone https://github.com/Ouranosinc/PAVICS-frontend.git
$ cd PAVICS-frontend
$ docker build -t pavics/geoweb .
#To Run
$ docker run -p 3000:3000 -it pavics/geoweb #Then browse application at localhost:3000
#OR
$ docker run -p 3000:3000 -e PAVICS_FRONTEND_IP=<host_ip> -t pavics/geoweb #Then browse application at host_ip:3000
```

Build & Run on Windows:
```bash
$ git clone https://github.com/Ouranosinc/PAVICS-frontend.git
$ cd PAVICS-frontend
$ docker-machine ip default #If on Windows uses VM IP (note that ip for next step)
$ vi config/index.js
# Change line 37 with previous vm ip
# server_host : '<docker-machine ip>', // use string 'localhost' to prevent exposure on local network
# Save & Quit
$ docker build -t "pavics/geoweb" .
$ docker run -p 3000:3000 -it "pavics/geoweb" #Browse application at address <docker-machine ip>:3000
```

Pull from CRIM private registry (some config is needed for http insecure-registries):
```bash
$ docker pull crim-registry1:5000/pavics/geoweb
$ docker run -p 3000:3000 -it crim-registry1:5000/pavics/geoweb #Browse application at localhost:3000
```

## NPM Scripts

While developing, you will probably rely mostly on `npm start`; however, there are additional scripts at your disposal:

|`npm run <script>`|Description|
|------------------|-----------|
|`start`|Serves your app at `localhost:3000`. HMR will be enabled in development.|
|`compile`|Compiles the application to disk (`~/dist` by default).|
|`dev`|Same as `npm start`, but enables nodemon for the server as well.|
|`dev:no-debug`|Same as `npm run dev` but disables devtool instrumentation.|
|`test`|Runs unit tests with Karma and generates a coverage report.|
|`test:dev`|Runs Karma and watches for changes to re-run tests; does not generate coverage reports.|
|`deploy`|Runs linter, tests, and then, on success, compiles your application to disk.|
|`deploy:dev`|Same as `deploy` but overrides `NODE_ENV` to "development".|
|`deploy:prod`|Same as `deploy` but overrides `NODE_ENV` to "production".|
|`lint`|Lint all `.js` files.|
|`lint:fix`|Lint and fix all `.js` files. [Read more on this](http://eslint.org/docs/user-guide/command-line-interface.html#fix).|

## Application Structure

The application structure presented in this boilerplate is **fractal**, where functionality is grouped primarily by feature rather than file type. Please note, however, that this structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications. If you wish to read more about this pattern, please check out this [awesome writeup](https://github.com/davezuko/react-redux-starter-kit/wiki/Fractal-Project-Structure) by [Justin Greenberg](https://github.com/justingreenberg).

```
.
├── bin                      # Build/Start scripts
├── blueprints               # Blueprint files for redux-cli
├── build                    # All build-related configuration
│   └── webpack              # Environment-specific configuration files for webpack
├── config                   # Project configuration settings
├── server                   # Koa application (uses webpack middleware)
│   └── main.js              # Server application entry point
├── src                      # Application source code
│   ├── main.js              # Application bootstrap and rendering
│   ├── components           # Reusable Presentational Components
│   ├── containers           # Reusable Container Components
│   ├── layouts              # Components that dictate major page structure
│   ├── static               # Static assets (not imported anywhere in source code)
│   ├── styles               # Application-wide styles (generally settings)
│   ├── store                # Redux-specific pieces
│   │   ├── createStore.js   # Create and instrument redux store
│   │   └── reducers.js      # Reducer registry and injection
│   └── routes               # Main route definitions and async split points
│       ├── index.js         # Bootstrap main application routes with store
│       ├── Root.js          # Wrapper component for context-aware providers
│       └── Home             # Fractal route
│           ├── index.js     # Route definitions and async split points
│           ├── assets       # Assets required to render components
│           ├── components   # Presentational React Components
│           ├── container    # Connect components to actions and store
│           ├── modules      # Collections of reducers/constants/actions
│           └── routes **    # Fractal sub-routes (** optional)
└── tests                    # Unit tests
```

## Development

#### Developer Tools

**We recommend using the [Redux DevTools Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).**
Using the chrome extension allows your monitors to run on a separate thread and affords better performance and functionality. It comes with several of the most popular monitors, is easy to configure, filters actions, and doesn’t require installing any packages.

However, adding the DevTools components to your project is simple. First, grab the packages from npm:

```bash
npm i --save-dev redux-devtools redux-devtools-log-monitor redux-devtools-dock-monitor
```

Then follow the [manual integration walkthrough](https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md).

### Routing
We use `react-router` [route definitions](https://github.com/reactjs/react-router/blob/master/docs/API.md#plainroute) (`<route>/index.js`) to define units of logic within our application. See the [application structure](#application-structure) section for more information.

## Testing
To add a unit test, simply create a `.spec.js` file anywhere in `~/tests`. Karma will pick up on these files automatically, and Mocha and Chai will be available within your test without the need to import them. If you are using `redux-cli`, test files should automatically be generated when you create a component or redux module.

Coverage reports will be compiled to `~/coverage` by default. If you wish to change what reporters are used and where reports are compiled, you can do so by modifying `coverage_reporters` in `~/config/index.js`.

## Deployment
Out of the box, this starter kit is deployable by serving the `~/dist` folder generated by `npm run deploy` (make sure to specify your target `NODE_ENV` as well). This project does not concern itself with the details of server-side rendering or API structure, since that demands an opinionated structure that makes it difficult to extend the starter kit. However, if you do need help with more advanced deployment strategies, here are a few tips:

### Static Deployments
If you are serving the application via a web server such as nginx, make sure to direct incoming routes to the root `~/dist/index.html` file and let react-router take care of the rest. The Koa server that comes with the starter kit is able to be extended to serve as an API or whatever else you need, but that's entirely up to you.

### Heroku
More details to come, but in the meantime check out [this helpful comment](https://github.com/davezuko/react-redux-starter-kit/issues/730#issuecomment-213997120) by [DonHansDampf](https://github.com/DonHansDampf) addressing Heroku deployments.

Have more questions? Feel free to submit an issue or join the Gitter chat!

## Build System

### Configuration

Default project configuration can be found in `~/config/index.js`. Here you'll be able to redefine your `src` and `dist` directories, adjust compilation settings, tweak your vendor dependencies, and more. For the most part, you should be able to make changes in here **without ever having to touch the actual webpack build configuration**.

If you need environment-specific overrides (useful for dynamically setting API endpoints, for example), you can edit `~/config/environments.js` and define overrides on a per-NODE_ENV basis. There are examples for both `development` and `production`, so use those as guidelines. Here are some common configuration options:

|Key|Description|
|---|-----------|
|`dir_src`|application source code base path|
|`dir_dist`|path to build compiled application to|
|`server_host`|hostname for the Koa server|
|`server_port`|port for the Koa server|
|`compiler_css_modules`|whether or not to enable CSS modules|
|`compiler_devtool`|what type of source-maps to generate (set to `false`/`null` to disable)|
|`compiler_vendor`|packages to separate into to the vendor bundle|

The platform is coupled to a few services from Birdhouse. As of 2017-04-13, the platform assumes that five specific services are exposed at specific ports and paths of one domain, which is controlled through the BIRDHOUSE_HOST environment variable. This variable will default to outarde.crim.ca, CRIM's preprod Birdhouse server.

```js
  let birdhouseHost = process.env.BIRDHOUSE_HOST || 'outarde.crim.ca';
  let loopbackHost = process.env.LOOPBACK_HOST || 'outarde.crim.ca:3005';
  pavics_malleefowl_path: `http://${birdhouseHost}:8091/wps`,
  pavics_phoenix_path: `https://${birdhouseHost}:8443`,
  pavics_geoserver_path: `http://${birdhouseHost}:8087/geoserver`,
  pavics_ncwms_path: `http://${birdhouseHost}:8080/ncWMS2/wms`,
  pavics_pywps_path: `http://${birdhouseHost}:8086/pywps`,
  loopback_api_path: `http://${loopbackHost}/api`,
```

For now, if one wants to use a custom deployement of either of these services, they must deploy exactly all the others as well, at the ports and paths defined here. These are normally visible on CRIM's github profile.

### Root Resolve
Webpack is configured to make use of [resolve.root](http://webpack.github.io/docs/configuration.html#resolve-root), which lets you import local packages as if you were traversing from the root of your `~/src` directory. Here's an example:

```js
// current file: ~/src/views/some/nested/View.js
// What used to be this:
import SomeComponent from '../../../components/SomeComponent'

// Can now be this:
import SomeComponent from 'components/SomeComponent' // Hooray!
```

### Globals

These are global variables available to you anywhere in your source code. If you wish to modify them, they can be found as the `globals` key in `~/config/index.js`. When adding new globals, make sure you also add them to `~/.eslintrc`.

|Variable|Description|
|---|---|
|`process.env.NODE_ENV`|the active `NODE_ENV` when the build started|
|`__DEV__`|True when `process.env.NODE_ENV` is `development`|
|`__PROD__`|True when `process.env.NODE_ENV` is `production`|
|`__TEST__`|True when `process.env.NODE_ENV` is `test`|
|`__DEBUG__`|True when `process.env.NODE_ENV` is `development` and cli arg `--no_debug` is not set (`npm run dev:no-debug`)|
|`__BASENAME__`|[history basename option](https://github.com/rackt/history/blob/master/docs/BasenameSupport.md)|

### Styles

Both `.scss` and `.css` file extensions are supported out of the box and are configured to use [CSS Modules](https://github.com/css-modules/css-modules). After being imported, styles will be processed with [PostCSS](https://github.com/postcss/postcss) for minification and autoprefixing, and will be extracted to a `.css` file during production builds.

### Server

This starter kit comes packaged with an Koa server. It's important to note that the sole purpose of this server is to provide `webpack-dev-middleware` and `webpack-hot-middleware` for hot module replacement. Using a custom Koa app in place of [webpack-dev-server](https://github.com/webpack/webpack-dev-server) makes it easier to extend the starter kit to include functionality such as API's, universal rendering, and more -- all without bloating the base boilerplate.

### Production Optimization

Babel is configured to use [babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime) so transforms aren't inlined. Additionally, in production, we use [react-optimize](https://github.com/thejameskyle/babel-react-optimize) to further optimize your React code.

In production, webpack will extract styles to a `.css` file, minify your JavaScript, and perform additional optimizations such as module deduplication.

## Learning Resources

* [Starting out with react-redux-starter-kit](https://suspicious.website/2016/04/29/starting-out-with-react-redux-starter-kit/) is an introduction to the components used in this starter kit with a small example in the end.
