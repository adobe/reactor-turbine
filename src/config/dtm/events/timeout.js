dtmUtils.each(eventSettingsCollection, function(eventSettings) {
  setTimeout(function() {
    callback(eventSettings);
  }, eventSettings.duration);
});
