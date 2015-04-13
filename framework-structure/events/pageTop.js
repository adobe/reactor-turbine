module.exports = function(eventSettingsCollection, callback){
  _satellite.utils.each(eventSettingsCollection,function (eventSettings){
    callback(eventSettings);
  });
};
