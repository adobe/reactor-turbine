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
    }

    return exports;
  };
};
