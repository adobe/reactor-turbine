var publicRequire = require('./publicRequire');

module.exports = function() {
  var scriptsByName;
  var exportsByName = {};

  return {
    get: function(name) {
      if (!scriptsByName) {
        throw new Error('Delegate provider not initialized.');
      }

      var exports = exportsByName[name];

      if (!exports) {
        if (scriptsByName.hasOwnProperty(name)) {
          var module = {
            exports: {}
          };

          var script = scriptsByName[name];
          script(module, publicRequire);
          exports = exportsByName[name] = module.exports;

          // Delegate exports should always be functions. Having this check allows us to find
          // bugs more easily.
          if (typeof exports !== 'function') {
            throw new Error('Exported module "' + name + '" is not a function.');
          }

        } else {
          throw new Error('Cannot resolve module "' + name + '".');
        }
      }

      return exports;
    },
    init: function(delegateScriptsByName) {
      scriptsByName = delegateScriptsByName;
    }
  };
};
