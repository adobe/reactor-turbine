var eventBus = require('../eventBus');

module.exports = function(eventSettingsCollection, callback){
  eventBus.once('pageBottom', function (){
    _satellite.utils.each(eventSettingsCollection,function (eventSettings){
      callback(eventSettings);
    });
  });
};
