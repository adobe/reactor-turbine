var isAnchor = require('./utils/dom/isAnchor');
var state = require('./state');
var logger = require('./utils/logger');

module.exports = function() {
  // Will get replaced by the pageBottom event delegate. Exists here in case there are no page bottom
  // rules (and therefore the pageBottom event delegate won't get included) and our customers
  // are still calling the method.
  _satellite.pageBottom = function() {};

  // Will get replaced by the directCall event delegate. Exists here in case there are no direct
  // call rules (and therefore the directCall event delegate won't get included) and our customers
  // are still calling the method.
  _satellite.track = function() {};

  _satellite.appVersion = state.getAppVersion();
  _satellite.notify = logger.notify.bind(logger);
  _satellite.getVar = require('./utils/dataElement/getVar');
  _satellite.setVar = require('./utils/dataElement/setVar');
// TODO: _satellite.getVisitorId
  _satellite.setCookie = require('./utils/cookie/setCookie');
  _satellite.readCookie = require('./utils/cookie/getCookie');
  _satellite.removeCookie = require('./utils/cookie/removeCookie');

  _satellite.isLinked = function(element) {
    return isAnchor(element, true);
  };

  _satellite.setDebug = function(value) {
    state.setDebugOuputEnabled(value);

    // TODO: Have state emit an event that logger listens to instead?
    logger.outputEnabled = value;
  };
};
