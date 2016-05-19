var state = require('./state');

if (!window._satellite) {
  window._satellite = {
    container: {
      rules: []
    }
  };
}

state.init(window._satellite.container); // Must come first.
require('./hydrateSatelliteObject')();
require('./public/logger').outputEnabled = state.getDebugOutputEnabled();
require('./initRules')(); // Must come last.
