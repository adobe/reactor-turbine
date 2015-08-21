var state = require('./state');

var coreByExtensionId = {};

module.exports = function(extensionId) {
  var core = coreByExtensionId[extensionId];

  if (!core) {
    var delegate = state.getCoreDelegate(extensionId);

    if (delegate) {
      var config = {
        integrationConfigs: state.getIntegrationConfigsByExtensionId(extensionId),
        propertyConfig: state.getPropertyConfig()
      };

      core = coreByExtensionId[extensionId] = delegate(config);
    }
  }

  return core;
};
