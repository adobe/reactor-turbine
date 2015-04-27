module.exports = function(propertyMeta, extensionInstanceRegistry) {
  for(var key in propertyMeta.events){
    if(eventGroups[key] && eventGroups[key].length > 0){
      propertyMeta.events[key](
        eventGroups[key],
        function (eventSettingsCollection, event){
          if (!isArray(eventSettingsCollection)) {
            eventSettingsCollection = [eventSettingsCollection];
          }

          each(eventSettingsCollection, function(eventSettings) {
            checkConditions(propertyMeta, eventSettings._rule, event, extensionInstanceRegistry);
          });
        },
        extensionInstanceRegistry.getMappedByType());
    }
  }
}
