//direct attach , timeout
dtmUtils.setupDynamicListener(eventSettingsCollection,'mouseover',function(eventSettings,event){
  callback(eventSettings, event);
});

dtmUtils.setupGlobalListener(document,'mouseover',eventSettingsCollection,function(eventSettings,event){
  if (eventSettings.selector && dtmUtils.matchesCss(eventSettings.selector, event.target)) {
    callback(eventSettings, event);
  }
});
