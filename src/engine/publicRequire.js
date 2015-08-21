var EXTENSIONS_PREFIX = 'extensions/';

var resources = {
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
  'debounce': require('./utils/debounce'),
  'once': require('./utils/once'),
  'logger': require('./utils/logger'),
  'window': window,
  'document': document
};

module.exports = function(key) {
  if (key.indexOf(EXTENSIONS_PREFIX) === 0) {
    var extensionType = key.substr(EXTENSIONS_PREFIX.length);
    // We can't require in coreRegistry before here (e.g., at the top of this file) because it
    // would cause a circular dependency at load time.
    return require('./state').getExtensionCore(extensionType);
  } else if (resources.hasOwnProperty(key)) {
    return resources[key];
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
