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

/*eslint no-alert:0*/
'use strict';
var document = require('document');

var domContentLoaded = false;

document.addEventListener('DOMContentLoaded', function() {
  domContentLoaded = true;
});

module.exports = function() {
  return domContentLoaded;
  // We can't do something like the following because IE (at least 9 and 10) sets readyState to
  // interactive after loading the first external file which comes long before the
  // DOMContentLoaded event.
  // return ['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1;
};
