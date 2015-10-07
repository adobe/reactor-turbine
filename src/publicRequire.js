var state;
var modules;

module.exports = function(key) {
  // We require in all these modules here instead of at the beginning of this file to avoid
  // circular dependency issues.
  state = state || require('./state');

  modules = modules || {
    'Promise': require('./utils/communication/Promise'),
    'poll': require('./utils/communication/globalPoll'),
    'createDataStash': require('./utils/createDataStash'),
    'assign': require('./utils/object/assign'),
    'encodeObjectToURI': require('./utils/uri/encodeObjectToURI'),
    'isHTTPS': require('./utils/uri/isHTTPS'),
    'clientInfo': require('./utils/clientInfo'),
    'createBeacon': require('./utils/createBeacon'),
    'hideElements': require('./utils/dom/hideElements'),
    'loadScript': require('./utils/loadScript'),
    'textMatch': require('./utils/string/textMatch'),
    'unique': require('./utils/array/unique'),
    'getQueryParam': require('./utils/uri/getQueryParam'),
    'isLinked': function(element) { // For backward compatibility.
      require('./utils/dom/isAnchor')(element, true);
    },
    'matchesSelector': require('./utils/dom/matchesSelector'),
    'getDataElement': require('./utils/dataElement/getDataElement'),
    'getCookie': require('./utils/cookie/getCookie'),
    'setCookie': require('./utils/cookie/setCookie'),
    'removeCookie': require('./utils/cookie/removeCookie'),
    'getObjectProperty': require('./utils/dataElement/getObjectProperty'),
    'liveQuerySelector': require('./utils/dom/liveQuerySelector'),
    'debounce': require('./utils/debounce'),
    'once': require('./utils/once'),
    'logger': require('./utils/logger'),
    'writeHtml': require('./utils/writeHtml'),
    'resourceProvider': {
      get: function(extensionName, resourceName) {
        return state.getResource(extensionName + '/' + resourceName);
      }
    },
    'integrationProvider': {
      getById: state.getIntegrationConfigById,
      getByExtension: state.getIntegrationConfigsByExtensionId
    },
    'window': window,
    'document': document
  };

  if (modules.hasOwnProperty(key)) {
    return modules[key];
  } else if (key === 'property') {
    return state.getPropertyConfig();
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
