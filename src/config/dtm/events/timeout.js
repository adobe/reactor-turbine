dtmUtils.each(eventSettingsCollection, function(eventSettings) {
  setTimeout(function() {
    next(eventSettings);
  }, eventSettings.duration);
});
