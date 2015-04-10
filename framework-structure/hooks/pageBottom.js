var eventBus = require('../eventBus');

module.exports = function() {
  eventBus.trigger('pageBottom');
};
