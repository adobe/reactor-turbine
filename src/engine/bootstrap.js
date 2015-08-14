var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';
var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';

var createExtensionCores = require('./createExtensionCores');
var initRules = require('./initRules');
var dataElementDefinitions = require('./stores/dataElementDefinitions');
var eventDelegates = require('./stores/extensionDelegates/eventDelegates');
var conditionDelegates = require('./stores/extensionDelegates/conditionDelegates');
var actionDelegates = require('./stores/extensionDelegates/actionDelegates');
var dataElementDelegates = require('./stores/extensionDelegates/dataElementDelegates');
var coreDelegates = require('./stores/extensionDelegates/coreDelegates');
var coreRegistry = require('./stores/coreRegistry');
var getVar = require('./utils/dataElement/getVar');
var setVar = require('./utils/dataElement/setVar');
var isAnchor = require('./utils/dom/isAnchor');
var setCookie = require('./utils/cookie/setCookie');
var getCookie = require('./utils/cookie/getCookie');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');
var removeCookie = require('./utils/cookie/removeCookie');
var preprocessConfig = require('./utils/preprocessConfig');
var logger = require('./utils/logger');

var _satellite = window._satellite;
var container = _satellite.container;

// Will get replaced by the pageBottom event delegate. Exists here in case there are no page bottom
// rules (and therefore the pageBottom event delegate won't get included) and our customers
// are still calling the method.
_satellite.pageBottom = function() {};
// Will get replaced by the directCall event delegate. Exists here in case there are no direct
// call rules (and therefore the directCall event delegate won't get included) and our customers
// are still calling the method.
_satellite.track = function() {};
_satellite.appVersion = container.appVersion;
_satellite.notify = logger.notify.bind(logger);
_satellite.getVar = getVar;
_satellite.setVar = setVar;
// TODO: _satellite.getVisitorId
_satellite.setCookie = setCookie;
_satellite.readCookie = getCookie;
_satellite.removeCookie = removeCookie;
_satellite.isLinked = function(element) {
  return isAnchor(element, true);
};
_satellite.setDebug = function(value) {
  setLocalStorageItem(DEBUG_LOCAL_STORAGE_NAME, value);
  logger.outputEnabled = value;
};

// This setting is primarily used by browser plugins.
logger.outputEnabled = getLocalStorageItem(DEBUG_LOCAL_STORAGE_NAME) === 'true';

// TODO: For use during development in order to see errors in the console from rule execution.
//logger.outputEnabled = true;

preprocessConfig.init(container.config.undefinedVarsReturnEmpty);
eventDelegates.init(container.eventDelegates);
conditionDelegates.init(container.conditionDelegates);
actionDelegates.init(container.actionDelegates);
dataElementDelegates.init(container.dataElementDelegates);
dataElementDefinitions.init(container.dataElements);
coreDelegates.init(container.coreDelegates);

createExtensionCores(
  container,
  coreRegistry,
  coreDelegates);

initRules(
  container,
  eventDelegates,
  conditionDelegates,
  actionDelegates,
  getLocalStorageItem(HIDE_ACTIVITY_LOCAL_STORAGE_NAME) !== 'true');
