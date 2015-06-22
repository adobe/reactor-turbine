var resources = {
  'extensions': {
    get: function(extensionType) {
      return require('./stores/integrationRegistry').getByType(extensionType);
    },
    getOne: function(extensionType) {
      var instances = this.get(extensionType);
      return instances.length ? instances[0] : null;
    }
  },
  'Promise': require('./utils/communication/Promise'),
  'forEach': require('./utils/array/forEach'),
  'poll': require('./utils/communication/globalPoll'),
  'bind': require('./utils/dom/bind'),
  'covertData': require('./utils/covertData'),
  'addEventListener': require('./utils/dom/addEventListener'),
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
  'readCookie': require('./utils/cookie/readCookie'),
  'getObjectProperty': require('./utils/dataElement/getObjectProperty'),
  'bubbly': require('./utils/bubbly'),
  'addLiveEventListener': require('./utils/communication/addLiveEventListener')
};

module.exports = function(key) {
  if (resources.hasOwnProperty(key)) {
    return resources[key];
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
