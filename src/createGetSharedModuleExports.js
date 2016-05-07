module.exports = function(extensions, moduleProvider) {
  return function(extensionName, moduleName) {
    var extension = extensions[extensionName];

    if (extension) {
      var modules = extension.modules;
      if (modules) {
        var referencePaths = Object.keys(modules);
        for (var i = 0; i < referencePaths.length; i++) {
          var referencePath = referencePaths[i];
          var module = modules[referencePath];
          if (module.sharedName === moduleName) {
            return moduleProvider.getModuleExports(referencePath);
          }
        }
      }
    }
  };
};
