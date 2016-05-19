module.exports = function(script, require) {
  var module = {
    exports: {}
  };

  script(module, require);

  return module.exports;
};
