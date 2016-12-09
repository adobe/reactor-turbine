var state = require('./state');

if (!window._satellite) {
  window._satellite = {
    container: {
      rules: []
    }
  };
}

require('./hydrateSatelliteObject')(
  window._satellite.container.buildInfo,
  state.setDebugOutputEnabled
);

state.init(window._satellite.container); // Must come first.
require('./public/logger').outputEnabled = state.getDebugOutputEnabled();
require('./initRules')(); // Must come last.
