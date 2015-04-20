dtmUtils.setupDynamicListener(eventSettingsCollection,'click',function(eventSettings,event){
  callback(eventSettings, event);
});

dtmUtils.setupGlobalListener(document,'click',eventSettingsCollection,function(eventSettings,event){
  if (eventSettings.selector && dtmUtils.matchesCss(eventSettings.selector, event.target)) {
    callback(eventSettings, event);
  }
});
