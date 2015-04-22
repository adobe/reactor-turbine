var globalPolling = require('./utils/public/globalPolling');
var dynamicListener = require('./utils/public/dynamicListener');
var createExtensionInstances = require('./createExtensionInstances');
var initRules = require('./initRules');
var utils = require('./utils/public/index');
var data = require('./data/public/index');

var _satellite = window._satellite;
var propertyMeta = _satellite.getConfig(data, utils);

_satellite.pageBottom = function() {}; // Will get replaced if a rule is configured with a page bottom event trigger.
_satellite.runRule = function() {}; // Will get replaced if a rule is configured with a direct call event trigger.
_satellite.appVersion = propertyMeta.appVersion;

var extensionInstanceRegistry = require('./extensionInstanceRegistry');
createExtensionInstances(propertyMeta, extensionInstanceRegistry);
initRules(propertyMeta, extensionInstanceRegistry);

globalPolling.init();
dynamicListener.init();
