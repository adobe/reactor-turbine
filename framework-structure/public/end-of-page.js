var state = require('../data/state.js');
var events = require('../events/events.js');

module.exports = function(){
  if (!state.initialized) return;
  state.pageBottomFired = true;
  events.trigger('pagebottom');
}
