var Promise = require('./utils/communication/Promise');

/**
 * Instantiates extensions while injecting dependency extensions instances.
 * @param {Object} propertyMeta Property metadata object.
 * @returns {Object} Object where the key is the instance ID and the value is the instance.
 */
module.exports = function(instanceMetas, extensionInstanceRegistry, coreDelegates) {
  function createProxies() {
    var proxyByInstanceId = {};

    for (var instanceId in instanceMetas) {
      var instanceMeta = instanceMetas[instanceId];

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

  for (var instanceId in instanceMetas) {
    var instanceMeta = instanceMetas[instanceId];
    instanceMeta.settings = instanceMeta.settings || {};
    var delegate = coreDelegates.get(instanceMeta.type);
    var result = delegate(instanceMeta.settings);

    if (!(result instanceof Promise)) {
      result = new Promise(function(resolve) {
        resolve(result);
      });
    }

    var proxy = proxies[instanceId];
    result.then(proxy.resolve, proxy.reject);
  }
};
