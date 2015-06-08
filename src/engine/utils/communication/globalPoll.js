var configs = [];

var pollingStarted = false;

function executeListeners() {
  // This could be called a lot so for instead of forEach to squeak out a bit of speed
  for (var i = 0; i < configs.length; i++) {
    configs[i].callback();
  }
}

function startPolling() {
  if (!pollingStarted) {
    setInterval(executeListeners, 3000);
    pollingStarted = true;
  }
}

module.exports = function(name, callback){
  var config = { name: name, callback: callback };
  configs.push(config);

  startPolling();

  return function() {
    var index = configs.indexOf(callback);
    if (index > -1) {
      configs.splice(index, 1);
    }
  };
};
