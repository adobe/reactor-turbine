var globalPolling = require('./utils/public/globalPolling');
var dynamicListener = require('./utils/public/dynamicListener');
var createExtensionInstances = require('./createExtensionInstances');
var initRules = require('./initRules');
var utils = require('./utils/public/index');
var dataElementDefinitions = require('./stores/dataElementDefinitions');

var _satellite = window._satellite;
var propertyMeta = _satellite.getConfig(utils);

_satellite.pageBottom = function() {}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.runRule = function() {}; // Will get replaced if a rule is configured with a direct call event trigger.
_satellite.appVersion = propertyMeta.appVersion;

// TODO: Re-assess this when I understand more about data elements.
dataElementDefinitions.add(propertyMeta.dataElements);

var extensionInstanceRegistry = require('./stores/extensionInstanceRegistry');
createExtensionInstances(propertyMeta, extensionInstanceRegistry);
initRules(propertyMeta, extensionInstanceRegistry);

globalPolling.init();
dynamicListener.init();


// TODO: Do we want these exposed?
_satellite.getVar = utils.getVar;
_satellite.setVar = utils.setVar;
