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

var state = require('../state');
var cleanText = require('../cleanText');
var logger = require('./logger');

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

  if (value === undefined && !suppressDefault) {
    // Have to wrap "default" in quotes since it is a keyword.
    /*eslint-disable dot-notation*/
    value = dataDef.defaultValue || '';
    /*eslint-enable dot-notation*/
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
