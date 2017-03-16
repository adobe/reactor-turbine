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

var extractModuleExports = require('./extractModuleExports');
var logger = require('./logger');

var moduleByReferencePath = {};

var registerModule = function(referencePath, module, require) {
  module = Object.create(module);
  module.require = require;
  moduleByReferencePath[referencePath] = module;
};

var hydrateCache = function() {
  Object.keys(moduleByReferencePath).forEach(function(referencePath) {
    try {
      getModuleExports(referencePath);
    } catch (e) {
      var errorMessage = 'Error initializing module ' + referencePath + '. ' +
        e.message + (e.stack ? '\n' + e.stack : '');
      logger.error(errorMessage);
    }
  });
};

var getModuleExports = function(referencePath) {
  var module = moduleByReferencePath[referencePath];

  if (!module) {
    throw new Error('Module ' + referencePath + ' not found.');
  }

  // Using hasOwnProperty instead of a falsey check because the module could export undefined
  // in which case we don't want to execute the module each time the exports is requested.
  if (!module.hasOwnProperty('exports')) {
    module.exports = extractModuleExports(module.script, module.require);
  }

  return module.exports;
};

var getModuleDisplayName = function(referencePath) {
  var module = moduleByReferencePath[referencePath];
  return module ? module.displayName : null;
};

module.exports = {
  registerModule: registerModule,
  hydrateCache: hydrateCache,
  getModuleExports: getModuleExports,
  getModuleDisplayName: getModuleDisplayName
};


