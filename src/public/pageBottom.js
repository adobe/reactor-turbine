'use strict';

var window = require('window');
var document = require('document');
var Promise = require('./Promise');

window._satellite = window._satellite || {};

/**
 * Page bottom utility. It returns a Promise that is fullfilled once `_satellite.pageBottom` is
 * called or when `DOMContentLoaded` event is fired.
 */
module.exports = new Promise(function(resolve) {
  /**
   * Public function intended to be called by the user at the bottom of the page.
   */
  window._satellite.pageBottom = resolve;

  /**
   * Fullfill the promise when DOMContentLoaded is fired, in case someone didn't add
   * _satellite.pageBottom at the end of the page.
   */
  document.addEventListener('DOMContentLoaded', resolve);
});
