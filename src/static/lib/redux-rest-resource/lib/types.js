'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionTypeKey = exports.getActionType = exports.createTypes = exports.createType = exports.getTypesScope = exports.scopeType = undefined;

var _util = require('./helpers/util');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var scopeType = function scopeType(type, scope) {
  return scope ? scope + '/' + type : type;
};

var scopeTypes = function scopeTypes() {
  var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var scope = arguments[1];
  return scope ? (0, _util.mapObject)(types, function (type) {
    return scopeType(type, scope);
  }) : types;
};

var getTypesScope = function getTypesScope(resourceName) {
  return resourceName ? '@@resource/' + (0, _util.upperSnakeCase)(resourceName) : '';
};

var getActionTypeKey = function getActionTypeKey(actionId) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      resourceName = _ref.resourceName,
      _ref$resourcePluralNa = _ref.resourcePluralName,
      resourcePluralName = _ref$resourcePluralNa === undefined ? (0, _util.getPluralName)(resourceName) : _ref$resourcePluralNa,
      _ref$isArray = _ref.isArray,
      isArray = _ref$isArray === undefined ? false : _ref$isArray;

  return resourceName ? actionId.toUpperCase() + '_' + (0, _util.upperSnakeCase)(isArray ? resourcePluralName : resourceName) : (0, _util.upperSnakeCase)(actionId);
};

var getActionType = function getActionType(actionId) {
  return (0, _util.upperSnakeCase)(actionId);
};

var createType = function createType(actionId, _ref2) {
  var resourceName = _ref2.resourceName,
      resourcePluralName = _ref2.resourcePluralName,
      _ref2$isArray = _ref2.isArray,
      isArray = _ref2$isArray === undefined ? false : _ref2$isArray;

  var typeKey = getActionTypeKey(actionId, { resourceName: resourceName, resourcePluralName: resourcePluralName, isArray: isArray });
  return _defineProperty({}, typeKey, getActionType(actionId));
};

var createTypes = function createTypes() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      resourceName = _ref4.resourceName,
      resourcePluralName = _ref4.resourcePluralName,
      _ref4$scope = _ref4.scope,
      scope = _ref4$scope === undefined ? getTypesScope(resourceName) : _ref4$scope;

  var rawTypes = Object.keys(actions).reduce(function (types, actionId) {
    var actionOpts = actions[actionId];
    return Object.assign(types, createType(actionId, { resourceName: resourceName, resourcePluralName: resourcePluralName, isArray: actionOpts.isArray }));
  }, {});
  return scopeTypes(rawTypes, scope);
};

exports.scopeType = scopeType;
exports.getTypesScope = getTypesScope;
exports.createType = createType;
exports.createTypes = createTypes;
exports.getActionType = getActionType;
exports.getActionTypeKey = getActionTypeKey;
//# sourceMappingURL=types.js.map