var once = require('../once');

var POLL_INTERVAL = 3000;

var listeners = [];

var executeListeners = function() {
  // This could be called a lot so for instead of forEach to squeak out a bit of speed
  for (var i = 0; i < listeners.length; i++) {
    listeners[i].callback();
  }
}

var startPolling = once(function() {
  setInterval(executeListeners, POLL_INTERVAL);
});

module.exports = function(name, callback) {
  var listener = {name: name, callback: callback};
  listeners.push(listener);

  startPolling();

  return function() {
    var index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};
