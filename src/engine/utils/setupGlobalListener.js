var addEventListener = require('./addEventListener');
var forEach = require('./forEach');

module.exports = function setupGlobalListener(node,eventType,eventSettingsCollection,callback){
  addEventListener(node, eventType, function(event) {
    forEach(eventSettingsCollection, function (eventSettings) {
      callback(eventSettings,event);
    });
  });
};
