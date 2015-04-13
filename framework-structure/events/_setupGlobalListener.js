var addEventListener = require('../utils/public/addEventListener');
var each = require('../utils/public/each');

module.exports = function setupGlobalListener(node,eventType,eventSettingsCollection,callback){
  addEventListener(node, eventType, function(event) {
    each(eventSettingsCollection, function (eventSettings) {
      callback(eventSettings,event);
    });
  });
};
