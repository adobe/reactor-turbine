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

/**
 * Retrieves a variable value from the current URL querystring.
 * @param name The name of the querystring parameter.
 * @param [caseInsensitive=false] Whether differences in parameter name casing should be ignored.
 * This does not change the value that is returned.
 * @returns {string}
 */
module.exports = function(name, caseInsensitive) {
  // We can't cache querystring values because they can be changed at any time with
  // the HTML5 History API.
  var match = new RegExp('[?&]' + name + '=([^&]*)', caseInsensitive ? 'i' : '')
      .exec(window.location.search);

  if (match) {
    return decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
};
