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

/**
 * Creates a function that, when called, will return a configuration object with data element
 * tokens replaced.
 *
 * @param {Object} settings
 * @returns {Function}
 */
module.exports = function(settings) {
  // We pull in replaceVarTokens here and not at the top of the file to prevent a
  // circular reference since dependencies of replaceVarTokens requires state which requires
  // this module.
  var replaceVarTokens = require('./public/replaceTokens');

  return function() {
    return settings ? replaceVarTokens(settings) : {};
  };
};
