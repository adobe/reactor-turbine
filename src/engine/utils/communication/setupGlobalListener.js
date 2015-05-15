var addEventListener = require('./../dom/addEventListener');
var forEach = require('./../array/forEach');

module.exports = function setupGlobalListener(node,eventType,eventSettingsCollection,callback){
  addEventListener(node, eventType, function(event) {
    forEach(eventSettingsCollection, function (eventSettings) {
      callback(eventSettings,event);
    });
  });
};
