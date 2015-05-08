var Promise = require('./utils/Promise');
var publicRequire = require('./publicRequire');

/**
 * Instantiates extensions while injecting dependency extensions instances.
 * @param {Object} propertyMeta Property metadata object.
 * @returns {Object} Object where the key is the instance ID and the value is the instance.
 */
module.exports = function(propertyMeta, extensionInstanceRegistry) {
  function createProxies() {
    var proxyByInstanceId = {};

    for (var instanceId in propertyMeta.extensionInstances) {
      var instanceMeta = propertyMeta.extensionInstances[instanceId];

      var proxy = {};

      var promise = new Promise(function(resolve, reject) {
        proxy.resolve = resolve;
        proxy.reject = reject;
      });

      proxyByInstanceId[instanceId] = proxy;

      extensionInstanceRegistry.register(instanceId, instanceMeta.type, promise);
    }

    return proxyByInstanceId;
  }

  // Add proxies to require repo.
  var proxies = createProxies();

  var factoriesByType = {};

  for (var extensionType in propertyMeta.extensions) {
    var script = propertyMeta.extensions[extensionType];
    var module = {};
    script(module, publicRequire);
    factoriesByType[extensionType] = module.exports;
  }

  for (var instanceId in propertyMeta.extensionInstances) {
    var instanceMeta = propertyMeta.extensionInstances[instanceId];
    var factory = factoriesByType[instanceMeta.type];
    var result = factory(instanceMeta.settings);

    if (!(result instanceof Promise)) {
      result = new Promise(function(resolve) {
        resolve(result);
      });
    }

    var proxy = proxies[instanceId];
    result.then(proxy.resolve, proxy.reject);
  }
};
