var resourceById = {};

var extractModuleExports = require('./extractModuleExports');
var extractResourceModuleExportOnce = function(resourceId) {
  var resource = resourceById[resourceId];
  if (!resource.hasOwnProperty('exports')) {
    resource.exports = extractModuleExports(resource.script);
  }
};

module.exports = {
  registerResources: function(resources) {
    Object.keys(resources).forEach(function(resourceId) {
      var resource = resources[resourceId];
      resourceById[resourceId] = resource;
    });

    // We want to extract the module exports immediately to allow for the delegate to run
    // some logic immediately and regardless of whether any delegate requires it.
    // We need to do the extraction in a separate iteration in order for the resourceProvider to
    // have all the resources functions (eg. when resourceA needs resourceB, both resources
    // functions must exist inside the resource provider).
    Object.keys(resources).forEach(function(resourceId) {
      extractResourceModuleExportOnce(resourceId);
    });
  },

  getResource: function(extensionName, resourceName) {
    var resourceId = extensionName + '/resources/' + resourceName;
    var resource = resourceById[resourceId];

    if (resource) {
      extractResourceModuleExportOnce(resourceId);
    }

    return resource;
  }
};
