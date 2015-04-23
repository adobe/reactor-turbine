dtmUtils.setupDynamicListener(eventSettingsCollection,'click',function(eventSettings,event){
  next(eventSettings, event);
});

dtmUtils.setupGlobalListener(document,'click',eventSettingsCollection,function(eventSettings,event){
  if (eventSettings.selector && dtmUtils.matchesCss(eventSettings.selector, event.target)) {
    next(eventSettings, event);
  }
});
