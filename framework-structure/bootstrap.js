var EventEmitter = require('./utils/public/EventEmitter');

window._satellite = {};
_satellite.utils = require('./utils/public/index');
_satellite.data = require('./data/public/index');
_satellite.runRule = require('./hooks/runRule');
_satellite.pageBottom = require('./hooks/pageBottom');

var dynamicListener = require('./utils/private/dynamicListener');
var globalPolling = require('./utils/private/globalPolling');
var createExtensionInstances = require('./extensions/createExtensionInstances');
var propertyMeta = require('./initConfig');

_satellite.appVersion = propertyMeta.appVersion;
_satellite.extensionInstances = createExtensionInstances(propertyMeta);
require('./rules/initRules')();
//TODO: move polling from dynamic listener out to a global place
//TODO: add logic to check conditions
globalPolling.init();
dynamicListener.init();
