var createGetSharedModuleExports = require('./createGetSharedModuleExports');
var createGetExtensionSettings = require('./createGetExtensionSettings');
var createGetHostedLibFileUrl = require('./createGetHostedLibFileUrl');
var logger = require('./logger');
var resolveRelativePath = require('./resolveRelativePath');
var onPageBottom = require('./onPageBottom');
var createPublicRequire = require('./createPublicRequire');

module.exports = function(container, moduleProvider, replaceTokens, getDataElementValue) {
  var extensions = container.extensions;
  var buildInfo = container.buildInfo;
  var propertySettings = container.property.settings;

  if (extensions) {
    var getSharedModuleExports = createGetSharedModuleExports(extensions, moduleProvider);

    Object.keys(extensions).forEach(function(extensionName) {
      var extension = extensions[extensionName];
      var getExtensionSettings = createGetExtensionSettings(replaceTokens, extension.settings);

      if (extension.modules) {
        var prefixedLogger = logger.createPrefixedLogger(extension.displayName);
        var getHostedLibFileUrl = createGetHostedLibFileUrl(
          extension.hostedLibFilesBaseUrl,
          buildInfo.minified
        );
        var turbine = {
          buildInfo: buildInfo,
          getDataElementValue: getDataElementValue,
          getExtensionSettings: getExtensionSettings,
          getHostedLibFileUrl: getHostedLibFileUrl,
          getSharedModule: getSharedModuleExports,
          logger: prefixedLogger,
          onPageBottom: onPageBottom,
          propertySettings: propertySettings,
          replaceTokens: replaceTokens
        };

        Object.keys(extension.modules).forEach(function(referencePath) {
          var module = extension.modules[referencePath];
          var getModuleExportsByRelativePath = function(relativePath) {
            var resolvedReferencePath = resolveRelativePath(referencePath, relativePath);
            return moduleProvider.getModuleExports(resolvedReferencePath);
          };
          var publicRequire = createPublicRequire(getModuleExportsByRelativePath);

          moduleProvider.registerModule(
            referencePath,
            module,
            extensionName,
            publicRequire,
            turbine
          );
        });
      }
    });

    // We want to extract the module exports immediately to allow the modules
    // to run some logic immediately.
    // We need to do the extraction here in order for the moduleProvider to
    // have all the modules previously registered. (eg. when moduleA needs moduleB, both modules
    // must exist inside moduleProvider).
    moduleProvider.hydrateCache();
  }
  return moduleProvider;
};
