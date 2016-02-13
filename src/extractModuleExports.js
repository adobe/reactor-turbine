var publicRequire = require('./publicRequire');

module.exports = function(module) {
  var moduleApi = {
    exports: {}
  };

  module(moduleApi, publicRequire);

  return moduleApi.exports;
};
