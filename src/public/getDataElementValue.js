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

var state = require('../state');
var cleanText = require('../cleanText');
var logger = require('../logger');

var getErrorMessage = function(dataDef, dataElementName, errorMessage, errorStack) {
  return 'Failed to execute data element module ' + dataDef.modulePath + ' for data element ' +
    dataElementName + '. ' + errorMessage + (errorStack ? '\n' + errorStack : '');
};

module.exports = function(name, suppressDefault) {
  var dataDef = state.getDataElementDefinition(name);

  if (!dataDef) {
    return state.getPropertySettings().undefinedVarsReturnEmpty ? '' : null;
  }

  var storeLength = dataDef.storeLength;
  var moduleExports;

  try {
    moduleExports = state.getModuleExports(dataDef.modulePath);
  } catch (e) {
    logger.error(getErrorMessage(dataDef, name, e.message, e.stack));
    return;
  }

  if (typeof moduleExports !== 'function') {
    logger.error(getErrorMessage(dataDef, name, 'Module did not export a function.'));
    return;
  }

  var value;

  try {
    value = moduleExports(dataDef.settings);
  } catch (e) {
    logger.error(getErrorMessage(dataDef, name, e.message, e.stack));
    return;
  }

  if (value === undefined && storeLength) {
    value = state.getCachedDataElementValue(name, storeLength);
  } else if (value !== undefined && storeLength) {
    state.cacheDataElementValue(name, storeLength, value);
  }

  if ((value === undefined || value === null) && !suppressDefault) {
    value = dataDef.defaultValue || '';
  }

  if (typeof value === 'string') {
    if (dataDef.cleanText) {
      value = cleanText(value);
    }

    if (dataDef.forceLowerCase) {
      value = value.toLowerCase();
    }
  }

  return value;
};
