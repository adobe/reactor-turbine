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

var window = require('@adobe/reactor-window');
var document = require('@adobe/reactor-document');
var once = require('./once');

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
 * Assume page bottom when the window load event fires in case the library was
 * loaded asynchronously and/or _satellite.pageBottom() was not called at the end of the page.
 * While we could potentially assume page bottom if DOMContentLoaded has fired, this detection
 * is problematic in IE10 and lower since readyState can be set to 'interactive' before DOM content
 * has been fully loaded:
 * https://bugs.jquery.com/ticket/12282
 * https://www.drupal.org/node/2235425
 * https://github.com/mobify/mobifyjs/issues/136
 */
document.readyState === 'complete' ?
  pageBottomHandler() :
  window.addEventListener('load', pageBottomHandler);

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
