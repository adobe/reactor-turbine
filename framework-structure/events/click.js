var setupDynamicListener = require('./_setupDynamicListener');
var setupGlobalListener = require('./_setupGlobalListener');

module.exports = function(eventSettingsCollection, callback) {
  setupDynamicListener(eventSettingsCollection,function(eventSettings,event){
    callback(eventSettings, event);
  });

  setupGlobalListener(document,'click',eventSettingsCollection,function(eventSettings,event){
    if (eventSettings.selector && _satellite.utils.matchesCss(eventSettings.selector, event.target)) {
      callback(eventSettings, event);
    }
  });
};
