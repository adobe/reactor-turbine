var dynamicListener = require('./utils/private/dynamicListener');
var globalPolling = require('./utils/private/globalPolling');

window._satellite = {};

_satellite.utils = require('./utils/public/index');
_satellite.data = require('./data/public/index');
_satellite.pageBottom = require('./pageBottom');

// TODO: This will need to be more flexible to handle inclusion of only the extensions
// configured for the property.
_satellite.availableExtensions = {
  adobeAnalytics: require('./extensions/AdobeAnalytics'),
  adobeTarget: require('./extensions/AdobeTarget'),
  adobeAlert: require('./extensions/AdobeAlert')
};

var createExtensionInstances = function(propertyMeta) {
  var instances = {};

  for (var extensionInstanceId in propertyMeta.extensions) {
    var extensionInstanceMeta = propertyMeta.extensions[extensionInstanceId];
    var extensionId = extensionInstanceMeta.extensionId;
    var Extension = _satellite.availableExtensions[extensionId];
    var extensionInstance = new Extension(propertyMeta, extensionInstanceMeta.settings);
    instances[extensionInstanceId] = extensionInstance;
  }

  return instances;
};

_satellite.init = function(propertyMeta) {
  _satellite.appVersion = propertyMeta.appVersion;
  _satellite.extensionInstances = createExtensionInstances(propertyMeta);
  require('./rules/initRules')(propertyMeta);
  //TODO: move polling from dynamic listener out to a global place
  //TODO: add logic to check conditions
  globalPolling.init();
  dynamicListener.init();
};

_satellite.init(require('./initConfig'));
