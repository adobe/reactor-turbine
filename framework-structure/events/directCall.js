var eventBus = require('../eventBus');

module.exports = function(eventSettingsCollection, callback){
  _satellite.utils.each(eventSettingsCollection,function (eventSettings){
    eventBus.on('directcall.' + eventSettings.name,function (){
      callback(eventSettings);
    });
  });
};
