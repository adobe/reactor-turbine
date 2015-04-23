//direct attach , timeout
dtmUtils.setupDynamicListener(eventSettingsCollection,'mouseover',function(eventSettings,event){
  next(eventSettings, event);
});

dtmUtils.setupGlobalListener(document,'mouseover',eventSettingsCollection,function(eventSettings,event){
  if (eventSettings.selector && dtmUtils.matchesCss(eventSettings.selector, event.target)) {
    next(eventSettings, event);
  }
});
