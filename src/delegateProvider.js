var extractModuleExports = require('./extractModuleExports');

var delegateByDelegateId = {};
var exportsByDelegateId = {};

module.exports = {
  addDelegate: function(id, delegate) {
    delegateByDelegateId[id] = delegate;
    // We want to extract the module exports immediately to allow for the resource to run
    // some logic immediately.
    exportsByDelegateId[id] = extractModuleExports(delegate.script);
  },
  getDelegate: function(id) {
    return delegateByDelegateId[id];
  },
  getExports: function(id) {
    return exportsByDelegateId[id];
  }
};
