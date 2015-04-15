var each = require('./utils/public/each');
var eventGroups = {};

module.exports = function(propertyMeta){
  each(propertyMeta.newRules,function(rule){
    initRule(rule);
  });
  initEvents(propertyMeta);
};

function initRule(rule){
  if(rule.event){
    rule.event.settings._rule = rule;
    if(eventGroups[rule.event.type]){
      eventGroups[rule.event.type].push(rule.event.settings);
    }else{
      eventGroups[rule.event.type] = [rule.event.settings];
    }
  }
}

//TODO: put in events.js
function initEvents(propertyMeta){
  for(var key in propertyMeta.events){
    if(eventGroups[key] && eventGroups[key].length > 0){
      propertyMeta.events[key](eventGroups[key],function (eventSettings, event){
        checkConditions(propertyMeta, eventSettings._rule, event);
      });
    }
  }
}

function checkConditions(propertyMeta, rule, event) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];

      if (!propertyMeta.conditions[condition.type](condition.settings, event)) {
        return;
      }
    }
  }

  runActions(rule);
}

//TODO: put in actions.js
function runActions(rule){
  each(rule.actions,function(action) {
    each(action.extensionInstanceIds,function(instanceId) {
      var instance = _satellite.extensionInstances[instanceId];
      instance[action.method](action.settings);
    });
  });
}
