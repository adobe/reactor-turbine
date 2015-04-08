var each = require('../public/each');
var dataOnElement = require('../public/dataOnElement');
var querySelectorAll = require('../public/querySelectorAll');
var addEventListener = require('../public/addEventListener');
var globalPolling = require('../private/globalPolling');

function cssQuery(selector, callback){
  //TODO: find a way to cache these lightly
  querySelectorAll(selector, function(elms){
    callback(elms);
  });
}
cssQuery.cache = {};

var eventSettingsCollection = [];

module.exports = {};
module.exports.register = function(eventSettings,callback){
  eventSettingsCollection.push({
    eventSettings:eventSettings,
    callback:callback
  })
}

module.exports.init = function (){
  globalPolling.add('dynamicEvents',attachDynamicEvents);
};

function attachDynamicEvents(){
  each(eventSettingsCollection, function(event){
    cssQuery(event.eventSettings.selector, function(elms){
      each(elms, function(elm){
        if (dataOnElement(elm, 'dynamicRules.seen')) return
        dataOnElement(elm, 'dynamicRules.seen', true)
        // TODO: understand this chunk below
        // if (SL.propertiesMatch(rule.property, elm)){
        //   SL.registerEvents(elm, [rule.event])
        // }
        addEventListener(elm,event.eventSettings._rule.event.type,event.callback)
      })
    })
  })
};
