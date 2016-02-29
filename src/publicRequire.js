var state;
var modules;

module.exports = function(key) {
  // We require in all these modules here instead of at the beginning of this file to avoid
  // circular dependency issues.
  state = state || require('./state');

  // Module names are not camelCase in order to be consistent with npm package name standards.
  modules = modules || {
    'promise': require('./utils/communication/Promise'),
    'event-emitter': require('./utils/communication/EventEmitter'),
    'create-data-stash': require('./utils/createDataStash'),
    'assign': require('./utils/object/assign'),
    'client-info': require('./utils/clientInfo'),
    'load-script': require('./utils/loadScript'),
    'get-query-param': require('./utils/uri/getQueryParam'),
    'is-plain-object': require('./utils/isType/isPlainObject'),
    'is-linked': function(element) { // For backward compatibility.
      require('./utils/dom/isAnchor')(element, true);
    },
    'get-var': require('./utils/dataElement/getVar'),
    'get-data-element': require('./utils/dataElement/getDataElementValue'),
    'get-cookie': require('./utils/cookie/getCookie'),
    'set-cookie': require('./utils/cookie/setCookie'),
    'remove-cookie': require('./utils/cookie/removeCookie'),
    'debounce': require('./utils/debounce'),
    'once': require('./utils/once'),
    'logger': require('./utils/logger'),
    'write-html': require('./utils/writeHtml'),
    'get-extension': state.getExtension,
    'window': window,
    'document': document
  };

  if (modules.hasOwnProperty(key)) {
    return modules[key];
  } else if (key === 'property-settings') {
    return state.getPropertySettings();
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
