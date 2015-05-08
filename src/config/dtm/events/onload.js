var addEventListener = require('addEventListener');
var forEach = require('forEach');

var triggers = [];

addEventListener(window, 'load', function(){
  forEach(triggers, function(trigger) {
    trigger();
  });
});

module.exports = function(trigger) {
  triggers.push(trigger);
};
