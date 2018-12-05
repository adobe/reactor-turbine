/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/
var createReplaceTokens = require('./createReplaceTokens');
var createSetCustomVar = require('./createSetCustomVar');
var createGetDataElementValue = require('./createGetDataElementValue');
var createModuleProvider = require('./createModuleProvider');
var createIsVar = require('./createIsVar');
var createGetVar = require('./createGetVar');
var hydrateModuleProvider = require('./hydrateModuleProvider');
var hydrateSatelliteObject = require('./hydrateSatelliteObject');
var logger = require('./logger');
var initRules = require('./initRules');
var dataElementSafe = require('./dataElementSafe');
var getNamespacedStorage = require('./getNamespacedStorage');

var DEBUG_LOCAL_STORAGE_NAME = 'debug';

function initialize(extensionEntries, container) {
  if (window.__satelliteLoaded) {
    return;
  }

  // If a consumer loads the library multiple times, make sure only the first time is effective.
  window.__satelliteLoaded = true;
  window._satellite = window._satellite || {};
  var _satellite = window._satellite;

  var undefinedVarsReturnEmpty = container.property.settings.undefinedVarsReturnEmpty;

  var dataElements = container.dataElements || {};

  // Remove when migration period has ended.
  dataElementSafe.migrateCookieData(dataElements);

  var getDataElementDefinition = function(name) {
    return dataElements[name];
  };

  var moduleProvider = createModuleProvider();

  var replaceTokens;

  // We support data elements referencing other data elements. In order to be able to retrieve a
  // data element value, we need to be able to replace data element tokens inside its settings
  // object (which is what replaceTokens is for). In order to be able to replace data element
  // tokens inside a settings object, we need to be able to retrieve data element
  // values (which is what getDataElementValue is for). This proxy replaceTokens function solves the
  // chicken-or-the-egg problem by allowing us to provide a replaceTokens function to
  // getDataElementValue that will stand in place of the real replaceTokens function until it
  // can be created. This also means that createDataElementValue should not call the proxy
  // replaceTokens function until after the real replaceTokens has been created.
  var proxyReplaceTokens = function() {
    return replaceTokens.apply(null, arguments);
  };

  var getDataElementValue = createGetDataElementValue(
    moduleProvider,
    getDataElementDefinition,
    proxyReplaceTokens,
    undefinedVarsReturnEmpty
  );

  var customVars = {};
  var setCustomVar = createSetCustomVar(
    customVars
  );

  var isVar = createIsVar(
    customVars,
    getDataElementDefinition
  );

  var getVar = createGetVar(
    customVars,
    getDataElementDefinition,
    getDataElementValue
  );

  replaceTokens = createReplaceTokens(
    isVar,
    getVar,
    undefinedVarsReturnEmpty
  );

  var localStorage = getNamespacedStorage('localStorage');

  var getDebugOutputEnabled = function() {
    return localStorage.getItem(DEBUG_LOCAL_STORAGE_NAME) === 'true';
  };

  var setDebugOutputEnabled = function(value) {
    localStorage.setItem(DEBUG_LOCAL_STORAGE_NAME, value);
    logger.outputEnabled = value;
  };

  logger.outputEnabled = getDebugOutputEnabled();

  // Important to hydrate satellite object before we hydrate the module provider or init rules.
  // When we hydrate module provider, we also execute extension code which may be
  // accessing _satellite.
  hydrateSatelliteObject(
    _satellite,
    container,
    setDebugOutputEnabled,
    getVar,
    setCustomVar
  );

  hydrateModuleProvider(
    container,
    moduleProvider,
    replaceTokens,
    getDataElementValue
  );

  initRules(
    _satellite,
    container.rules || [],
    moduleProvider,
    replaceTokens
  );
}

function getScopedExtensionUtilities(extensionPackageId) {
  // TODO
}

module.exports = {
  initialize: initialize,
  getScopedExtensionUtilities: getScopedExtensionUtilities
};
