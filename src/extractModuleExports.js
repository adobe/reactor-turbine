module.exports = function(script, require) {
  var module = {
    exports: {}
  };

  script.call(module.exports, module, module.exports, require);

  return module.exports;
};
