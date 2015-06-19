var createIntegrations = require('./createIntegrations');
var initRules = require('./initRules');
var dataElementDefinitions = require('./stores/dataElementDefinitions');
var eventDelegates = require('./stores/extensionDelegates/eventDelegates');
var dataElementDelegates = require('./stores/extensionDelegates/dataElementDelegates');
var conditionDelegates = require('./stores/extensionDelegates/conditionDelegates');
var coreDelegates = require('./stores/extensionDelegates/coreDelegates');
var integrationRegistry = require('./stores/integrationRegistry');
var getVar = require('./utils/dataElement/getVar');
var setVar = require('./utils/dataElement/setVar');
var isAnchor = require('./utils/dom/isAnchor');
var setCookie = require('./utils/cookie/setCookie');
var readCookie = require('./utils/cookie/readCookie');
var removeCookie = require('./utils/cookie/removeCookie');

var _satellite = window._satellite;
var propertyMeta = _satellite.getConfig();

_satellite.pageBottom = function() {}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.track = function() {}; // Will get replaced if a rule is configured with a direct call event trigger.
_satellite.appVersion = propertyMeta.appVersion;
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

eventDelegates.init(propertyMeta.eventDelegates);
dataElementDelegates.init(propertyMeta.dataElementDelegates);
conditionDelegates.init(propertyMeta.conditionDelegates);
dataElementDefinitions.init(propertyMeta.dataElements);
coreDelegates.init(propertyMeta.coreDelegates);

createIntegrations(propertyMeta.integrations, integrationRegistry, coreDelegates);
initRules(propertyMeta.rules, integrationRegistry, eventDelegates, conditionDelegates);

