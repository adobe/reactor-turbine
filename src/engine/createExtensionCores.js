var Promise = require('./utils/communication/Promise');
var preprocessConfig = require('./utils/preprocessConfig');

/**
 * Initializes extension cores.
 */
module.exports = function(container, coreRegistry, coreDelegates) {
  /**
   * Creates promises that represent each extension core. The cores haven't been initialized
   * at this point. This allows a core, while it's being initialized, to access the
   * promises that represent cores of other extensions that have yet to be initialized. This also
   * allows the engine to not have to be aware of dependencies between extension cores (making sure
   * one is initialized before another, etc.)
   * @returns {Object} Object where the key is the extension ID and the value is the promise.
   */
  function createProxyPromises() {
    var promiseByExtensionId = {};

    for (var extensionId in container.extensions) {
      var proxy = {};

      /*eslint-disable no-loop-func*/
      var promise = new Promise(function(resolve, reject) {
        proxy.resolve = resolve;
        proxy.reject = reject;
      });
      /*eslint-enable no-loop-func*/

      promiseByExtensionId[extensionId] = proxy;

      coreRegistry.register(extensionId, promise);
    }

    return promiseByExtensionId;
  }

  function getIntegrationConfigsForExtension(extensionId) {
    var integrationConfigs = [];
    for (var integrationId in container.integrations) {
      var integration = container.integrations[integrationId];
      if (integration.type === extensionId) {
        var preprocessedIntegrationConfig = preprocessConfig(
          integration.config,
          container.config.undefinedVarsReturnEmpty
        );
        integrationConfigs.push(preprocessedIntegrationConfig);
      }
    }
    return integrationConfigs;
  }

  function initializeCores(promiseByExtensionId) {
    // Initialize each integration.
    for (var extensionId in container.extensions) {
      var config = {
        integrationConfigs: getIntegrationConfigsForExtension(extensionId),
        propertyConfig: preprocessConfig(
          container.config,
          container.config.undefinedVarsReturnEmpty
        )
      };

      var delegate;
      var result;

      delegate = coreDelegates.get(extensionId);

      if (delegate) {
        // If there is no core for the extension then the promise should be resolved with undefined.
        result = delegate(config);
      }

      // Get the proxy promise that was created beforehand for the integration and make sure it's
      // resolved or rejected by the promise the integration actually returned. If the integration
      // didn't return a promise then we can go ahead and resolve the proxy promise immediately.
      var proxy = promiseByExtensionId[extensionId];
      if (result instanceof Promise) {
        result.then(proxy.resolve, proxy.reject);
      } else {
        proxy.resolve(result);
      }
    }
  }

  initializeCores(createProxyPromises());
};
