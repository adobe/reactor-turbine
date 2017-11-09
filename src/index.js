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
var localStorage = require('./localStorage');
var logger = require('./logger');
var initRules = require('./initRules');

var HIDE_ACTIVITY_LOCAL_STORAGE_NAME = 'sdsat_hide_activity';
var DEBUG_LOCAL_STORAGE_NAME = 'sdsat_debug';

var _satellite = window._satellite;

if (_satellite) {
  var container = _satellite.container;

  // Remove container in public scope ASAP so it can't be manipulated by extension or user code.
  delete _satellite.container;

  var undefinedVarsReturnEmpty = container.property.settings.undefinedVarsReturnEmpty;

  var dataElements = container.dataElements || {};
  var getDataElementDefinition = function(name) {
    return dataElements[name];
  };

  var moduleProvider = createModuleProvider();

  var getDataElementValue = createGetDataElementValue(
    moduleProvider,
    getDataElementDefinition,
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

  var replaceTokens = createReplaceTokens(
    isVar,
    getVar,
    undefinedVarsReturnEmpty
  );

  var getDebugOutputEnabled = function() {
    return localStorage.getItem(DEBUG_LOCAL_STORAGE_NAME) === 'true';
  };

  var setDebugOutputEnabled = function(value) {
    localStorage.setItem(DEBUG_LOCAL_STORAGE_NAME, value);
    logger.outputEnabled = value;
  };

  var getShouldExecuteActions = function() {
    return localStorage.getItem(HIDE_ACTIVITY_LOCAL_STORAGE_NAME) !== 'true';
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
    container.rules || [],
    moduleProvider,
    replaceTokens,
    getShouldExecuteActions
  );
}

// Rollup's iife option always sets a global with whatever is exported, so we'll set the
// _satellite global with the same object it already is (we've only modified it).
module.exports = _satellite;
