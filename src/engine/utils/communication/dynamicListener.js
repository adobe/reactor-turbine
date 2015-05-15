var forEach = require('./../array/forEach');
var dataOnElement = require('./../dom/dataOnElement');
var querySelectorAll = require('./../dom/querySelectorAll');
var addEventListener = require('./../dom/addEventListener');
var globalPolling = require('./globalPolling');

var configs = [];
var nextuid = -1;

module.exports.register = function(selector, type, callback) {
  configs.push({
    selector: selector,
    type:type,
    callback:callback,
    id:nextuid++
  });
};

module.exports.init = function () {
  globalPolling.add('dynamicEvents', attachDynamicEvents);
};

function attachDynamicEvents(){
  forEach(configs, function(config){
    var elements = querySelectorAll(config.selector);
    forEach(elements, function(element){
      if (dataOnElement(element, 'dynamicRules.seen' + config.id)) {
        return;
      }

      dataOnElement(element, 'dynamicRules.seen' + config.id, true);

      // TODO: understand this chunk below
      // if (SL.propertiesMatch(rule.property, elm)){
      //   SL.registerEvents(elm, [rule.event])
      // }

      addEventListener(element, config.type, config.callback);
    });
  });
}
