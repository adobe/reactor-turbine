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
var readCookie = require('./utils/cookie/readCookie');
var removeCookie = require('./utils/cookie/removeCookie');
var preprocessConfig = require('./utils/preprocessConfig');
var logger = require('./utils/logger');

var _satellite = window._satellite;
var container = _satellite.container;

// Will get replaced by the pageBottom event delegate.
_satellite.pageBottom = function() {};
// Will get replaced by the directCall event delegate.
_satellite.track = function() {};
_satellite.appVersion = container.appVersion;
_satellite.notify = logger.notify;
_satellite.getVar = getVar;
_satellite.setVar = setVar;
// TODO: _satellite.getVisitorId
_satellite.setCookie = setCookie;
_satellite.readCookie = readCookie;
_satellite.removeCookie = removeCookie;
_satellite.isLinked = function(element) {
  return isAnchor(element, true);
};

logger.outputEnabled = container.config.notifications;
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
  actionDelegates);
