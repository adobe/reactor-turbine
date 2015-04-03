var each = require('../utils/public/each');
var eventGroups = {};

module.exports = function(propertyMeta){
  each(propertyMeta.newRules,function(rule){
    initRule(rule);
  });
  initEvents(propertyMeta.events);
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

function initEvents(events){
  for(var key in events){
    events[key](eventGroups[key],function (eventSettings){
      runActions(eventSettings._rule);
    });
  }
}


function runActions(rule){
  each(rule.actions,function(action) {
    each(action.extensionInstanceIds,function(instanceId) {
      var instance = _satellite.extensionInstances[instanceId];
      instance[action.method](action.settings);
    });
  });
}
