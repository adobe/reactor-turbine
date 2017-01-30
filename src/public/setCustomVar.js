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

var customVars = require('../state').customVars;

module.exports = function() {
  if (typeof arguments[0] === 'string') {
    customVars[arguments[0]] = arguments[1];
  } else if (arguments[0]) { // assume an object literal
    var mapping = arguments[0];
    for (var key in mapping) {
      customVars[key] = mapping[key];
    }
  }
};
