var dynamicListener = require('./dynamicListener');

module.exports = function setupDynamicListener(eventSettings, type, callback){
  // setup direct bindings on dynamic Dom
  if (eventSettings.eventHandlerOnElement) {
    dynamicListener.register(eventSettings,type,function(eventSettings,event){
      callback(eventSettings,event);
    });
  }
};
