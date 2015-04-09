var eventBus = require('../private/pubsub');

module.exports = function(ruleString){
  eventBus.trigger('directcall.' + ruleString);
};
