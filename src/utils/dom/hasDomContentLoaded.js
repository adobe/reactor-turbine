/*eslint no-alert:0*/
'use strict';

module.exports = function() {
  // Check the page has been parsed, but all subresources have not yet been loaded.
  return document.readyState === 'complete'
    || document.readyState === 'loaded'
    || document.readyState === 'interactive';
};
