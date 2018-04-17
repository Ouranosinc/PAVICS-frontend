'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyTransformPipeline = exports.buildTransformPipeline = undefined;

var _defaults = require('./../defaults');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var buildTransformPipeline = function buildTransformPipeline(initial, transform) {
  var transformResponsePipeline = void 0;
  if (transform) {
    transformResponsePipeline = Array.isArray(transform) ? transform : [].concat(_toConsumableArray(initial), [transform]);
  } else {
    transformResponsePipeline = [].concat(_toConsumableArray(initial));
  }
  return transformResponsePipeline;
};
var applyTransformPipeline = function applyTransformPipeline(pipeline) {
  // eslint-disable-line arrow-body-style
  return function (initial) {
    return pipeline.reduce(function (soFar, fn) {
      return soFar.then(fn);
    }, _defaults.defaultGlobals.Promise.resolve(initial));
  };
};

exports.buildTransformPipeline = buildTransformPipeline;
exports.applyTransformPipeline = applyTransformPipeline;
//# sourceMappingURL=transform.js.map