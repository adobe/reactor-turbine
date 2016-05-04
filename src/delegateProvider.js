var delegatesById = {};

var extractModuleExports = require('./extractModuleExports');

var extractHelperModuleExportOnce = function(delegateId) {
  var delegate = delegatesById[delegateId];
  if (!delegate.hasOwnProperty('exports')) {
    delegate.exports = extractModuleExports(delegate.script);
  }
};

module.exports = {
  registerDelegates: function(delegates) {
    Object.keys(delegates).forEach(function(delegateId) {
      var delegate = delegates[delegateId];
      delegatesById[delegateId] = delegate;
    });
  },

  buildCache: function() {
    Object.keys(delegatesById).forEach(function(delegateId) {
      extractHelperModuleExportOnce(delegateId);
    });
  },

  getDelegate: function(delegateId) {
    var delegate = delegatesById[delegateId];

    if (delegate) {
      extractHelperModuleExportOnce(delegateId);
    }

    return delegate;
  }
};
