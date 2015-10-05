/*eslint no-alert:0*/
'use strict';
var logger = require('./logger');
var hasDomContentLoaded = require('./dom/hasDomContentLoaded');

module.exports = function(html) {
  if (!document.write) {
    logger.error('Cannot write HTML to the page. `document.write` is not available.');
    return;
  }

  if (hasDomContentLoaded()) {
    logger.error('Cannot call `document.write` after `DOMContentloaded` was fired.');
    return;
  }

  document.write(html);
};
