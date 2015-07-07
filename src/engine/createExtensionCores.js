var Promise = require('./utils/communication/Promise');
var preprocessSettings = require('./utils/preprocessSettings');

/**
 * Initializes extension cores.
 */
module.exports = function(property, coreRegistry, coreDelegates) {
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

    for (var extensionId in property.extensions) {
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

  function getIntegrationsSettingsForExtension(extensionId) {
    var integrationsSettings = [];
    for (var integrationId in property.integrations) {
      var integration = property.integrations[integrationId];
      if (integration.type === extensionId) {
        var preprocessedIntegrationSettings = preprocessSettings(
          integration.settings,
          property.settings.undefinedVarsReturnEmpty
        );
        integrationsSettings.push(preprocessedIntegrationSettings);
      }
    }
    return integrationsSettings;
  }

  function initializeCores(promiseByExtensionId) {
    // Initialize each integration.
    for (var extensionId in property.extensions) {
      var settings = {
        integrationsSettings: getIntegrationsSettingsForExtension(extensionId),
        propertySettings: preprocessSettings(
          property.settings,
          property.settings.undefinedVarsReturnEmpty
        )
      };

      var delegate;
      var result;

      // If there is no core for the extension then the promise should be resolved with undefined.
      if (property.coreDelegates[extensionId]) {
        delegate = coreDelegates.get(extensionId);
        result = delegate(settings);
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
