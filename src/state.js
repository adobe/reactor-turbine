var createExtensionModuleProvider = require('./createExtensionModuleProvider');
var dataElementSafe = require('./utils/dataElementSafe');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');
var preprocessConfig;

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var _container;

module.exports = {
  init: function(container) {
    _container = container;
    // We pull in preprocessConfig here and not at the top of the file to prevent a
    // circular reference since dependencies of preprocessConfig require this state module.
    preprocessConfig = require('./utils/preprocessConfig');
    this.getEventDelegate = createExtensionModuleProvider(container.eventDelegates);
    this.getConditionDelegate = createExtensionModuleProvider(container.conditionDelegates);
    this.getActionDelegate = createExtensionModuleProvider(container.actionDelegates);
    this.getDataElementDelegate = createExtensionModuleProvider(container.dataElementDelegates);
    this.getResource = createExtensionModuleProvider(container.resources);
    // The resource modules should be called for even when they aren't required by anything. This
    // is so extensions can have logic that runs even when there are no event, condition, action,
    // or data element types configured. One example is DTM's visitor tracking which needs to
    // run regardless of whether conditions are configured to use them.
    if (container.resources) {
      Object.keys(container.resources).forEach(this.getResource);
    }
  },
  customVars: {},
  getPropertyConfig: function() {
    return _container.config || {};
  },
  getIntegrationConfigsByExtensionId: function(extensionId) {
    var integrationConfigs = [];
    for (var integrationId in _container.integrations) {
      var integration = _container.integrations[integrationId];
      if (integration.extensionId === extensionId) {
        var preprocessedIntegrationConfig = preprocessConfig(integration.config || {});
        integrationConfigs.push(preprocessedIntegrationConfig);
      }
    }
    return integrationConfigs;
  },
  getIntegrationConfigById: function(integrationId) {
    var integration = _container.integrations[integrationId];

    if (integration) {
      return preprocessConfig(integration.config || {});
    }
  },
  getRules: function() {
    return _container.rules;
  },
  getDataElementDefinition: function(name) {
    return _container.dataElements[name];
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
    return _container.appVersion;
  }
};
