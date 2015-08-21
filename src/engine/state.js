var createDelegateProvider = require('./createDelegateProvider');
var extensionCoreProvider = require('./extensionCoreProvider');
var dataElementDefinitionProvider = require('./dataElementDefinitionProvider');
var dataElementSafe = require('./dataElementSafe');
var preprocessConfig = require('./utils/preprocessConfig');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var _container;

module.exports = {
  _initExtensionCores: function() {

  },
  init: function(container) {
    _container = container;
    this.getEventDelegate = createDelegateProvider(container.eventDelegates);
    this.getConditionDelegate = createDelegateProvider(container.conditionDelegates);
    this.getActionDelegate = createDelegateProvider(container.actionDelegates);
    this.getDataElementDelegate = createDelegateProvider(container.dataElementDelegates);
    this.getCoreDelegate = createDelegateProvider(container.coreDelegates);
    this.getDataElementDefinition = dataElementDefinitionProvider(container.dataElements);
    this.getExtensionCore = extensionCoreProvider;
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
      if (integration.type === extensionId) {
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
