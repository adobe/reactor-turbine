var publicRequire = require('./publicRequire');

module.exports = function() {
  var moduleScriptsById = {};
  var exportsById = {};

  /**
   * Get the exports for a module.
   * @param {string} id The module id.
   * @returns {*}
   */
  var getExports = function(id) {
    if (!exportsById[id] && moduleScriptsById[id]) {
      var module = {
        exports: {}
      };

      var moduleAccessor = moduleScriptsById[id];
      moduleAccessor(module, publicRequire);
      exportsById[id] = module.exports;
    }

    return exportsById[id];
  };

  /**
   * Add an accessor for a module.
   * @param {string} id The module id.
   * @param {Function} moduleScript A function that allows turbine to pass in a host "module" object
   * and a require function. The <code>moduleScript</code> function should augment module.exports
   * with the module's intended API.
   */
  var addModuleScript = function(id, moduleScript) {
    moduleScriptsById[id] = moduleScript;
  };

  /**
   * Ensures all module scripts have run and their exported API cached.
   */
  var primeCache = function() {
    for (var id in moduleScriptsById) {
      getExports(id);
    }
  };

  return {
    getExports: getExports,
    addModuleScript: addModuleScript,
    primeCache: primeCache
  };
};
