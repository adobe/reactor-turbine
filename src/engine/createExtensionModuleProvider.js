var publicRequire = require('./publicRequire');

module.exports = function(moduleById) {
  var exportsById = {};

  return function(id) {
    var exports = exportsById[id];

    if (!exports && moduleById.hasOwnProperty(id)) {
      var module = {
        exports: {}
      };

      var script = moduleById[id];
      script(module, publicRequire);
      exports = exportsById[id] = module.exports;

      // Exports should always be functions so they can receive integration and property configs.
      // Having this check allows us to find bugs more easily.
      if (typeof exports !== 'function') {
        throw new Error('Exported module "' + id + '" is not a function.');
      }
    }

    return exports;
  };
};
