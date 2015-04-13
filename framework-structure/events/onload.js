module.exports = function(eventSettingsCollection, callback){
  _satellite.utils.addEventListener(window, 'load', function(event){
    _satellite.utils.each(eventSettingsCollection,function (eventSettings){
      callback(eventSettings);
    });
  });
};
