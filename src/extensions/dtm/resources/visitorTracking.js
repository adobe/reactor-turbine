var getCookie = require('getCookie');
var setCookie = require('setCookie');

function key(name){
  return '_sdsat_' + name;
}

// returns whether this is a new visitor session
var trackLandingPage = function() {
  // landing page
  var landingPageKey = key('landing_page');
  var existingLanding = getCookie(landingPageKey);

  if (!existingLanding || existingLanding.split('|').length < 2) {
    setCookie(landingPageKey, location.href + '|' + (new Date().getTime()));
  }

  return !existingLanding;
};

var visitorLandingPage = function() {
  var value = getCookie(key('landing_page'));
  return value ? value.split('|')[0] : null;
};

var visitorLandingTime = function() {
  var value = getCookie(key('landing_page'));
  return value ? Number(value.split('|')[1]) : null;
};

var minutesOnSite = function() {
  var now = new Date().getTime();
  return Math.floor((now - visitorLandingTime()) / 1000 / 60);
};

var trackSessionCount = function(newSession){
  if (!newSession) return;
  var session = SL.visitorSessionCount();
  setCookie(key('session_count'), session + 1, 365 * 2 /* two years */);
};

var visitorSessionCount = function() {
  return Number(getCookie(key('session_count')) || '0');
}

var isNewVisitor = function() {
  return visitorSessionCount() == 1;
};

var trackSessionPagesViewed = function() {
  setCookie(key('pages_viewed'), visitorSessionPagesViewed() + 1);
};

var trackLifetimePagesViewed = function() {
  setCookie(key('lt_pages_viewed'), visitorLifetimePagesViewed() + 1, 365 * 2);
};

var visitorLifetimePagesViewed = function() {
  return Number(getCookie(key('lt_pages_viewed')) || 0);
};

var visitorSessionPagesViewed = function() {
  return Number(getCookie(key('pages_viewed')) || '0');
};

var trackTrafficSource = function() {
  var k = key('traffic_source');
  if (!getCookie(k)){
    setCookie(k, document.referrer);
  }
};

var trafficSource = function() {
  return getCookie(key('traffic_source'));
};

var trackVisitor = function() {
  var newSession = trackLandingPage();
  trackSessionCount(newSession);
  trackLifetimePagesViewed();
  trackSessionPagesViewed();
  trackTrafficSource();
};

module.exports = function(config) {
  if (config.propertyConfig.trackVisitor) {
    trackVisitor();
  }

  return {
    isNewVisitor: isNewVisitor
  };
};
