var covertData = require('./../covertData');
var globalPoll = require('./globalPoll');

// Create a naked object with no prototype so we can safely use it as a map.
var listenersBySelector = Object.create(null);
var listenerId = 0;

var pollingInitialized = false;

function addListenersToNewElements(selector, listeners) {
  var elements = document.querySelectorAll(selector);

  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    var dataKey = 'dtm.liveListener.seen.' + listener.id;

    for (var j = 0; j < elements.length; j++) {
      var element = elements[j];

      if (covertData(element, dataKey)) {
        continue;
      }

      covertData(element, dataKey, true);

      // TODO: understand this chunk below
      // if (SL.propertiesMatch(rule.property, elm)){
      //   SL.registerEvents(elm, [rule.event])
      // }

      element.addEventListener(listener.type, listener.callback, listener.useCapture);
    }
  }
}

function initializePolling() {
  if (!pollingInitialized) {
    globalPoll('dynamicEvents', function() {
      for (var selector in listenersBySelector) {
        addListenersToNewElements(selector, listenersBySelector[selector]);
      }
    });
    pollingInitialized = true;
  }
}

module.exports = function(selector, type, callback, useCapture) {
  var listeners = listenersBySelector[selector];

  if (!listeners) {
    listeners = listenersBySelector[selector] = [];
  }

  var listener = {
    type: type,
    callback: callback,
    useCapture: useCapture,
    id: listenerId++
  };

  listeners.push(listener);

  // While we could just wait for the poller's next tick, let's try to
  // add the event listener to the target element immediately.
  addListenersToNewElements(selector, [listener]);

  initializePolling();
};
