var Promise = require('./utils/communication/Promise');
var preprocessSettings = require('./utils/preprocessSettings');

/**
 * Initializes integrations.
 */
module.exports = function(integrations, integrationRegistry, coreDelegates, propertySettings) {
  /**
   * Creates promises that represent each integration. The integrations haven't been initialized
   * at this point. This allows an integration, while it's being initialized, to access the
   * promises of other integrations that have yet to be initialized. This also allows the engine
   * to not have to be aware of dependencies between integrations (making sure one is initialized
   * before another, etc.)
   * @returns {Object} Object where the key is the integration ID and the value is the promise.
   */
  function createProxyPromises() {
    var promiseByIntegrationId = {};

    for (var integrationId in integrations) {
      var integration = integrations[integrationId];

      var proxy = {};

      var promise = new Promise(function(resolve, reject) {
        proxy.resolve = resolve;
        proxy.reject = reject;
      });

      promiseByIntegrationId[integrationId] = proxy;

      integrationRegistry.register(integrationId, integration.type, promise);
    }

    return promiseByIntegrationId;
  }

  function initializeIntegrations(proxyPromises) {
    // Initialize each integration.
    for (var integrationId in integrations) {
      var integration = integrations[integrationId];
      integration.settings = integration.settings || {};
      var delegate = coreDelegates.get(integration.type);
      var preprocessedSettings = preprocessSettings(
        integration.settings,
        propertySettings.undefinedVarsReturnEmpty);
      var result = delegate(preprocessedSettings);

      // Get the proxy promise that was created beforehand for the integration and make sure it's
      // resolved or rejected by the promise the integration actually returned. If the integration
      // didn't return a promise then we can go ahead and resolve the proxy promise immediately.
      var proxy = proxyPromises[integrationId];
      if (result instanceof Promise) {
        result.then(proxy.resolve, proxy.reject);
      } else {
        proxy.resolve(result);
      }
    }
  }

  initializeIntegrations(createProxyPromises());
};
