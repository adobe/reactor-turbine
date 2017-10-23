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

var cleanText = require('./cleanText');
var logger = require('./logger');
var dataElementSafe = require('./dataElementSafe');

var getErrorMessage = function(dataDef, dataElementName, errorMessage, errorStack) {
  return 'Failed to execute data element module ' + dataDef.modulePath + ' for data element ' +
    dataElementName + '. ' + errorMessage + (errorStack ? '\n' + errorStack : '');
};

var isDataElementValuePresent = function(value) {
  return value !== undefined && value !== null;
};

module.exports = function(
  moduleProvider,
  getDataElementDefinition,
  undefinedVarsReturnEmpty
) {
  return function(name) {
    var dataDef = getDataElementDefinition(name);

    if (!dataDef) {
      return undefinedVarsReturnEmpty ? '' : null;
    }

    var storageDuration = dataDef.storageDuration;
    var moduleExports;

    try {
      moduleExports = moduleProvider.getModuleExports(dataDef.modulePath);
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

    if (storageDuration) {
      if (isDataElementValuePresent(value)) {
        dataElementSafe.setValue(name, storageDuration, value);
      } else {
        value = dataElementSafe.getValue(name, storageDuration);
      }
    }

    if (!isDataElementValuePresent(value)) {
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
};
