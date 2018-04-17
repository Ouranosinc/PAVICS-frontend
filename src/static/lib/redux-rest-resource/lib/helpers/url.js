'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// https://github.com/angular/angular.js/blob/master/src/ngResource/resource.js#L473

var PROTOCOL_AND_DOMAIN_REGEX = /^https?:\/\/[^/]*/;
var NUMBER_REGEX = /^[0-9]+$/;

/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a
 * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
 * have to be encoded per http://tools.ietf.org/html/rfc3986
 */
var encodeUriQuery = exports.encodeUriQuery = function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
};

/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
 * (pchar) allowed in path segments
 */
var encodeUriSegment = exports.encodeUriSegment = function encodeUriSegment(val) {
  return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
};

var parseUrlParams = exports.parseUrlParams = function parseUrlParams(url) {
  return url.split(/\W/).reduce(function (urlParams, param) {
    if (!NUMBER_REGEX.test(param) && param && new RegExp('(^|[^\\\\]):' + param + '(\\W|$)').test(url)) {
      urlParams[param] = { // eslint-disable-line no-param-reassign
        isQueryParamValue: new RegExp('\\?.*=:' + param + '(?:\\W|$)').test(url)
      };
    }
    return urlParams;
  }, {});
};

var replaceUrlParamFromUrl = exports.replaceUrlParamFromUrl = function replaceUrlParamFromUrl(url, urlParam) {
  var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return url.replace(new RegExp('(/?):' + urlParam + '(\\W|$)', 'g'), function (match, leadingSlashes, tail) {
    return (replace || tail.charAt(0) === '/' ? leadingSlashes : '') + replace + tail;
  });
};

var replaceQueryStringParamFromUrl = exports.replaceQueryStringParamFromUrl = function replaceQueryStringParamFromUrl(url, key, value) {
  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  var sep = url.indexOf('?') !== -1 ? '&' : '?';
  return url.match(re) ? url.replace(re, '$1' + key + '=' + value + '$2') : '' + url + sep + key + '=' + value;
};

var splitUrlByProtocolAndDomain = exports.splitUrlByProtocolAndDomain = function splitUrlByProtocolAndDomain(url) {
  var protocolAndDomain = void 0;
  var remainderUrl = url.replace(PROTOCOL_AND_DOMAIN_REGEX, function (match) {
    protocolAndDomain = match;
    return '';
  });
  return [protocolAndDomain, remainderUrl];
};
//# sourceMappingURL=url.js.map