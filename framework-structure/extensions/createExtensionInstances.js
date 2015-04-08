// TODO: This will need to be more flexible to handle inclusion of only the extensions
// configured for the property.
_satellite.availableExtensions = {
  adobeAnalytics: require('./AdobeAnalytics'),
  adobeTarget: require('./AdobeTarget'),
  adobeAlert: require('./AdobeAlert')
};

module.exports = function(propertyMeta) {
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
