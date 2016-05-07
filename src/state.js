var dataElementSafe = require('./utils/dataElementSafe');
var createModuleProvider = require('./createModuleProvider');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');
var createGetSharedModuleExports = require('./createGetSharedModuleExports');
var resolveRelativePath = require('./resolveRelativePath');

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var customVars = {};
var moduleProvider = createModuleProvider();
var rules;
var dataElements;
var buildInfo;
var propertySettings;

var init = function(container) {
  // These can't be required at the top of the file because they require other modules which require
  // state. This circular dependency would cause issues. Maybe there's a better way?
  var createGetExtensionConfigurations = require('./createGetExtensionConfigurations');
  var createPublicRequire = require('./createPublicRequire');

  rules = container.rules || [];
  dataElements = container.dataElements || {};
  buildInfo = container.buildInfo || {};
  propertySettings = container.propertySettings || {};

  var extensions = container.extensions;
  if (extensions) {
    var getSharedModuleExports = createGetSharedModuleExports(extensions, moduleProvider);

    Object.keys(extensions).forEach(function(extensionName) {
      var extension = extensions[extensionName];
      var getExtensionConfigurations = createGetExtensionConfigurations(extension.configurations);

      if (extension.modules) {
        Object.keys(extension.modules).forEach(function(referencePath) {
          var getModuleExportsByRelativePath = function(relativePath) {
            var resolvedReferencePath = resolveRelativePath(referencePath, relativePath);
            return moduleProvider.getModuleExports(resolvedReferencePath);
          };

          var publicRequire = createPublicRequire(
            buildInfo,
            propertySettings,
            getExtensionConfigurations,
            getSharedModuleExports,
            getModuleExportsByRelativePath
          );

          var module = extension.modules[referencePath];

          moduleProvider.registerModule(referencePath, module, publicRequire);
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
};

var getRules = function() {
  return rules;
};

var getElementDefinition = function(name) {
  return dataElements[name];
};

var getShouldExecuteActions = function() {
  return getLocalStorageItem(HIDE_ACTIVITY_LOCAL_STORAGE_NAME) !== 'true';
};

var getDebugOutputEnabled = function() {
  return getLocalStorageItem(DEBUG_LOCAL_STORAGE_NAME) === 'true';
};

var setDebugOutputEnabled = function(value) {
  setLocalStorageItem(DEBUG_LOCAL_STORAGE_NAME, value);
};

var getPropertySettings = function() {
  // Intentionally does not support data element token replacements because how data element
  // tokens are replaced depends on certain property settings which creates a chicken-and-egg
  // problem.
  return propertySettings;
};

var getBuildInfo = function() {
  return buildInfo;
};

module.exports = {
  init: init,
  customVars: customVars,
  getModuleDisplayName: moduleProvider.getModuleDisplayName,
  getModuleExports: moduleProvider.getModuleExports,
  getRules: getRules,
  getDataElementDefinition: getElementDefinition,
  getShouldExecuteActions: getShouldExecuteActions,
  getDebugOutputEnabled: getDebugOutputEnabled,
  setDebugOutputEnabled: setDebugOutputEnabled,
  getCachedDataElementValue: dataElementSafe.getValue,
  cacheDataElementValue: dataElementSafe.setValue,
  getPropertySettings: getPropertySettings,
  getBuildInfo: getBuildInfo
};
