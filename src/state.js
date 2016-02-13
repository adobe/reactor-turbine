var extensionConfigurationProvider = require('./extensionConfigurationProvider');
var delegateProvider = require('./delegateProvider');
var resourceProvider = require('./resourceProvider');
var dataElementSafe = require('./utils/dataElementSafe');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var container;
var preprocessConfig;

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
    // We pull in preprocessConfig here and not at the top of the file to prevent a
    // circular reference since dependencies of preprocessConfig require this state module.
    preprocessConfig = require('./utils/preprocessConfig');
    hydrateProviders(container);
  },
  customVars: {},
  getPropertyConfig: function() {
    return container.propertyConfig || {};
  },
  getExtensionConfigurationsByExtensionName: function(extensionName) {
    var settingsCollection = extensionConfigurationProvider
      .getSettingsCollectionByExtensionName(extensionName);
    return settingsCollection.map(function(settings) {
      return preprocessConfig(settings);
    });
  },
  getExtensionConfigurationById: function(configurationId) {
    var settings = extensionConfigurationProvider.getSettingsByConfigurationId(configurationId);
    return preprocessConfig(settings);
  },
  getDelegate: delegateProvider.getDelegate,
  getDelegateExports: delegateProvider.getExports,
  getResourceExports: resourceProvider.getExports,
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
  getCachedDataElement: function(key, length) {
    return dataElementSafe(key, length);
  },
  cacheDataElement: function(key, length, value) {
    dataElementSafe(key, length, value);
  },
  getAppVersion: function() {
    return container.appVersion;
  }
};
