var each = require('./each');
var dataOnElement = require('./dataOnElement');
var querySelectorAll = require('./querySelectorAll');
var addEventListener = require('./addEventListener');
var globalPolling = require('./globalPolling');

var eventSettingsCollection = [];
var nextuid = -1;

module.exports = {};
module.exports.register = function(eventSettings,type,callback){
  eventSettingsCollection.push({
    eventSettings:eventSettings,
    type:type,
    callback:callback,
    id:nextuid++
  });
};

module.exports.init = function (){
  globalPolling.add('dynamicEvents',attachDynamicEvents);
};

function attachDynamicEvents(){
  each(eventSettingsCollection, function(event){
    querySelectorAll(event.eventSettings.selector, function(elms) {
      each(elms, function(elm){
        if (dataOnElement(elm, 'dynamicRules.seen'+event.id)) return;
        dataOnElement(elm, 'dynamicRules.seen'+event.id, true);
        // TODO: understand this chunk below
        // if (SL.propertiesMatch(rule.property, elm)){
        //   SL.registerEvents(elm, [rule.event])
        // }
        addEventListener(elm,event.type,event.callback.bind(this,event.eventSettings));
      });
    });
  });
}
