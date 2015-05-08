var globalPolling = require('./utils/globalPolling');
var dynamicListener = require('./utils/dynamicListener');
var createExtensionInstances = require('./createExtensionInstances');
var initRules = require('./initRules');
var dataElementDefinitions = require('./stores/dataElementDefinitions');
var eventDelegates = require('./stores/eventDelegates');
var dataElementDelegates = require('./stores/dataElementDelegates');
var conditionDelegates = require('./stores/conditionDelegates');
var extensionDelegates = require('./stores/extensionDelegates');
var extensionInstanceRegistry = require('./stores/extensionInstanceRegistry');
var getVar = require('./utils/getVar');
var setVar = require('./utils/setVar');

var _satellite = window._satellite;
var propertyMeta = _satellite.getConfig();

_satellite.pageBottom = function() {}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.runRule = function() {}; // Will get replaced if a rule is configured with a direct call event trigger.
_satellite.appVersion = propertyMeta.appVersion;

eventDelegates.init(propertyMeta.eventDelegates);
dataElementDelegates.init(propertyMeta.dataElementDelegates);
conditionDelegates.init(propertyMeta.conditionDelegates);
extensionDelegates.init(propertyMeta.extensionDelegates);
dataElementDefinitions.init(propertyMeta.dataElements);

createExtensionInstances(propertyMeta.extensionInstances, extensionInstanceRegistry, extensionDelegates);
initRules(propertyMeta.rules, extensionInstanceRegistry, eventDelegates, conditionDelegates);

globalPolling.init();
dynamicListener.init();

// TODO: Do we want these exposed?
_satellite.getVar = getVar;
_satellite.setVar = setVar;
