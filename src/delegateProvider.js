var extractModuleExports = require('./extractModuleExports');

var delegateById = {};

module.exports = {
  registerDelegates: function(delegates) {
    Object.keys(delegates).forEach(function(delegateId) {
      var delegate = delegates[delegateId];

      // We want to extract the module exports immediately to allow for the helper to run
      // some logic immediately.
      delegate.exports = extractModuleExports(delegate.script);
      delegateById[delegateId] = delegate;
    });
  },

  getDelegate: function(id) {
    return delegateById[id];
  }
};
