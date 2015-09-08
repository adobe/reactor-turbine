var publicRequire = require('../../../../engine/publicRequire');

var resourceModuleProviders = {
  'dtm/createBubbly': function() {
    var createBubblyInjector = require('inject!../../resources/createBubbly/createBubbly');
    return createBubblyInjector({
      createDataStash: publicRequire('createDataStash'),
      matchesCSS: publicRequire('matchesCSS')
    });
  },
  'dtm/compareNumbers': function() {
    return require('../../resources/compareNumbers/compareNumbers');
  },
  'dtm/visitorTracking': function() {
    var visitorTrackingInjector =
      require('inject!../../resources/visitorTracking/visitorTracking');
    return visitorTrackingInjector({
      'getCookie': publicRequire('getCookie'),
      'setCookie': publicRequire('setCookie'),
      'document': publicRequire('document'),
      'window': publicRequire('window')
    });
  }
};

/**
 * Stubs publicRequire. Resources are typically initialized with integration and property
 * configuration during the engine bootstrap process. Since most of our tests don't run the
 * bootstrap process, this allows us to simulate that portion of the process and create a
 * publicRequire function that behaves similar to the real one. For anything that is not an
 * extension resource, this delegates to the real publicRequire.
 * @param [config]
 * @param {Object[]} [config.integrationConfigs] Integration configurations for the extension.
 * @param {Object[]} [config.propertyConfig] Property configuration.
 * @returns {Function}
 */
module.exports = function(config) {
  return function(key) {
    var getResourceModule = resourceModuleProviders[key];
    if (getResourceModule) {
      return getResourceModule()(config);
    } else {
      return publicRequire(key);
    }
  };
};
