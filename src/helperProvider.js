var helpersById = {};

var extractModuleExports = require('./extractModuleExports');

var extractHelperModuleExportOnce = function(helperId) {
  var helper = helpersById[helperId];
  if (!helper.hasOwnProperty('exports')) {
    helper.exports = extractModuleExports(helper.script);
  }
};

module.exports = {
  registerHelpers: function(helpers) {
    Object.keys(helpers).forEach(function(helperId) {
      helpersById[helperId] = helpers[helperId];
    });
  },

  buildCache: function() {
    // We want to extract the module exports immediately to allow for the delegate to run
    // some logic immediately and regardless of whether any delegate requires it.
    // We need to do the extraction in a separate iteration in order for the helperProvider to
    // have all the helpers functions (eg. when helperA needs helperB, both helpers
    // functions must exist inside the helper provider).
    Object.keys(helpersById).forEach(function(helperId) {
      extractHelperModuleExportOnce(helperId);
    });
  },

  getHelper: function(extensionName, helperName) {
    var helperId = extensionName + '/helpers/' + helperName;
    var helper = helpersById[helperId];

    if (helper) {
      extractHelperModuleExportOnce(helperId);
    }

    return helper;
  }
};
