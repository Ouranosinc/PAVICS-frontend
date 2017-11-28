'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var includes = exports.includes = function includes(array, key) {
  return array.indexOf(key) !== -1;
};

var isString = exports.isString = function isString(maybeString) {
  return typeof maybeString === 'string';
};

var isObject = exports.isObject = function isObject(maybeObject) {
  return (typeof maybeObject === 'undefined' ? 'undefined' : _typeof(maybeObject)) === 'object';
};

var isFunction = exports.isFunction = function isFunction(maybeFunction) {
  return typeof maybeFunction === 'function';
};

var pick = exports.pick = function pick(obj) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  return keys.reduce(function (soFar, key) {
    if (includes(keys, key) && obj[key] !== undefined) {
      soFar[key] = obj[key]; // eslint-disable-line no-param-reassign
    }
    return soFar;
  }, {});
};

var mapObject = exports.mapObject = function mapObject(object, func) {
  return Object.keys(object).reduce(function (soFar, key) {
    soFar[key] = func(object[key]); // eslint-disable-line no-param-reassign
    return soFar;
  }, {});
};

var mergeObjects = exports.mergeObjects = function mergeObjects(object) {
  for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }

  var concat = Array.prototype.concat;

  var uniqueKeys = concat.apply(Object.keys(object), sources.map(Object.keys)).filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
  return uniqueKeys.reduce(function (soFar, key) {
    soFar[key] = Object.assign.apply(Object, [soFar[key] || {}].concat(_toConsumableArray(sources.map(function (source) {
      return source[key] || {};
    })))); // eslint-disable-line no-param-reassign
    return soFar;
  }, object);
};

var startsWith = exports.startsWith = function startsWith(string, target) {
  return String(string).slice(0, target.length) === target;
};

var ucfirst = exports.ucfirst = function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

var upperSnakeCase = exports.upperSnakeCase = function upperSnakeCase(string) {
  return String(string.split('').reduce(function (soFar, letter, index) {
    var charCode = letter.charCodeAt(0);
    return soFar + (index && charCode < 97 ? '_' + letter : letter).toUpperCase();
  }, ''));
};

var getGerundName = exports.getGerundName = function getGerundName(name) {
  return name.replace(/e$/, '') + 'ing';
};

var getPluralName = exports.getPluralName = function getPluralName(name) {
  return name + 's';
};
//# sourceMappingURL=util.js.map