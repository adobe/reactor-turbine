'use strict';

var cookieValues;

var mockGetCookie = jasmine.createSpy().and.callFake(function(key) {
  return cookieValues[key];
});

var mockSetCookie = jasmine.createSpy().and.callFake(function(key, value) {
  cookieValues[key] = value;
});

var mockDocument = {
  referrer: 'http://testreferrer.com/test.html'
};

var mockWindow = {
  location: {
    href: 'http://visitortracking.com/test.html'
  }
};

var visitorTrackingInjector = require('inject!../visitorTracking');
var visitorTracking = visitorTrackingInjector({
  'getCookie': mockGetCookie,
  'setCookie': mockSetCookie,
  'document': mockDocument,
  'window': mockWindow
});

var config = {
  propertyConfig: {
    trackVisitor: false
  }
};

var key = function(name) {
  return '_sdsat_' + name;
};

var getTrackingConfig = function(trackingEnabled) {
  return {
    propertyConfig: {
      trackVisitor: trackingEnabled
    }
  };
};

describe('visitor tracking', function() {
  beforeEach(function() {
    mockGetCookie.calls.reset();
    mockSetCookie.calls.reset();
    cookieValues = {};
  });

  it('tracks the landing page if the current page is the landing page', function() {
    var url1 = mockWindow.location.href;
    var url2 = 'http://visitortracking.com/somethingelse.html';
    var url1CookieRegex = /http:\/\/visitortracking\.com\/test\.html\|\d+$/;

    var tracker = visitorTracking(getTrackingConfig(true));
    var cookieValue = cookieValues[key('landing_page')];
    expect(tracker.getLandingPage()).toBe(url1);
    expect(url1CookieRegex.test(cookieValue)).toBe(true);

    mockWindow.location.href = url2;

    tracker = visitorTracking(getTrackingConfig(true));
    cookieValue = cookieValues[key('landing_page')];
    expect(tracker.getLandingPage()).toBe(url1);
    expect(url1CookieRegex.test(cookieValue)).toBe(true);
  });

  it('tracks the landing time', function() {
    jasmine.clock().install();

    var landingDate = new Date();
    jasmine.clock().mockDate(landingDate);

    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getLandingTime()).toBe(landingDate.getTime());

    // Simulate moving to a new page. The landing time should remain the same.
    mockWindow.location.href = 'http://visitortracking.com/somethingelse.html';

    jasmine.clock().tick(100000);

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getLandingTime()).toBe(landingDate.getTime());

    jasmine.clock().uninstall();
  });

  it('tracks minutes on site', function() {
    jasmine.clock().install();
    jasmine.clock().mockDate();

    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getMinutesOnSite()).toBe(0);

    jasmine.clock().tick(2.7 * 60 * 1000);

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getMinutesOnSite()).toBe(2);
    jasmine.clock().uninstall();
  });

  it('tracks the number of sessions', function() {
    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getSessionCount()).toBe(1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('session_count'), 1, 365 * 2);

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getSessionCount()).toBe(1);

    // Number of sessions is incremented only if the landing page cookie has not been set.
    delete cookieValues[key('landing_page')];

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getSessionCount()).toBe(2);
    expect(mockSetCookie).toHaveBeenCalledWith(key('session_count'), 2, 365 * 2);
  });

  it('tracks lifetime pages viewed', function() {
    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getLifetimePagesViewed()).toBe(1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('lt_pages_viewed'), 1, 365 * 2);

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getLifetimePagesViewed()).toBe(2);
    expect(mockSetCookie).toHaveBeenCalledWith(key('lt_pages_viewed'), 2, 365 * 2);
  });

  it('tracks session pages viewed', function() {
    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getSessionPagesViewed()).toBe(1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('pages_viewed'), 1);

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getSessionPagesViewed()).toBe(2);
    expect(mockSetCookie).toHaveBeenCalledWith(key('pages_viewed'), 2);
  });

  it('tracks traffic source', function() {
    var referrer1 = mockDocument.referrer;
    var referrer2 = 'http://otherreferrer.com';

    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getTrafficSource()).toBe(referrer1);
    expect(mockSetCookie).toHaveBeenCalledWith(key('traffic_source'), referrer1);

    mockDocument.referrer = referrer2;

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getTrafficSource()).toBe(referrer1);
    expect(mockSetCookie).not.toHaveBeenCalledWith(key('traffic_source'), referrer2);
  });
  
  it('tracks whether the visitor is new', function() {
    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getIsNewVisitor()).toBe(true);

    // The visitor is considered "returning" if more than one session has been recorded.
    // The session count is incremented when the landing page cookie has not been set.
    // Therefore, to make getIsNewVisitor() return false we have to reset the landing page cookie.
    delete cookieValues[key('landing_page')];

    tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.getIsNewVisitor()).toBe(false);
  });

  it('reflects whether tracking is enabled', function() {
    var tracker = visitorTracking(getTrackingConfig(true));
    expect(tracker.trackingEnabled).toBe(true);
    tracker = visitorTracking(getTrackingConfig(false));
    expect(tracker.trackingEnabled).toBe(false);
  });

  it('throws an error when calling a method and visitor tracking is disabled', function() {
    var tracker = visitorTracking(getTrackingConfig(false));
    expect(tracker.getLandingPage).toThrowError('Visitor tracking not enabled.');
  });
});
