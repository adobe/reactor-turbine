var dataStash = require('./../createDataStash')('liveQuerySelector');
var globalPoll = require('../communication/globalPoll');
var once = require('../once');

// Create a naked object with no prototype so we can safely use it as a map.
var callbacksBySelector = Object.create(null);

var findElements = function() {
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
};

var initializePolling = once(function() {
  globalPoll('liveFindElements', findElements);
});

var callbackIdIncrementor = 0;

/**
 * Polls for elements added to the DOM matching a given selector.
 * @param {String} selector The CSS selector used to find elements.
 * @param {Function} callback A function that will be called once and only once for each element
 * found. The element will be passed to the callback.
 */
module.exports = function(selector, callback) {
  var callbacks = callbacksBySelector[selector];

  if (!callbacks) {
    callbacks = callbacksBySelector[selector] = [];
  }

  var callbackId = callbackIdIncrementor++;

  // This function will be called for every element found matching the selector but we will only
  // call the consumer's callback if it has not already been called for the element.
  callbacks.push(function(element) {
    var elementDataStash = dataStash(element);
    if (!elementDataStash[callbackId]) {
      elementDataStash[callbackId] = true;
      callback(element);
    }
  });

  initializePolling();
};
