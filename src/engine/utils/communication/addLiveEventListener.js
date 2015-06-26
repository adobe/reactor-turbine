var covertData = require('./../covertData');
var addEventListener = require('./../dom/addEventListener');
var globalPoll = require('./globalPoll');

var listeners = [];
var listenerId = 0;

var registeredWithPoller = false;

function addListenersToNewElements(listener) {
  var dataKey = 'dtm.liveListener.seen.' + listener.id;
  var elements = document.querySelectorAll(listener.selector);

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    if (covertData(element, dataKey)) {
      continue;
    }

    covertData(element, dataKey, true);

    // TODO: understand this chunk below
    // if (SL.propertiesMatch(rule.property, elm)){
    //   SL.registerEvents(elm, [rule.event])
    // }

    addEventListener(element, listener.type, listener.callback);
  }
}

module.exports = function(selector, type, callback) {
  var listener = {
    selector: selector,
    type: type,
    callback: callback,
    id: listenerId++
  };

  listeners.push(listener);

  // While we could just wait for the global poller's next tick, let's try to
  // add the event listener to the target element immediately.
  addListenersToNewElements(listener);

  if (!registeredWithPoller) {
    globalPoll('dynamicEvents', function() {
      listeners.forEach(addListenersToNewElements);
    });
    registeredWithPoller = true;
  }
};
