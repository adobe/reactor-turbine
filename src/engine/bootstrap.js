var createExtensionInstances = require('./createExtensionInstances');
var initRules = require('./initRules');
var dataElementDefinitions = require('./stores/dataElementDefinitions');
var eventDelegates = require('./stores/extensionDelegates/eventDelegates');
var dataElementDelegates = require('./stores/extensionDelegates/dataElementDelegates');
var conditionDelegates = require('./stores/extensionDelegates/conditionDelegates');
var coreDelegates = require('./stores/extensionDelegates/coreDelegates');
var extensionInstanceRegistry = require('./stores/extensionInstanceRegistry');
var getVar = require('./utils/dataElement/getVar');
var setVar = require('./utils/dataElement/setVar');

var _satellite = window._satellite;
var propertyMeta = _satellite.getConfig();

_satellite.pageBottom = function() {}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.runRule = function() {}; // Will get replaced if a rule is configured with a direct call event trigger.
_satellite.appVersion = propertyMeta.appVersion;

eventDelegates.init(propertyMeta.eventDelegates);
dataElementDelegates.init(propertyMeta.dataElementDelegates);
conditionDelegates.init(propertyMeta.conditionDelegates);
dataElementDefinitions.init(propertyMeta.dataElements);
coreDelegates.init(propertyMeta.coreDelegates);

createExtensionInstances(propertyMeta.extensionInstances, extensionInstanceRegistry, coreDelegates);
initRules(propertyMeta.rules, extensionInstanceRegistry, eventDelegates, conditionDelegates);

_satellite.getVar = getVar;
_satellite.setVar = setVar;
