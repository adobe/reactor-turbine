_satellite.runRule = function(name) {
  dtmUtils.each(eventSettingsCollection, function (eventSettings) {
    if (eventSettings.name === name) {
      next(eventSettings);
    }
  });
};
