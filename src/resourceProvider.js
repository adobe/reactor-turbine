var extractModuleExports = require('./extractModuleExports');

var resourceById = {};

module.exports = {
  addResource: function(id, resource) {
    // We want to extract the module exports immediately to allow for the delegate to run
    // some logic immediately and regardless of whether any delegate requires it.
    resource.exports = extractModuleExports(resource.script);
    resourceById[id] = resource;
  },
  getResource: function(extensionName, resourceName) {
    var resourceId = extensionName + '/resources/' + resourceName;
    return resourceById[resourceId];
  }
};
