_satellite.runRule = function(name) {
  dtmUtils.each(eventSettingsCollection, function (eventSettings) {
    if (eventSettings.name === name) {
      callback(eventSettings);
    }
  });
};
