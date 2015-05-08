var forEach = require('forEach');

var triggers = [];
var called = false;

window._satellite.pageBottom = function() {
  if (!called) {
    forEach(triggers, function(trigger){
      trigger();
    });
  }
  called = true;
};

module.exports = function(trigger) {
  triggers.push(trigger);
};
