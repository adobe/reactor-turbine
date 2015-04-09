var eventBus = require('./utils/private/pubsub');


module.exports = function(){
  eventBus.trigger('pageBottom');
};
