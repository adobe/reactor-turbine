var modules = {
  'promise': require('./public/Promise'),
  'event-emitter': require('./public/EventEmitter'),
  'weak-map': require('./public/WeakMap'),
  'assign': require('./public/assign'),
  'client-info': require('./public/clientInfo'),
  'load-script': require('./public/loadScript'),
  'get-query-param': require('./public/getQueryParam'),
  'is-plain-object': require('./public/isPlainObject'),
  'is-linked': function(element) { // For backward compatibility.
    return require('./public/isAnchor')(element, true);
  },
  'get-var': require('./public/getVar'),
  'get-data-element-value': require('./public/getDataElementValue'),
  'cookie': require('./public/cookie'),
  'debounce': require('./public/debounce'),
  'once': require('./public/once'),
  'logger': require('./public/logger'),
  'write-html': require('./public/writeHtml'),
  'on-page-bottom': require('./public/onPageBottom'),
  'window': require('window'),
  'document': require('document')
};

/**
 * Creates a function which can be passed as a "require" function to extension modules.
 *
 * @param {Object} buildInfo
 * @param {Object} propertySettings
 * @param {Function} getExtensionConfigurations
 * @param {Function} getSharedModuleExports
 * @param {Function} getModuleExportsByRelativePath
 * @returns {Function}
 */
module.exports = function(dynamicModules) {
  dynamicModules = dynamicModules || {};

  var allModules = Object.create(modules);
  allModules['build-info'] = dynamicModules.buildInfo;
  allModules['property-settings'] = dynamicModules.propertySettings;
  allModules['get-extension-configurations'] = dynamicModules.getExtensionConfigurations;
  allModules['get-shared-module'] = dynamicModules.getSharedModuleExports;
  allModules['get-hosted-lib-file-url'] = dynamicModules.getHostedLibFileUrl;

  return function(key) {
    if (allModules[key]) {
      return allModules[key];
    } else if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      return dynamicModules.getModuleExportsByRelativePath(key);
    } {
      throw new Error('Cannot resolve module "' + key + '".');
    }
  };
};
