var getCookie = require('getCookie');
var setCookie = require('setCookie');
var document = require('document');
var window = require('window');

function key(name){
  return '_sdsat_' + name;
}

var PAGE_TIME_DELIMITER = '|';

// returns whether this is a new visitor session
var trackLandingPage = function() {
  var landingPageKey = key('landing_page');
  var existingLanding = getCookie(landingPageKey);

  // I suppose we check if the stored value ends in a timestamp for backward-compatibility?
  // Maybe we weren't storing the timestamp at the end previously?
  // Regardless, this isn't entirely foolproof. If the landing page URL ended in a pipe + a number
  // then we would incorrectly assume that the number after the pipe is the timestamp we saved
  // previously. :/
  var endsInTimestampRegex = new RegExp('\\|\\d+$');
  if (!existingLanding || !endsInTimestampRegex.test(existingLanding)) {
    setCookie(landingPageKey, window.location.href + PAGE_TIME_DELIMITER + (new Date().getTime()));
  }

  return !existingLanding;
};

var getLandingPage = function() {
  var value = getCookie(key('landing_page'));
  return value ? value.substr(0, value.lastIndexOf(PAGE_TIME_DELIMITER)) : null;
};

var getLandingTime = function() {
  var value = getCookie(key('landing_page'));
  return value ? Number(value.substr(value.lastIndexOf(PAGE_TIME_DELIMITER) + 1)) : null;
};

var getMinutesOnSite = function() {
  var now = new Date().getTime();
  return Math.floor((now - getLandingTime()) / 1000 / 60);
};

var trackSessionCount = function(newSession){
  if (!newSession) {
    return;
  }
  var session = getSessionCount();
  setCookie(key('session_count'), session + 1, 365 * 2 /* two years */);
};

var getSessionCount = function() {
  return Number(getCookie(key('session_count')) || '0');
};

var getIsNewVisitor = function() {
  return getSessionCount() == 1;
};

var trackSessionPagesViewed = function() {
  setCookie(key('pages_viewed'), getSessionPagesViewed() + 1);
};

var trackLifetimePagesViewed = function() {
  setCookie(key('lt_pages_viewed'), getLifetimePagesViewed() + 1, 365 * 2);
};

var getLifetimePagesViewed = function() {
  return Number(getCookie(key('lt_pages_viewed')) || 0);
};

var getSessionPagesViewed = function() {
  return Number(getCookie(key('pages_viewed')) || 0);
};

var trackTrafficSource = function() {
  var k = key('traffic_source');
  if (!getCookie(k)){
    setCookie(k, document.referrer);
  }
};

var getTrafficSource = function() {
  return getCookie(key('traffic_source'));
};

var trackVisitor = function() {
  var newSession = trackLandingPage();
  trackSessionCount(newSession);
  trackLifetimePagesViewed();
  trackSessionPagesViewed();
  trackTrafficSource();
};

var throwDisabledError = function() {
  throw new Error('Visitor tracking not enabled.');
};

module.exports = function(config) {
  var trackingEnabled = config.propertyConfig.trackVisitor;

  if (trackingEnabled) {
    trackVisitor();
  }

  var wrapForEnablement = function(fn) {
    return trackingEnabled ? fn : throwDisabledError;
  };

  return {
    getLandingPage: wrapForEnablement(getLandingPage),
    getLandingTime: wrapForEnablement(getLandingTime),
    getMinutesOnSite: wrapForEnablement(getMinutesOnSite),
    getSessionCount: wrapForEnablement(getSessionCount),
    getLifetimePagesViewed: wrapForEnablement(getLifetimePagesViewed),
    getSessionPagesViewed: wrapForEnablement(getSessionPagesViewed),
    getTrafficSource: wrapForEnablement(getTrafficSource),
    getIsNewVisitor: wrapForEnablement(getIsNewVisitor),
    trackingEnabled: trackingEnabled
  };
};
