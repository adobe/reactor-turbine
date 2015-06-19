var forEach = require('./../array/forEach');
var covertData = require('./../covertData');
var querySelectorAll = require('./../dom/querySelectorAll');
var addEventListener = require('./../dom/addEventListener');
var globalPoll = require('./globalPoll');

var listeners = [];
var listenerId = 0;

var registeredWithPoller = false;
module.exports = function(selector, type, callback) {
  var config = {
    selector: selector,
    type: type,
    callback: callback,
    id: listenerId++
  };

  listeners.push(config);

  // While we could just wait for the global poller's next tick, let's try to
  // add the event listener to the target element immediately.
  addListenersToNewElements(config);

  if (!registeredWithPoller) {
    globalPoll('dynamicEvents', function() {
      forEach(listeners, addListenersToNewElements);
    });
    registeredWithPoller = true;
  }
};

function addListenersToNewElements(config) {
  var dataKey = 'dtm.liveListener.seen.' + config.id;

  var elements = querySelectorAll(config.selector);
  forEach(elements, function(element) {
    if (covertData(element, dataKey)) {
      return;
    }

    covertData(element, dataKey, true);

    // TODO: understand this chunk below
    // if (SL.propertiesMatch(rule.property, elm)){
    //   SL.registerEvents(elm, [rule.event])
    // }

    addEventListener(element, config.type, config.callback);
  });
}
