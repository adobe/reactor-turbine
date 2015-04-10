var eventBus = require('../eventBus');

module.exports = function(ruleString){
  eventBus.trigger('directcall.' + ruleString);
};
