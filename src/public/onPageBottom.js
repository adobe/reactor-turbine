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

'use strict';

var window = require('window');
var document = require('document');
var once = require('./once');
var logger = require('../logger');

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
