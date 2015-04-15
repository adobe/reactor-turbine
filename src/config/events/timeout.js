for (var i = 0; i < eventSettingsCollection.length; i++) {
  var eventSettings = eventSettingsCollection[i];
  setTimeout(function() {
    callback(eventSettings);
  }, eventSettings.duration);
}
