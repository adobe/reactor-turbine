/*eslint no-alert:0*/
'use strict';
var logger = require('./logger');
var hasDomContentLoaded = require('./hasDomContentLoaded');

module.exports = function(html) {
  // Document object in XML files is different from the ones in HTML files. Documents served with
  // the `application/xhtml+xml` MIME type don't have the `document.write` method.
  // More info: https://www.w3.org/MarkUp/2004/xhtml-faq#docwrite or https://developer.mozilla.org/en-US/docs/Archive/Web/Writing_JavaScript_for_HTML
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
