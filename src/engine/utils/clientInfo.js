/*global Iterator*/
var assign = require('./object/assign');

var matchUserAgent = function(regexs) {
  return function(userAgent) {
    for (var key in regexs) {
      var regex = regexs[key];
      var match = regex.test(userAgent);
      if (match) {
        return key;
      }
    }
    return 'Unknown';
  };
};

var exports = {};

var browser = matchUserAgent({
  OmniWeb: /OmniWeb/,
  'Opera Mini': /Opera Mini/,
  'Opera Mobile': /Opera Mobi/,
  Opera: /Opera/,
  'Mobile Safari': /Mobile(\/[0-9A-z]+)? Safari/,
  Chrome: /Chrome/,
  Firefox: /Firefox/,
  'IE Mobile': /IEMobile/,
  IE: /MSIE|Trident/,
  Safari: /Safari/
})(navigator.userAgent);

var os = matchUserAgent({
  iOS: /iPhone|iPad|iPod/,
  Blackberry: /BlackBerry/,
  'Symbian OS': /SymbOS/,
  Maemo: /Maemo/,
  Android: /Android [0-9\.]+;/,
  Linux: / Linux /,
  Unix: /FreeBSD|OpenBSD|CrOS/,
  Windows: /[\( ]Windows /,
  MacOS: /Macintosh;/
})(navigator.userAgent);

var deviceType = matchUserAgent({
  iPhone: /iPhone/,
  iPad: /iPad/,
  iPod: /iPod/,
  Nokia: /SymbOS|Maemo/,
  'Windows Phone': /IEMobile/,
  Blackberry: /BlackBerry/,
  Android: /Android [0-9\.]+;/,
  Desktop: /.*/
})(navigator.userAgent);

exports.userAgent = navigator.userAgent;

// Is a method because it has a likelihood of changing while the user is on the page.
var getBrowserWidth = function() {
  return window.innerWidth ? window.innerWidth : document.documentElement.offsetWidth;
};

// Is a method because it has a likelihood of changing while the user is on the page.
var getBrowserHeight = function() {
  return window.innerHeight ? window.innerHeight : document.documentElement.offsetHeight;
};

// Is a method because it has a likelihood of changing while the user is on the page.
var getResolution = function() {
  return window.screen.width + 'x' + window.screen.height;
};

// Is a method because it has a likelihood of changing while the user is on the page.
var getScreenWidth = function() {
  return window.screen.width;
};

// Is a method because it has a likelihood of changing while the user is on the page.
var getScreenHeight = function() {
  return window.screen.height;
};

var colorDepth = window.screen.pixelDepth ? window.screen.pixelDepth : window.screen.colorDepth;

var jsVersion = (function() {
  var tm = new Date();
  var a;
  var o;
  var i;
  var j = '1.2';
  var pn = 0;

  if (tm.setUTCDate) {
    j = '1.3';
    if (pn.toPrecision) {
      j = '1.5';
      a = [];
      if (a.forEach) {
        j = '1.6';
        i = 0;
        o = {};
        try {
          i = new Iterator(o);
          if (i.next) {
            j = '1.7';
            if (a.reduce) {
              j = '1.8';
              if (j.trim) {
                j = '1.8.1';
                if (Date.parse) {
                  j = '1.8.2';
                  if (Object.create) {
                    j = '1.8.5';
                  }
                }
              }
            }
          }
        } catch (e) {
          // Ignore
        }
      }
    }
  }
  return j;
})();

var isJavaEnabled = navigator.javaEnabled();

var isCookiesEnabled = window.navigator.cookieEnabled;

// TODO: Can we get rid of this? It's used by the Analytics extension but is a
// deprecated browser API.
var connectionType = (function() {
  try {
    document.body.addBehavior('#default#clientCaps');
    return document.body.connectionType;
  } catch (e) {
    // Ignore
  }
})();

// TODO: Can we get rid of this? It's used by the Analytics extension but is a
// deprecated browser API.
var isHomePage = (function() {
  var getTopFrameSet = function() {
    // Get the top frame set
    var topFrameSet = window;
    var parent;
    var location;
    try {
      parent = topFrameSet.parent;
      location = topFrameSet.location;
      while ((parent) &&
      (parent.location) &&
      (location) &&
      ('' + parent.location !== '' + location) &&
      (topFrameSet.location) &&
      ('' + parent.location !== '' + topFrameSet.location) &&
      (parent.location.host === location.host)) {
        topFrameSet = parent;
        parent = topFrameSet.parent;
      }
    } catch (e) {
      // Ignore
    }

    return topFrameSet;
  };

  try {
    document.body.addBehavior('#default#homePage');
    var nativeIsHomePage = document.body.isHomePage;
    return nativeIsHomePage ? nativeIsHomePage(getTopFrameSet().location) : false;
  } catch (e) {
    // Ignore
  }
})();

/**
 * Information that is highly unlikely to change while the user is on the page.
 */
var staticInfo = {
  browser: browser,
  os: os,
  deviceType: deviceType,
  colorDepth: colorDepth,
  jsVersion: jsVersion,
  isJavaEnabled: isJavaEnabled,
  isCookiesEnabled: isCookiesEnabled,
  connectionType: connectionType,
  isHomePage: isHomePage
};

/**
 * @returns {Object} A snapshot of all client information at this moment.
 */
var getSnapshot = function() {
  return assign({
    browserWidth: getBrowserWidth(),
    browserHeight: getBrowserHeight(),
    resolution: getResolution(),
    screenWidth: getScreenWidth(),
    screenHeight: getScreenHeight()
  }, staticInfo);
};

/**
 * Contains information about the client environment including static information that is unlikely
 * to change while the user is on the page and accessors for more dynamic information.
 */
module.exports = assign({
  getBrowserWidth: getBrowserWidth,
  getBrowserHeight: getBrowserHeight,
  getResolution: getResolution,
  getScreenWidth: getScreenWidth,
  getScreenHeight: getScreenHeight,
  getSnapshot: getSnapshot
}, staticInfo);
