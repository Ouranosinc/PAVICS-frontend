'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFetchOpts = exports.buildFetchUrl = exports.HttpError = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _util = require('./util');

var _url = require('./url');

var _defaults = require('./../defaults');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpError = exports.HttpError = function (_Error) {
  _inherits(HttpError, _Error);

  function HttpError() {
    var statusCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
    var _ref = arguments[1];
    var body = _ref.body,
        _ref$message = _ref.message,
        message = _ref$message === undefined ? 'HttpError' : _ref$message;

    _classCallCheck(this, HttpError);

    var _this = _possibleConstructorReturn(this, (HttpError.__proto__ || Object.getPrototypeOf(HttpError)).call(this, message));

    _this.name = _this.constructor.name;
    _this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(_this, _this.constructor);
    } else {
      _this.stack = new Error(message).stack;
    }
    // Http
    _this.statusCode = statusCode;
    _this.status = statusCode;
    _this.body = body;
    return _this;
  }

  return HttpError;
}(Error);

var buildFetchUrl = exports.buildFetchUrl = function buildFetchUrl(context, _ref2) {
  var url = _ref2.url,
      urlParams = _ref2.urlParams,
      _ref2$stripTrailingSl = _ref2.stripTrailingSlashes,
      stripTrailingSlashes = _ref2$stripTrailingSl === undefined ? true : _ref2$stripTrailingSl;

  var _splitUrlByProtocolAn = (0, _url.splitUrlByProtocolAndDomain)(url),
      _splitUrlByProtocolAn2 = _slicedToArray(_splitUrlByProtocolAn, 2),
      protocolAndDomain = _splitUrlByProtocolAn2[0],
      remainderUrl = _splitUrlByProtocolAn2[1];
  // Replace urlParams with values from context


  var builtUrl = Object.keys(urlParams).reduce(function (wipUrl, urlParam) {
    var urlParamInfo = urlParams[urlParam];
    var contextAsObject = !(0, _util.isObject)(context) ? { id: context } : context;
    var value = contextAsObject[urlParam] || ''; // self.defaults[urlParam];
    if (value) {
      var encodedValue = urlParamInfo.isQueryParamValue ? (0, _url.encodeUriQuery)(value, true) : (0, _url.encodeUriSegment)(value);
      return (0, _url.replaceUrlParamFromUrl)(wipUrl, urlParam, encodedValue);
    }
    return (0, _url.replaceUrlParamFromUrl)(wipUrl, urlParam);
  }, remainderUrl);
  // Strip trailing slashes and set the url (unless this behavior is specifically disabled)
  if (stripTrailingSlashes) {
    builtUrl = builtUrl.replace(/\/+$/, '') || '/';
  }
  return protocolAndDomain + builtUrl;
};

var buildFetchOpts = exports.buildFetchOpts = function buildFetchOpts(context, _ref3) {
  var method = _ref3.method,
      headers = _ref3.headers,
      credentials = _ref3.credentials,
      query = _ref3.query,
      body = _ref3.body;

  var opts = {
    headers: _defaults.defaultHeaders
  };
  if (method) {
    opts.method = method;
  }
  if (headers) {
    opts.headers = _extends({}, opts.headers, headers);
  }
  if (credentials) {
    opts.credentials = credentials;
  }
  if (query) {
    opts.query = query;
  }
  var hasBody = /^(POST|PUT|PATCH)$/i.test(opts.method);
  if (hasBody) {
    if (body) {
      opts.body = (0, _util.isString)(body) ? body : JSON.stringify(body);
    } else if (context) {
      opts.body = (0, _util.isString)(context) ? context : JSON.stringify(context);
    }
  }
  return opts;
};

var fetch = function fetch(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Support options.query
  var builtUrl = Object.keys(options.query || []).reduce(function (wipUrl, queryParam) {
    var queryParamValue = (0, _util.isString)(options.query[queryParam]) ? options.query[queryParam] : JSON.stringify(options.query[queryParam]);
    return (0, _url.replaceQueryStringParamFromUrl)(wipUrl, queryParam, queryParamValue);
  }, url);
  return (options.Promise || _defaults.defaultGlobals.Promise).resolve((_defaults.defaultGlobals.fetch || fetch)(builtUrl, options)).then(function (res) {
    if (!res.ok) {
      var contentType = res.headers.get('Content-Type');
      var isJson = (0, _util.startsWith)(contentType, 'application/json');
      return res[isJson ? 'json' : 'text']().then(function (body) {
        throw new HttpError(res.status, { body: body });
      });
    }
    return res;
  });
};

exports.default = fetch;
//# sourceMappingURL=fetch.js.map