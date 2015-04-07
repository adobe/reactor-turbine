window._satellite = {};

_satellite.utils = require('./utils/public/index');
_satellite.data = require('./data/public/index');
_satellite.pageBottom = require('./endOfPage');

// TODO: This will need to be more flexible to handle inclusion of only the extensions
// configured for the property.
_satellite.availableExtensions = {
  adobeAnalytics: require('./extensions/_adobeAnalytics')
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
};


_satellite.init(require('./initConfig'));
