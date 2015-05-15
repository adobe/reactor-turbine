var addEventListener = require('./../dom/addEventListener');
var dynamicListener = require('./dynamicListener');
var matchesCSS = require('./../dom/matchesCSS');

module.exports = function(selector, type, eventHandlerOnElement, callback) {
  if (eventHandlerOnElement) {
    dynamicListener.register(selector, type, callback);
  } else {
    addEventListener(document, type, function(event) {
      if (matchesCSS(selector, event.target)) {
        callback(event);
      }
    })
  }
};
