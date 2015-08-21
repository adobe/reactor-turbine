var publicRequire = require('./publicRequire');

module.exports = function(delegateScriptsByName) {
  var exportsByName = {};

  return function(name) {
    var exports = exportsByName[name];

    if (!exports && delegateScriptsByName.hasOwnProperty(name)) {
      var module = {
        exports: {}
      };

      var script = delegateScriptsByName[name];
      script(module, publicRequire);
      exports = exportsByName[name] = module.exports;

      // Delegate exports should always be functions. Having this check allows us to find
      // bugs more easily.
      if (typeof exports !== 'function') {
        throw new Error('Exported module "' + name + '" is not a function.');
      }
    }

    return exports;
  };
};
