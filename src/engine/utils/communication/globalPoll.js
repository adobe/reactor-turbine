var listeners = [];

var pollingStarted = false;

function executeListeners() {
  // This could be called a lot so for instead of forEach to squeak out a bit of speed
  for (var i = 0; i < listeners.length; i++) {
    listeners[i].callback();
  }
}

function startPolling() {
  if (!pollingStarted) {
    setInterval(executeListeners, 3000);
    pollingStarted = true;
  }
}

module.exports = function(name, callback){
  var listener = { name: name, callback: callback };
  listeners.push(listener);

  startPolling();

  return function() {
    var index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};
