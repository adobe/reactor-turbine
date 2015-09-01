var state = require('./state');

var resourceById = {};

module.exports = function(getResourceModule) {
  return function(resourceId) {
    var resource = resourceById[resourceId];

    if (!resource) {
      var resourceModule = getResourceModule(resourceId);

      if (resourceModule) {
        var extensionId = resourceId.substr(0, resourceId.indexOf('/'));

        var config = {
          integrationConfigs: state.getIntegrationConfigsByExtensionId(extensionId),
          propertyConfig: state.getPropertyConfig()
        };

        resource = resourceById[resourceId] = resourceModule(config);
      }
    }

    return resource;
  };
};
