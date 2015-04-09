var dynamicListener = require('../utils/private/dynamicListener')
var utils = _satellite.utils;
var domReady = require('./domReady');
var eventBus = require('../utils/private/pubsub');

var events = {
  click: function(eventSettingsCollection, callback) {

    // setup direct bindings time bindings
    for( var i = eventSettingsCollection.length-1; i >= 0; i--){
      eventSettings = eventSettingsCollection[i];
      if(eventSettings.eventHandlerOnElement){
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
  },
  timeout: function(eventSettingsCollection, callback) {
    for (var i = 0; i < eventSettingsCollection.length; i++) {
      var eventSettings = eventSettingsCollection[i];
      setTimeout(function() {
        callback(eventSettings);
      }, eventSettings.duration)
    }
  },
  domReady: function(eventSettingsCollection, callback){
    utils.each(eventSettingsCollection,function (eventSettings){
      domReady(callback.bind(this,eventSettings));
    });
  },
  pageTop: function(eventSettingsCollection, callback){
    utils.each(eventSettingsCollection,function (eventSettings){
      callback(eventSettings);
    });
  },
  pageBottom: function(eventSettingsCollection, callback){
    eventBus.on('pageBottom',function (){
      utils.each(eventSettingsCollection,function (eventSettings){
        callback(eventSettings);
      });
    });
  }
};
module.exports = events;
