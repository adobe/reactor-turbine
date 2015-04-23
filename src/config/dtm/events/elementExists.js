
dtmUtils.globalPolling.add('elementexistsevents', function(){
  dtmUtils.each(eventSettingsCollection, function(eventSettings){
    var elms = dtmUtils.querySelectorAll(eventSettings.selector);
    if (elms.length > 0){
      var elm = elms[0];
      if (dtmUtils.dataOnElement(elm, 'elementexists.seen')) return;
      dtmUtils.dataOnElement(elm, 'elementexists.seen', true);
      next(eventSettings);
    }
  });
});
