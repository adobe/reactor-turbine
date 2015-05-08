var resources = {
  'extensions': {
    get: function(extensionType) {
      return require('./stores/extensionInstanceRegistry').getByType(extensionType);
    },
    getOne: function(extensionType) {
      var instances = this.get(extensionType);
      return instances.length ? instances[0] : null;
    }
  },
  'Promise': require('./utils/Promise'),
  'addSelectorEventListener': require('./utils/addSelectorEventListener'),
  'forEach': require('./utils/forEach'),
  'poll': require('./utils/globalPolling').add,
  'bind': require('./utils/bind'),
  'dataOnElement': require('./utils/dataOnElement'),
  'addEventListener': require('./utils/addEventListener'),
  'extend': require('./utils/extend'),
  'encodeObjectToURI': require('./utils/encodeObjectToURI'),
  'isHttps': require('./utils/isHttps'),
  'clientInfo': require('./utils/clientInfo'),
  'createBeacon': require('./utils/createBeacon'),
  'hideElements': require('./utils/hideElements'),
  'loadScript': require('./utils/loadScript'),
  'textMatch': require('./utils/textMatch'),
  'getQueryParam': require('./utils/getQueryParam'),
  'isLinked': require('./utils/isLinked'),
  'readCookie': require('./utils/readCookie'),
  'elementHasAttribute': require('./utils/elementHasAttribute'),
  'getObjectProperty': require('./utils/getObjectProperty')
};

module.exports = function(key) {
  if (resources.hasOwnProperty(key)) {
    return resources[key];
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
