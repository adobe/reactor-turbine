var modules = {
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
  'page-bottom': require('./utils/pageBottom'),
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
module.exports = function(
  buildInfo,
  propertySettings,
  getExtensionConfigurations,
  getSharedModuleExports,
  getModuleExportsByRelativePath) {

  var allModules = Object.create(modules);
  allModules['build-info'] = buildInfo;
  allModules['property-settings'] = propertySettings;
  allModules['get-extension-configurations'] = getExtensionConfigurations;
  allModules['get-shared-module'] = getSharedModuleExports;

  return function(key) {
    if (allModules[key]) {
      return allModules[key];
    } else if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      return getModuleExportsByRelativePath(key);
    } {
      throw new Error('Cannot resolve module "' + key + '".');
    }
  };
};
