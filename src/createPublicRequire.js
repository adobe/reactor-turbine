/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

var CORE_MODULE_SCOPE = '@turbine/';

var modules = {
  'promise': require('./public/Promise'),
  'weak-map': require('./public/WeakMap'),
  'assign': require('./public/assign'),
  'client-info': require('./public/clientInfo'),
  'load-script': require('./public/loadScript'),
  'get-query-param': require('./public/getQueryParam'),
  'is-plain-object': require('./public/isPlainObject'),
  'get-data-element-value': require('./public/getDataElementValue'),
  'cookie': require('./public/cookie'),
  'debounce': require('./public/debounce'),
  'once': require('./public/once'),
  'logger': require('./public/logger'),
  'write-html': require('./public/writeHtml'),
  'replace-tokens': require('./public/replaceTokens'),
  'on-page-bottom': require('./public/onPageBottom'),
  'window': require('window'),
  'document': require('document')
};

/**
 * Creates a function which can be passed as a "require" function to extension modules.
 *
 * @param {Object} buildInfo
 * @param {Object} propertySettings
 * @param {Function} getExtensionSettings
 * @param {Function} getSharedModuleExports
 * @param {Function} getModuleExportsByRelativePath
 * @returns {Function}
 */
module.exports = function(dynamicModules) {
  dynamicModules = dynamicModules || {};

  var allModules = Object.create(modules);
  allModules['build-info'] = dynamicModules.buildInfo;
  allModules['property-settings'] = dynamicModules.propertySettings;
  allModules['get-extension-settings'] = dynamicModules.getExtensionSettings;
  allModules['get-shared-module'] = dynamicModules.getSharedModuleExports;
  allModules['get-hosted-lib-file-url'] = dynamicModules.getHostedLibFileUrl;

  return function(key) {
    if (key.indexOf(CORE_MODULE_SCOPE) === 0) {
      var coreModule = allModules[key.substr(CORE_MODULE_SCOPE.length)];
      if (coreModule) {
        return coreModule;
      }
    }

    if (key.indexOf('./') === 0 || key.indexOf('../') === 0) {
      return dynamicModules.getModuleExportsByRelativePath(key);
    }

    throw new Error('Cannot resolve module "' + key + '".');
  };
};
