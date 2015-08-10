var resources = {
  'extensionCores': {
    get: function(extensionType) {
      return require('./stores/coreRegistry').get(extensionType);
    }
  },
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
  'getQueryParam': require('./utils/uri/getQueryParam'),
  'isLinked': function(element) { // For backward compatibility.
    require('./utils/dom/isAnchor')(element, true);
  },
  'getCookie': require('./utils/cookie/getCookie'),
  'setCookie': require('./utils/cookie/setCookie'),
  'getObjectProperty': require('./utils/dataElement/getObjectProperty'),
  'createBubbly': require('./utils/createBubbly'),
  'liveQuerySelector': require('./utils/dom/liveQuerySelector'),
  'logger': require('./utils/logger'),
  'window': function() { // Used so that window can be mocked in tests.
    return window;
  },
  'document': function() { // Used so that document can be mocked in tests.
    return document;
  }
};

module.exports = function(key) {
  if (resources.hasOwnProperty(key)) {
    return resources[key];
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
