'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRootReducer = exports.createReducers = exports.defaultReducers = exports.initialState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaults = require('./../defaults');

var _types = require('./../types');

var _util = require('./../helpers/util');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultReducers = {
  create: function create(state, action) {
    switch (action.status) {
      case 'pending':
        // Add object to store as soon as possible?
        return _extends({}, state, {
          isCreating: true
          // items: [{
          //   id: state.items.reduce((maxId, obj) => Math.max(obj.id, maxId), -1) + 1,
          //   ...action.context
          // }, ...state.items]
        });
      case 'resolved':
        // Assign returned object
        return _extends({}, state, {
          isCreating: false,
          items: [].concat(_toConsumableArray(state.items || []), [action.body])
        });
      case 'rejected':
        return _extends({}, state, {
          isCreating: false
        });
      default:
        return state;
    }
  },
  fetch: function fetch(state, action) {
    switch (action.status) {
      case 'pending':
        return _extends({}, state, {
          isFetching: true,
          didInvalidate: false
        });
      case 'resolved':
        return _extends({}, state, {
          isFetching: false,
          didInvalidate: false,
          items: action.body,
          lastUpdated: action.receivedAt
        });
      case 'rejected':
        return _extends({}, state, {
          isFetching: false,
          didInvalidate: false
        });
      default:
        return state;
    }
  },
  get: function get(state, action) {
    switch (action.status) {
      case 'pending':
        return _extends({}, state, {
          isFetchingItem: true,
          didInvalidateItem: false
        });
      case 'resolved':
        {
          var actionOpts = action.options || {};
          var item = action.body;
          var update = {};
          if (actionOpts.assignResponse) {
            var updatedItems = state.items;
            var listItemIndex = updatedItems.findIndex(function (el) {
              return el.id === item.id;
            });
            if (listItemIndex !== -1) {
              updatedItems.splice(listItemIndex, 1, item);
              update.items = updatedItems.slice();
            }
          }
          return _extends({}, state, {
            isFetchingItem: false,
            didInvalidateItem: false,
            lastUpdatedItem: action.receivedAt,
            item: item
          }, update);
        }
      case 'rejected':
        return _extends({}, state, {
          isFetchingItem: false,
          didInvalidateItem: false
        });
      default:
        return state;
    }
  },
  update: function update(state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, {
          isUpdating: true
        });
      case 'resolved':
        {
          // Assign context or returned object
          var id = action.context.id || action.context;
          var actionOpts = action.options || {};
          var update = actionOpts.assignResponse ? action.body : action.context;
          var listItemIndex = state.items.findIndex(function (el) {
            return el.id === id;
          });
          var updatedItems = state.items.slice();
          if (listItemIndex !== -1) {
            updatedItems[listItemIndex] = _extends({}, updatedItems[listItemIndex], update);
          }
          var updatedItem = state.item && state.item.id === id ? _extends({}, state.item, update) : state.item;
          return _extends({}, state, {
            isUpdating: false,
            items: updatedItems,
            item: updatedItem
          });
        }
      case 'rejected':
        return _extends({}, state, {
          isUpdating: false
        });
      default:
        return state;
    }
  },
  delete: function _delete(state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, {
          isDeleting: true
        });
      case 'resolved':
        // eslint-disable-line
        var id = action.context.id || action.context;
        return _extends({}, state, {
          isDeleting: false,
          items: [].concat(_toConsumableArray(state.items.filter(function (el) {
            return el.id !== id;
          })))
        });
      case 'rejected':
        return _extends({}, state, {
          isDeleting: false
        });
      default:
        return state;
    }
  }
};

var createReducer = function createReducer(actionId, _ref) {
  var resourceName = _ref.resourceName,
      _ref$resourcePluralNa = _ref.resourcePluralName,
      resourcePluralName = _ref$resourcePluralNa === undefined ? resourceName + 's' : _ref$resourcePluralNa,
      actionOpts = _objectWithoutProperties(_ref, ['resourceName', 'resourcePluralName']);

  // Custom reducers
  if (actionOpts.reduce && (0, _util.isFunction)(actionOpts.reduce)) {
    return actionOpts.reduce;
  }
  // Do require a custom reduce function for pure actions
  if (actionOpts.isPure) {
    throw new Error('Missing `reduce` option for pure action `' + actionId + '`');
  }
  // Default reducers
  if (defaultReducers[actionId]) {
    return defaultReducers[actionId];
  }
  // Custom actions
  var gerundName = actionOpts.gerundName || (0, _util.getGerundName)(actionId);
  var gerundStateKey = 'is' + (0, _util.ucfirst)(gerundName);
  return function (state, action) {
    switch (action.status) {
      case 'pending':
        // Update object in store as soon as possible?
        return _extends({}, state, _defineProperty({}, gerundStateKey, true));
      case 'resolved':
        // eslint-disable-line
        return _extends({}, state, _defineProperty({}, gerundStateKey, false));
      case 'rejected':
        return _extends({}, state, _defineProperty({}, gerundStateKey, false));
      default:
        return state;
    }
  };
};

var createReducers = function createReducers() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var resourceName = _ref2.resourceName,
      resourcePluralName = _ref2.resourcePluralName,
      globalOpts = _objectWithoutProperties(_ref2, ['resourceName', 'resourcePluralName']);

  var actionKeys = Object.keys(actions);
  return actionKeys.reduce(function (actionReducers, actionId) {
    var actionOpts = _extends({}, globalOpts, actions[actionId]);
    var reducerKey = (0, _types.getActionType)(actionId).toLowerCase();
    actionReducers[reducerKey] = createReducer(actionId, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, actionOpts));
    return actionReducers;
  }, {});
};

var createRootReducer = function createRootReducer() {
  var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var resourceName = _ref3.resourceName,
      resourcePluralName = _ref3.resourcePluralName,
      _ref3$scope = _ref3.scope,
      scope = _ref3$scope === undefined ? (0, _types.getTypesScope)(resourceName) : _ref3$scope,
      givenReducers = _ref3.reducers,
      globalOpts = _objectWithoutProperties(_ref3, ['resourceName', 'resourcePluralName', 'scope', 'reducers']);

  var scopeNamespace = scope ? scope + '/' : '';
  var reducers = givenReducers || createReducers(actions, _extends({ resourceName: resourceName, resourcePluralName: resourcePluralName }, globalOpts));
  var rootReducer = function rootReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _extends({}, _defaults.initialState);
    var action = arguments[1];

    // Only process relevant namespace
    if (scopeNamespace && !String(action.type).startsWith(scopeNamespace)) {
      return state;
    }
    // Only process relevant action type
    var type = action.type.substr(scopeNamespace.length).toLowerCase();
    // Check for a matching reducer
    if (reducers[type]) {
      return reducers[type](state, action);
    }
    return state;
  };
  return rootReducer;
};

exports.initialState = _defaults.initialState;
exports.defaultReducers = defaultReducers;
exports.createReducers = createReducers;
exports.createRootReducer = createRootReducer;
//# sourceMappingURL=index.js.map