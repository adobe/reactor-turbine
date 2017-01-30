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

var window = require('window');
var assign = window.Object.assign;

if (typeof assign === 'undefined') {
  assign = function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var from = arguments[i];
      if (from === null || from === undefined) {
        continue;
      }
      var keys = Object.keys(from);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        target[key] = from[key];
      }
    }
    return target;
  };
}

module.exports = assign;
