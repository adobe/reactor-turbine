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

'use strict';

var window = require('window');
var document = require('document');
var once = require('./once');
var logger = require('./logger');

var callbacks = [];

var pageBottomTriggered = false;

var pageBottomHandler = once(function() {
  pageBottomTriggered = true;

  callbacks.forEach(function(callback) {
    callback();
  });

  // No need to hold onto the functions anymore.
  callbacks = null;
});

window._satellite = window._satellite || {};

/**
 * Public function intended to be called by the hosting site at the bottom of the page.
 */
window._satellite.pageBottom = pageBottomHandler;

/**
 * Assume page bottom when DOMContentLoaded is fired, in case the hosting site didn't call
 * _satellite.pageBottom at the end of the page.
 */
document.addEventListener('DOMContentLoaded', function() {
  if (!pageBottomTriggered) {
    logger.error('_satellite.pageBottom() was not called before the document finished loading. ' +
      'Please call _satellite.pageBottom() at the end of the body tag to ensure proper behavior.');
    pageBottomHandler();
  }
});

/**
 * Page bottom utility. Calls the callback when _satellite.pageBottom() is called. If
 * _satellite.pageBottom() is not explicitly called, it will be simulated when
 * DOMContentLoaded is fired. If a callback is registered after _satellite.pageBottom() has been
 * called, the callback will be immediately executed. We cannot use a promise for this API
 * because when a promise is resolved, its handlers are executed asynchronously which may be too
 * late, for example, when the handler is trying to write script tags into the document using
 * document.write before a document has finished loaded. Promises executing handlers asynchronously
 * is according to spec as noted in note #1:
 * https://github.com/promises-aplus/promises-spec/tree/90a4116ca081af1b9e51b36e8074a6ab874e0932#notes
 */
module.exports = function(callback) {
  if (pageBottomTriggered) {
    callback();
  } else {
    callbacks.push(callback);
  }
};
