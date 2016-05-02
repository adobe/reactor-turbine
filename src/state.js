var extensionConfigurationProvider = require('./extensionConfigurationProvider');
var delegateProvider = require('./delegateProvider');
var helperProvider = require('./helperProvider');
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
      // by helpers and delegates while their providers are being hydrated.
      var configurations = extension.configurations;

      if (configurations) {
        Object.keys(configurations).forEach(function(configurationId) {
          var configuration = configurations[configurationId];
          extensionConfigurationProvider.addConfiguration(
            extension.name, configurationId, configuration);
        });
      }

      // The helper provider must be hydrated next because helpers can be required by
      // delegates while the delegate provider is being hydrated.
      var helpers = extension.helpers;

      if (helpers) {
        helperProvider.registerHelpers(helpers);
      }

      var delegates = extension.delegates;

      if (delegates) {
        delegateProvider.registerDelegates(delegates);
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
          .getSettingsCollection(extensionName);

        var collectionWithTokensReplaced = {};
        Object.keys(settingsCollection).forEach(function(key) {
          collectionWithTokensReplaced[key] = replaceVarTokens(settingsCollection[key]);
        });

        return collectionWithTokensReplaced;
      },
      getHelper: function(helperName) {
        var helper = helperProvider.getHelper(extensionName, helperName);
        return helper ? helper.exports : null;
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
  getBuildInfo: function() {
    return container.buildInfo;
  }
};
