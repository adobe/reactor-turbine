var forEach = require('forEach');

var triggers = [];
var called = false;

window._satellite.pageBottom = function() {
  if (!called) {
    var pseudoEvent = {
      type: 'pagebottom',
      target: document.location
    };

    forEach(triggers, function(trigger){
      trigger(pseudoEvent, document.location);
    });
  }
  called = true;
};

module.exports = function(trigger) {
  triggers.push(trigger);
};
