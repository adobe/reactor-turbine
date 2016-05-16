var extractModuleExports = require('./extractModuleExports');
var logger = require('./utils/logger');

module.exports = function() {
  var moduleByReferencePath = {};

  var registerModule = function(referencePath, module, require) {
    module = Object.create(module);
    module.require = require;
    moduleByReferencePath[referencePath] = module;
  };

  var hydrateCache = function() {
    Object.keys(moduleByReferencePath).forEach(getModuleExports);
  };

  var getModuleExports = function(referencePath) {
    var module = moduleByReferencePath[referencePath];

    if (!module) {
      var errorMessage = 'Module ' + referencePath + ' not found.';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Using hasOwnProperty instead of a falsey check because the module could export undefined
    // in which case we don't want to execute the module each time the exports is requested.
    if (!module.hasOwnProperty(exports)) {
      module.exports = extractModuleExports(module.script, module.require);
    }

    return module.exports;
  };

  var getModuleDisplayName = function(referencePath) {
    var module = moduleByReferencePath[referencePath];
    return module ? module.displayName : null;
  };

  return {
    registerModule: registerModule,
    hydrateCache: hydrateCache,
    getModuleExports: getModuleExports,
    getModuleDisplayName: getModuleDisplayName,
  };
};


