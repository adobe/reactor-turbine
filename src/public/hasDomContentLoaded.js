/*eslint no-alert:0*/
'use strict';
var document = require('document');

module.exports = function() {
  // Check the page has been parsed, but all subresources have not yet been loaded.
  return ['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1;
};
