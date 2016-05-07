var extractModuleExports = require('./extractModuleExports');

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

    if (!module.exports) {
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


