require('./state').init(window._satellite.container); // Must come first.
require('./hydrateSatelliteObject')();
require('./utils/preprocessConfig').init(state.getPropertyConfig().undefinedVarsReturnEmpty);
require('./utils/logger').outputEnabled = state.getDebugOutputEnabled();

// TODO: For use during development in order to see errors in the console from rule execution.
// require('./utils/logger').outputEnabled = true;

require('./initRules')(); // Must come last.
