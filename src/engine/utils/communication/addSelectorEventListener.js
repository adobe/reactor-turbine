var addEventListener = require('./../dom/addEventListener');
var addDynamicListener = require('./addDynamicEventListener');
var matchesCSS = require('./../dom/matchesCSS');

module.exports = function(selector, type, eventHandlerOnElement, callback) {
  if (eventHandlerOnElement) {
    addDynamicListener(selector, type, callback);
  } else {
    addEventListener(document, type, function(event) {
      if (matchesCSS(selector, event.target)) {
        callback(event);
      }
    })
  }
};
