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
var property = _satellite.getConfig();

_satellite.pageBottom = function() {
}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.track = function() {
}; // Will get replaced if a rule is configured with a direct call event trigger.
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
dataElementDelegates.init(property.dataElementDelegates);
conditionDelegates.init(property.conditionDelegates);
dataElementDefinitions.init(property.dataElements);
coreDelegates.init(property.coreDelegates);

createIntegrations(property.integrations, integrationRegistry, coreDelegates, property.settings);
initRules(property.rules, property.settings, integrationRegistry, eventDelegates, conditionDelegates);

