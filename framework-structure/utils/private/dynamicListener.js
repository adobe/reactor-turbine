var each = require('../public/each');
var dataOnElement = require('../public/dataOnElement');
var querySelectorAll = require('../public/querySelectorAll');
var addEventListener = require('../public/addEventListener');
var poll = require('../public/poll');

function cssQuery(selector, callback){
  var hit = cssQuery.cache[selector]
  if (hit){
    return callback(hit)
  }else{
    querySelectorAll(selector, function(elms){
      cssQuery.cache[selector] = elms
      callback(elms)
    })
  }
}
cssQuery.cache = {};

var eventSettingsCollection = [];

module.exports = {};
module.exports.register = function(eventSettings,callback){
  eventSettingsCollection.push({
    eventSettings:eventSettings,
    callback:callback
  })
  // each(rules, function(rule){
  //   cssQuery(rule.selector, function(elms){
  //     each(elms, function(elm){
  //       if (dataOnElement(elm, 'dynamicRules.seen')) return
  //       dataOnElement(elm, 'dynamicRules.seen', true)
  //       if (SL.propertiesMatch(rule.property, elm)){
  //         SL.registerEvents(elm, [rule.event])
  //       }
  //     })
  //   })
  // })
}

module.exports.init = function (){
  poll(attachDynamicEvents,3000)
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
