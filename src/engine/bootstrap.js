var globalPolling = require('./utils/globalPolling');
var dynamicListener = require('./utils/dynamicListener');
var createExtensionInstances = require('./createExtensionInstances');
var initRules = require('./initRules');
var dataElementDefinitions = require('./stores/dataElementDefinitions');
var extensionInstanceRegistry = require('./stores/extensionInstanceRegistry');
var getVar = require('./utils/getVar');
var setVar = require('./utils/setVar');

var _satellite = window._satellite;
var propertyMeta = _satellite.getConfig();

_satellite.pageBottom = function() {}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.runRule = function() {}; // Will get replaced if a rule is configured with a direct call event trigger.
_satellite.appVersion = propertyMeta.appVersion;

// TODO: Re-assess this when I understand more about data elements.
dataElementDefinitions.add(propertyMeta.dataElements);

createExtensionInstances(propertyMeta, extensionInstanceRegistry);
initRules(propertyMeta, extensionInstanceRegistry);

globalPolling.init();
dynamicListener.init();

// TODO: Do we want these exposed?
_satellite.getVar = getVar;
_satellite.setVar = setVar;
