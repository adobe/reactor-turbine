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

    var moduleProvidersByCapability = {
      'events': createExtensionModuleProvider(),
      'conditions': createExtensionModuleProvider(),
      'actions': createExtensionModuleProvider(),
      'dataElements': createExtensionModuleProvider(),
      'resources': createExtensionModuleProvider()
    };

    var getUniqueResourceId = function(extensionId, resourceId) {
      return extensionId + '.' + resourceId;
    };

    // Loop through all extensions and add their module scripts to the appropriate module provider.
    if (container.extensions) {
      for (var extensionId in container.extensions) {
        var extension = container.extensions[extensionId];
        for (var capability in moduleProvidersByCapability) {
          var provider = moduleProvidersByCapability[capability];

          if (extension[capability]) {
            var moduleScriptById = extension[capability];

            for (var id in moduleScriptById) {
              // Everything other than resources should already have a unique ID produced by
              // the library emitter. Resources do not because delegate code needs to be able to
              // refer to them by extension name + resource name.
              var uniqueId = capability === 'resources' ? getUniqueResourceId(extensionId, id) : id;
              provider.addModuleScript(uniqueId, moduleScriptById[id]);
            }
          }
        }
      }
    }

    this.getEventDelegate = moduleProvidersByCapability.events.getExports;
    this.getConditionDelegate = moduleProvidersByCapability.conditions.getExports;
    this.getActionDelegate = moduleProvidersByCapability.actions.getExports;
    this.getDataElementDelegate = moduleProvidersByCapability.dataElements.getExports;
    this.getResource = function(extensionId, resourceId) {
      var uniqueResourceId = getUniqueResourceId(extensionId, resourceId);
      return moduleProvidersByCapability.resources.getExports(uniqueResourceId);
    };

    // We want to run the module logic immediately. This allows for resource modules to provide
    // behavior even when there are no event, condition, action, or data element types configured
    // for the extension.
    // One example is DTM's visitor tracking which needs to run regardless of whether conditions
    // are configured to use them.
    // Also, this allows logic in the delegates to run immediately which can be important
    // if, for example, an action delegate needs to do some setup immediately rather than waiting
    // until a rule with the action is triggered.
    for (var capability in moduleProvidersByCapability) {
      moduleProvidersByCapability[capability].primeCache();
    }
  },
  customVars: {},
  getPropertyConfig: function() {
    return _container.propertyConfig || {};
  },
  getExtensionConfigsByExtensionId: function(extensionId) {
    var preprocessedConfigs = [];
    if (_container.extensions[extensionId]) {
      var extensionConfigsById = _container.extensions[extensionId].configs;

      if (extensionConfigsById) {
        for (var id in extensionConfigsById) {
          preprocessedConfigs.push(preprocessConfig(extensionConfigsById[id]));
        }
      }
    }
    return preprocessedConfigs;
  },
  getExtensionConfigById: function(configId) {
    // Possibly cache map of configurations by configuration id?
    var config;

    for (var extensionId in _container.extensions) {
      var extension = _container.extensions[extensionId];
      if (extension.configs && extension.configs[configId]) {
        config = extension.configs[configId];
        break;
      }
    }

    return config ? preprocessConfig(config) : null;
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
