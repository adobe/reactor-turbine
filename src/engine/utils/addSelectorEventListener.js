var addEventListener = require('./addEventListener');
var dynamicListener = require('./dynamicListener');
var matchesCss = require('./matchesCss');

module.exports = function(selector, type, eventHandlerOnElement, callback) {
  if (eventHandlerOnElement) {
    dynamicListener.register(selector, type, callback);
  } else {
    addEventListener(document, type, function(event) {
      if (matchesCss(selector, event.target)) {
        callback(event);
      }
    })
  }
};
