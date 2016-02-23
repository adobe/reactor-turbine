var state;
var modules;

module.exports = function(key) {
  // We require in all these modules here instead of at the beginning of this file to avoid
  // circular dependency issues.
  state = state || require('./state');

  modules = modules || {
    'Promise': require('./utils/communication/Promise'),
    'EventEmitter': require('./utils/communication/EventEmitter'),
    'poll': require('./utils/communication/globalPoll'),
    'createDataStash': require('./utils/createDataStash'),
    'assign': require('./utils/object/assign'),
    'clientInfo': require('./utils/clientInfo'),
    'loadScript': require('./utils/loadScript'),
    'getQueryParam': require('./utils/uri/getQueryParam'),
    'isPlainObject': require('./utils/isType/isPlainObject'),
    'isLinked': function(element) { // For backward compatibility.
      require('./utils/dom/isAnchor')(element, true);
    },
    'matchesSelector': require('./utils/dom/matchesSelector'),
    'getVar': require('./utils/dataElement/getVar'),
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
    'getExtension': state.getExtension,
    'window': window,
    'document': document
  };

  if (modules.hasOwnProperty(key)) {
    return modules[key];
  } else if (key === 'propertyConfig') {
    return state.getPropertyConfig();
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
