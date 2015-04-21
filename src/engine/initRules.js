var each = require('./utils/public/each');
var isArray = require('./utils/public/isArray');
var extensionInstanceRegistry = require('./extensionInstanceRegistry');
var eventGroups = {};

module.exports = function(propertyMeta){
  each(propertyMeta.newRules,function(rule){
    initRule(rule);
  });
  initEvents(propertyMeta);
};

function initRule(rule){
  if(rule.event){
    var settings = rule.event.settings;
    if (!settings) {
      settings = rule.event.settings = {};
    }
    settings._rule = rule;

    if(eventGroups[rule.event.type]){
      eventGroups[rule.event.type].push(settings);
    }else{
      eventGroups[rule.event.type] = [settings];
    }
  }
}

function initEvents(propertyMeta){
  for(var key in propertyMeta.events){
    if(eventGroups[key] && eventGroups[key].length > 0){
      propertyMeta.events[key](
        eventGroups[key],
        function (eventSettingsCollection, event){
          if (!isArray(eventSettingsCollection)) {
            eventSettingsCollection = [eventSettingsCollection];
          }

          each(eventSettingsCollection, function(eventSettings) {
            checkConditions(propertyMeta, eventSettings._rule, event);
          });
        },
        extensionInstanceRegistry.getMappedByType());
    }
  }
}

function checkConditions(propertyMeta, rule, event) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];
      condition.settings = condition.settings || {};

      if (!propertyMeta.conditions[condition.type](
          condition.settings,
          event,
          extensionInstanceRegistry.getMappedByType())) {
        return;
      }
    }
  }

  runActions(rule);
}

function runActions(rule){
  each(rule.actions,function(action) {
    action.settings = action.settings || {};
    each(action.extensionInstanceIds,function(instanceId) {
      var instance = extensionInstanceRegistry.getById(instanceId);
      instance[action.method](action.settings);
    });
  });
}
