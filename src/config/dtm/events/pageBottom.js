_satellite.pageBottom = function() {
  dtmUtils.each(eventSettingsCollection, function (eventSettings){
    callback(eventSettings);
  });
};
