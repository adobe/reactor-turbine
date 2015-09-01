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
    // We pull in preprocessConfig here and not at the top of the file to prevent a
    // circular reference since getVar, which is used by preprocessConfig, requires this state
    // module.
    preprocessConfig = require('./utils/preprocessConfig');
    _container = container;
    this.getEventDelegate = createExtensionModuleProvider(container.eventDelegates);
    this.getConditionDelegate = createExtensionModuleProvider(container.conditionDelegates);
    this.getActionDelegate = createExtensionModuleProvider(container.actionDelegates);
    this.getDataElementDelegate = createExtensionModuleProvider(container.dataElementDelegates);

    // The resource modules should be initialized even when they aren't required by anything. This
    // is so extensions can have logic that runs even when there are no event, condition, action,
    // or data element types configured. One example is DTM's visitor tracking which needs to
    // run regardless of whether conditions are configured to use them.
    var getResourceModule = createExtensionModuleProvider(container.resources, true);
    this.getResource = require('./getResourceProvider')(getResourceModule);
  },
  customVars: {},
  getExtensionInfo: function() {
    return _container.extensions;
  },
  getPropertyConfig: function() {
    return preprocessConfig(_container.config || {});
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
  getDataElement: function(key, length) {
    return dataElementSafe(key, length);
  },
  setDataElement: function(key, length, value) {
    dataElementSafe(key, value, length);
  },
  getAppVersion: function() {
    return _container.appVersion;
  }
};
