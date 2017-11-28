"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reduceReducers = function reduceReducers() {
  for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {
    reducers[_key] = arguments[_key];
  }

  return function (state, action) {
    return reducers.reduce(function (stateSoFar, reducer) {
      return reducer(stateSoFar, action);
    }, state);
  };
};

var combineReducers = function combineReducers() {
  for (var _len2 = arguments.length, reducers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    reducers[_key2] = arguments[_key2];
  }

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];
    return reducers.reduce(function (stateSoFar, reducerMap) {
      return Object.keys(reducerMap).reduce(function (innerStateSoFar, key) {
        var reducer = reducerMap[key];
        var previousStateForKey = stateSoFar[key];
        var nextStateForKey = reducer(previousStateForKey, action);
        return _extends({}, innerStateSoFar, _defineProperty({}, key, nextStateForKey));
      }, stateSoFar);
    }, state);
  };
};

var mergeReducers = function mergeReducers(baseReducer) {
  for (var _len3 = arguments.length, reducers = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    reducers[_key3 - 1] = arguments[_key3];
  }

  var combinedReducers = combineReducers.apply(undefined, reducers);
  return function (state, action) {
    return combinedReducers(baseReducer(state, action), action);
  };
};

exports.reduceReducers = reduceReducers;
exports.combineReducers = combineReducers;
exports.mergeReducers = mergeReducers;
//# sourceMappingURL=helpers.js.map