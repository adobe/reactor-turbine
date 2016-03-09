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
      return require('./utils/dom/isAnchor')(element, true);
    },
    'get-var': require('./utils/dataElement/getVar'),
    'get-data-element': require('./utils/dataElement/getDataElementValue'),
    'cookie': require('./utils/cookie/cookie'),
    'debounce': require('./utils/debounce'),
    'once': require('./utils/once'),
    'logger': require('./utils/logger'),
    'write-html': require('./utils/writeHtml'),
    'get-extension': state.getExtension,
    'page-bottom': require('./utils/pageBottom'),
    'window': require('window'),
    'document': require('document')
  };

  if (modules.hasOwnProperty(key)) {
    return modules[key];
  } else if (key === 'property-settings') {
    return state.getPropertySettings();
  } else {
    throw new Error('Cannot resolve module "' + key + '".');
  }
};
