var extractModuleExports = require('./extractModuleExports');

var delegateById = {};

module.exports = {
  addDelegate: function(id, delegate) {
    // We want to extract the module exports immediately to allow for the resource to run
    // some logic immediately.
    delegate.exports = extractModuleExports(delegate.script);
    delegateById[id] = delegate;
  },
  getDelegate: function(id) {
    return delegateById[id];
  }
};
