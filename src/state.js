var extensionConfigurationProvider = require('./extensionConfigurationProvider');
var delegateProvider = require('./delegateProvider');
var resourceProvider = require('./resourceProvider');
var dataElementSafe = require('./utils/dataElementSafe');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var container;
var replaceVarTokens;

var hydrateProviders = function(container) {
  var extensions = container.extensions;
  if (extensions) {
    Object.keys(extensions).forEach(function(extensionId) {
      var extension = extensions[extensionId];

      // The configuration provider must be hydrated first because configurations can be required
      // by resources and delegates while their providers are being hydrated.
      var configurations = extension.configurations;

      if (configurations) {
        Object.keys(configurations).forEach(function(configurationId) {
          var configuration = configurations[configurationId];
          extensionConfigurationProvider.addConfiguration(
            extension.name, configurationId, configuration);
        });
      }

      // The resource provider must be hydrated next because resources can be required by
      // delegates while the delegate provider is being hydrated.
      var resources = extension.resources;

      if (resources) {
        Object.keys(resources).forEach(function(resourceId) {
          var resource = resources[resourceId];
          resourceProvider.addResource(resourceId, resource);
        });
      }

      var delegates = extension.delegates;

      if (delegates) {
        Object.keys(delegates).forEach(function(delegateId) {
          var delegate = delegates[delegateId];
          delegateProvider.addDelegate(delegateId, delegate);
        });
      }
    });
  }
};

module.exports = {
  init: function(_container) {
    container = _container;
    // We pull in replaceVarTokens here and not at the top of the file to prevent a
    // circular reference since dependencies of replaceVarTokens require this state module.
    replaceVarTokens = require('./utils/dataElement/replaceVarTokens');
    hydrateProviders(container);
  },
  customVars: {},
  getPropertySettings: function() {
    // Property config does not support data element token replacements.
    return container.propertySettings || {};
  },
  // This is only intended to be used by extensions therefore it accommodates APIs that
  // extension developers would expect.
  getExtension: function(extensionName) {
    return {
      getConfigurations: function() {
        var settingsCollection = extensionConfigurationProvider
          .getSettingsCollectionByExtensionName(extensionName);
        return settingsCollection.map(function(settings) {
          return replaceVarTokens(settings);
        });
      },
      getConfiguration: function(configurationId) {
        var settings = extensionConfigurationProvider.getSettingsByConfigurationId(configurationId);
        return replaceVarTokens(settings);
      },
      getResource: function(resourceName) {
        var resource = resourceProvider.getResource(extensionName, resourceName);
        return resource ? resource.exports : null;
      }
    };
  },
  getDelegate: delegateProvider.getDelegate,
  getRules: function() {
    return container.rules;
  },
  getDataElementDefinition: function(name) {
    return container.dataElements[name];
  },
  getShouldExecuteActions: function() {
    return getLocalStorageItem(HIDE_ACTIVITY_LOCAL_STORAGE_NAME) !== 'true';
  },
  getDebugOutputEnabled: function() {
    return getLocalStorageItem(DEBUG_LOCAL_STORAGE_NAME) === 'true';
  },
  setDebugOuputEnabled: function(value) {
    setLocalStorageItem(DEBUG_LOCAL_STORAGE_NAME, value);
  },
  getCachedDataElementValue: dataElementSafe.getValue,
  cacheDataElementValue: dataElementSafe.setValue,
  getAppVersion: function() {
    return container.appVersion;
  }
};
