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

var getErrorMessage = function (
  dataDef,
  dataElementName,
  errorMessage,
  errorStack
) {
  return (
    'Failed to execute data element module ' +
    dataDef.modulePath +
    ' for data element ' +
    dataElementName +
    '. ' +
    errorMessage +
    (errorStack ? '\n' + errorStack : '')
  );
};

module.exports = function (
  moduleProvider,
  getDataElementDefinition,
  replaceTokens,
  undefinedVarsReturnEmpty,
  settingsFileTransformer
) {
  return function (name, syntheticEvent) {
    var dataDef = getDataElementDefinition(name);

    if (!dataDef) {
      return undefinedVarsReturnEmpty ? '' : undefined;
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
      logger.error(
        getErrorMessage(dataDef, name, 'Module did not export a function.')
      );
      return;
    }

    var value;

    var dataElementSettings = dataDef.settings || {};
    if (!dataDef.hasTransformedFilePaths && dataDef.filePaths) {
      settingsFileTransformer(
        dataElementSettings,
        dataDef.filePaths,
        dataDef.modulePath
      );
      dataDef.hasTransformedFilePaths = true;
    }

    try {
      value = moduleExports(
        replaceTokens(dataElementSettings, syntheticEvent),
        syntheticEvent
      );
    } catch (e) {
      logger.error(getErrorMessage(dataDef, name, e.message, e.stack));
      return;
    }

    if (storageDuration) {
      if (value != null) {
        dataElementSafe.setValue(name, storageDuration, value);
      } else {
        value = dataElementSafe.getValue(name, storageDuration);
      }
    }

    if (value == null && dataDef.defaultValue != null) {
      value = dataDef.defaultValue;
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
