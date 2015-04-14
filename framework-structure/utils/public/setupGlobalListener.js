var addEventListener = require('./addEventListener');
var each = require('./each');

module.exports = function setupGlobalListener(node,eventType,eventSettingsCollection,callback){
  addEventListener(node, eventType, function(event) {
    each(eventSettingsCollection, function (eventSettings) {
      callback(eventSettings,event);
    });
  });
};
