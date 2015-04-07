var state = require('./data/state');
var events = require('./events/events');

module.exports = function(){
  if (!state.initialized) return;
  state.pageBottomFired = true;
  events.trigger('pagebottom');
}
