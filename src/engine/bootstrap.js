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

var _satellite = window._satellite;
var property = _satellite.getConfig();

// Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.pageBottom = function() {};
// Will get replaced if a rule is configured with a direct call event trigger.
_satellite.track = function() {};
_satellite.appVersion = property.appVersion;
// TODO: _satellite.notify
_satellite.getVar = getVar;
_satellite.setVar = setVar;
// TODO: _satellite.getVisitorId
_satellite.setCookie = setCookie;
_satellite.readCookie = readCookie;
_satellite.removeCookie = removeCookie;
_satellite.isLinked = function(element) {
  return isAnchor(element, true);
};

eventDelegates.init(property.eventDelegates);
conditionDelegates.init(property.conditionDelegates);
actionDelegates.init(property.actionDelegates);
dataElementDelegates.init(property.dataElementDelegates);
dataElementDefinitions.init(property.dataElements);
coreDelegates.init(property.coreDelegates);

createExtensionCores(
  property,
  coreRegistry,
  coreDelegates);

initRules(
  property,
  eventDelegates,
  conditionDelegates,
  actionDelegates);
