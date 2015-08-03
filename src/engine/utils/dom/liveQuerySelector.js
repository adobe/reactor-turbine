var createDataStash = require('./../createDataStash');
var globalPoll = require('../communication/globalPoll')
var SEEN = 'seen';

// Create a naked object with no prototype so we can safely use it as a map.
var callbacksBySelector = Object.create(null);
var pollingInitialized = false;

function findElements() {
  // Using for loops instead of forEach and functions because this will process a lot and we want
  // to be as efficient as possible.
  for (var selector in callbacksBySelector) {
    var callbacks = callbacksBySelector[selector];

    for (var i = 0; i < callbacks.length; i++) {
      var callback = callbacks[i];
      var elements = document.querySelectorAll(selector);

      for (var j = 0; j < elements.length; j++) {
        callback(elements[j]);
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
  var dataStash = createDataStash('liveQuery');
  var callbacks = callbacksBySelector[selector];

  if (!callbacks) {
    callbacks = callbacksBySelector[selector] = [];
  }

  callbacks.push(function(element) {
    if (!dataStash(element, SEEN)) {
      dataStash(element, SEEN, true);
      callback(element);
    }
  });

  initializePolling();
};
