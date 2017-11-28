'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActions = exports.getActionName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _types = require('./../types');

var _transform = require('./transform');

var _url = require('./../helpers/url');

var _fetch = require('./../helpers/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _util = require('./../helpers/util');

var _reactNotifications = require('react-notifications');

var _defaults = require('./../defaults');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // @inspiration https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js

var SUPPORTED_FETCH_OPTS = ['url', 'method', 'headers', 'credentials', 'query', 'body'];
var SUPPORTED_REDUCE_OPTS = ['assignResponse', 'isArray', 'isPure'];

var getActionName = function getActionName(actionId) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      resourceName = _ref.resourceName,
      _ref$resourcePluralNa = _ref.resourcePluralName,
      resourcePluralName = _ref$resourcePluralNa === undefined ? (0, _util.getPluralName)(resourceName) : _ref$resourcePluralNa,
      _ref$isArray = _ref.isArray,
      isArray = _ref$isArray === undefined ? false : _ref$isArray;

  return !resourceName ? actionId : '' + actionId + (0, _util.ucfirst)(isArray ? resourcePluralName : resourceName);
};

var createAction = function createAction(actionId, _ref2) {
  var resourceName = _ref2.resourceName,
      _ref2$resourcePluralN = _ref2.resourcePluralName,
      resourcePluralName = _ref2$resourcePluralN === undefined ? (0, _util.getPluralName)(resourceName) : _ref2$resourcePluralN,
      scope = _ref2.scope,
      actionOpts = _objectWithoutProperties(_ref2, ['resourceName', 'resourcePluralName', 'scope']);

  var type = (0, _types.scopeType)((0, _types.getActionType)(actionId), scope);
  // Actual action function with two args
  // Context usage changes with resolved method:
  // - GET/DELETE will be used to resolve query params (eg. /users/:id)
  // - POST/PATCH will be used to resolve query params (eg. /users/:id) and as request body
  return function (context) {
    var contextOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function (dispatch, getState) {
      // Prepare reduce options
      var reduceOpts = _extends({}, _util.pick.apply(undefined, [actionOpts].concat(SUPPORTED_REDUCE_OPTS)), _util.pick.apply(undefined, [contextOpts].concat(SUPPORTED_REDUCE_OPTS)));
      // Support pure actions
      if (actionOpts.isPure) {
        dispatch({ type: type, status: 'resolved', options: reduceOpts, context: context });
        return Promise.resolve();
      }
      // First dispatch a pending action
      dispatch({ type: type, status: 'pending', context: context });
      // Prepare fetch options
      var fetchOpts = _extends({}, _util.pick.apply(undefined, [actionOpts].concat(SUPPORTED_FETCH_OPTS)), _util.pick.apply(undefined, [contextOpts].concat(SUPPORTED_FETCH_OPTS)));
      // Support dynamic fetch options
      var resolvedfetchOpts = Object.keys(fetchOpts).reduce(function (soFar, key) {
        soFar[key] = (0, _util.isFunction)(fetchOpts[key]) ? fetchOpts[key](getState, { actionId: actionId }) : fetchOpts[key];
        return soFar;
      }, {});

      var url = resolvedfetchOpts.url,
          eligibleFetchOptions = _objectWithoutProperties(resolvedfetchOpts, ['url']);
      // Build fetch url and options


      var urlParams = (0, _url.parseUrlParams)(url);
      var finalFetchUrl = (0, _fetch.buildFetchUrl)(context, { url: url, urlParams: urlParams });
      var finalFetchOpts = (0, _fetch.buildFetchOpts)(context, eligibleFetchOptions);

      // PAV-451, figured out what verb to be used and if we gotta show something
      var successShowSomething = false;
      var translatedVerb = '';
      var translatedResourceName = resourceName;
      switch ((0, _types.getActionType)(actionId)) {
        case 'CREATE':
          successShowSomething = true;
          translatedVerb = 'created';
          break;
        case 'UPDATE':
          successShowSomething = true;
          translatedVerb = 'updated';
          break;
        case 'DELETE':
          successShowSomething = true;
          translatedVerb = 'deleted';
          break;
        case 'FETCH':
        case 'GET':
          translatedVerb = '';
          successShowSomething = false;
          break;
        default:
          break;
      }

      switch (resourceName) {
        case 'projectResearchs':
          if ((0, _types.getActionType)(actionId) === 'CREATE') translatedVerb = 'linked to project';
        case 'research':
          translatedResourceName = "Search criteria(s)";
          break;
        case 'projectDatasets':
          if ((0, _types.getActionType)(actionId) === 'CREATE') translatedVerb = 'linked to project';
        case 'dataset':
          translatedResourceName = "Dataset";
          break;
        case 'project':
          translatedResourceName = "Project";
          break;
        case 'workflow':
          translatedResourceName = "Workflow";
          break;
        case 'researcher':
          translatedResourceName = "User";
          break;
        case 'job':
          translatedResourceName = "Job";
          break;
      }

      return (0, _fetch2.default)(finalFetchUrl, finalFetchOpts).then((0, _transform.applyTransformPipeline)((0, _transform.buildTransformPipeline)(_defaults.defaultTransformResponsePipeline, actionOpts.transformResponse))).then(function (payload) {
        if (successShowSomething) {
          _reactNotifications.NotificationManager.success(translatedResourceName + ' was ' + translatedVerb + ' with success');
        }
        dispatch(_extends({ type: type, status: 'resolved', context: context, options: reduceOpts, receivedAt: Date.now() }, payload));
      }).catch(function (err) {
        // Catch HttpErrors
        _reactNotifications.NotificationManager.error(translatedResourceName + ' failed at being ' + translatedVerb + ': Error ' + err.statusCode + ' ' + err.body.error.message);
        if (err.statusCode) {
          dispatch({
            type: type,
            status: 'rejected',
            code: err.statusCode,
            body: err.body,
            context: context,
            options: reduceOpts,
            receivedAt: Date.now()
          });
          // Catch regular Errors
        } else {
          dispatch({
            type: type,
            status: 'rejected',
            err: err,
            context: context,
            options: reduceOpts,
            receivedAt: Date.now()
          });
        }
        throw err;
      });
    };
  };
};

var createActions = function createActions() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var resourceName = _ref3.resourceName,
      _ref3$resourcePluralN = _ref3.resourcePluralName,
      resourcePluralName = _ref3$resourcePluralN === undefined ? (0, _util.getPluralName)(resourceName) : _ref3$resourcePluralN,
      _ref3$scope = _ref3.scope,
      scope = _ref3$scope === undefined ? (0, _types.getTypesScope)(resourceName) : _ref3$scope,
      globalOpts = _objectWithoutProperties(_ref3, ['resourceName', 'resourcePluralName', 'scope']);

  var actionKeys = Object.keys(actions);
  return actionKeys.reduce(function (actionFuncs, actionId) {
    // Add support for relative url override
    var url = actions[actionId].url;

    if (globalOpts.url && url && (0, _util.isString)(url) && url.substr(0, 1) === '.') {
      actions[actionId] = _extends({}, actions[actionId], { url: '' + globalOpts.url + url.substr(1) });
    }
    var actionOpts = _extends({}, globalOpts, actions[actionId]);
    var actionName = getActionName(actionId, { resourceName: resourceName, resourcePluralName: resourcePluralName, isArray: actionOpts.isArray });
    actionFuncs[actionName] = createAction(actionId, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName, scope: scope }, actionOpts));
    return actionFuncs;
  }, {});
};

exports.getActionName = getActionName;
exports.createActions = createActions;
//# sourceMappingURL=index.js.map