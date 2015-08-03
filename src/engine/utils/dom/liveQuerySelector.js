var covertData = require('./../covertData');
var globalPoll = require('../communication/globalPoll');

// Create a naked object with no prototype so we can safely use it as a map.
var listenersBySelector = Object.create(null);
var listenerId = 0;
var pollingInitialized = false;

function findElements() {
  // Using for loops instead of forEach and functions because this will process a lot and we want
  // to be as efficient as possible.
  for (var selector in listenersBySelector) {
    var listeners = listenersBySelector[selector];

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      var covertDataKey = 'dtm.liveQuerySelector.seen.' + listener.id;
      var elements = document.querySelectorAll(selector);

      for (var j = 0; j < elements.length; j++) {
        var element = elements[j];

        if (!covertData(element, covertDataKey)) {
          covertData(element, covertDataKey, true);
          listener.callback(element);
        }
      }
    }
  }
}

function initializePolling() {
  if (!pollingInitialized) {
    globalPoll('liveFindElements', findElements);
    pollingInitialized = true;
  }
}

module.exports = function(selector, callback) {
  var listeners = listenersBySelector[selector];

  if (!listeners) {
    listeners = listenersBySelector[selector] = [];
  }

  listeners.push({
    id: listenerId++,
    callback: callback
  });

  initializePolling();
};
