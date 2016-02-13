var extractModuleExports = require('./extractModuleExports');

var exportsByResourceId = {};

module.exports = {
  addResource: function(id, resource) {
    // We want to extract the module exports immediately to allow for the delegate to run
    // some logic immediately and regardless of whether any delegate requires it.
    exportsByResourceId[id] = extractModuleExports(resource.script);
  },
  getExports: function(extensionName, resourceName) {
    var resourceId = extensionName + '/resources/' + resourceName;
    return exportsByResourceId[resourceId];
  }
};
