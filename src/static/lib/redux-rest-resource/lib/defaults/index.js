'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global fetch */

var defaultActions = {
  create: { method: 'POST', alias: 'save' },
  fetch: { method: 'GET', isArray: true },
  get: { method: 'GET' },
  update: { method: 'PUT' },
  delete: { method: 'DELETE' }
};

var defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

var defaultTransformResponsePipeline = [
// Now won't crash anymore on "204 - No Content" results
function (res) {
  return res.status === 200 ? res.json().then(function (body) {
    return { body: body, code: res.status };
  }) : { body: null, code: res.status };
}];

var defaultState = {
  create: {
    isCreating: false
  },
  fetch: {
    items: [],
    isFetching: false,
    lastUpdated: 0,
    didInvalidate: true
  },
  get: {
    item: null,
    isFetchingItem: false,
    lastUpdatedItem: 0,
    didInvalidateItem: true
  },
  update: {
    isUpdating: false
  },
  delete: {
    isDeleting: false
  }
};

var initialState = Object.keys(defaultState).reduce(function (soFar, key) {
  return _extends({}, soFar, defaultState[key]);
}, {});

var defaultGlobals = {
  Promise: Promise,
  fetch: fetch
};

exports.defaultGlobals = defaultGlobals;
exports.defaultActions = defaultActions;
exports.defaultHeaders = defaultHeaders;
exports.defaultTransformResponsePipeline = defaultTransformResponsePipeline;
exports.defaultState = defaultState;
exports.initialState = initialState;
//# sourceMappingURL=index.js.map