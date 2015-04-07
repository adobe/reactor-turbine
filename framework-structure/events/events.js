var dynamicListener = require('../utils/private/dynamicListener')

var events = {
  click: function(eventSettingsCollection, callback) {
    var utils = _satellite.utils;
    // setup direct bindings time bindings
    for( var i = eventSettingsCollection.length-1; i >= 0; i--){
      eventSettings = eventSettingsCollection[i];
      if(eventSettings.eventHandlerOnElement){
        // TODO: setup polling here
        // TODO: wait for dom before attching listener
        dynamicListener.register(eventSettings,callback.bind(this,eventSettings));
        eventSettingsCollection.splice(i,1);
      }
    }
    // setup global event listener
    utils.addEventListener(document, 'click', function(event) {
      utils.each(eventSettingsCollection, function (eventSettings) {
        if (eventSettings.selector && utils.matchesCss(eventSettings.selector, event.target)) {
          callback(eventSettings);
        }
      });
    });
  }
};
module.exports = events;
