dtmUtils.addEventListener(window, 'load', function(event){
  dtmUtils.each(eventSettingsCollection,function (eventSettings){
    next(eventSettings);
  });
});