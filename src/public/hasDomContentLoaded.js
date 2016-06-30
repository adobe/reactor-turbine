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
