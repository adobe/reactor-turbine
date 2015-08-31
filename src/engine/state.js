var createDelegateProvider = require('./createDelegateProvider');
var getExtensionCore = require('./getExtensionCore');
var dataElementSafe = require('./utils/dataElementSafe');
var getLocalStorageItem = require('./utils/localStorage/getLocalStorageItem');
var setLocalStorageItem = require('./utils/localStorage/setLocalStorageItem');
var preprocessConfig;

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var _container;

module.exports = {
  _initExtensionCores: function() {

  },
  init: function(container) {
    // We pull in preprocessConfig here and not at the top of the file to prevent a
    // circular reference since getVar, which is used by preprocessConfig, requires this state
    // module.
    preprocessConfig = require('./utils/preprocessConfig');
    _container = container;
    this.getEventDelegate = createDelegateProvider(container.eventDelegates);
    this.getConditionDelegate = createDelegateProvider(container.conditionDelegates);
    this.getActionDelegate = createDelegateProvider(container.actionDelegates);
    this.getDataElementDelegate = createDelegateProvider(container.dataElementDelegates);
    this.getCoreDelegate = createDelegateProvider(container.coreDelegates);
    this.getExtensionCore = getExtensionCore;
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
