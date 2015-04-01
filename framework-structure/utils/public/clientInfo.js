var matcher = function(regexs){
  return function(userAgent){
    for (var key in regexs){
      var regex = regexs[key];
      var match = regex.test(userAgent);
      if (match) return key;
    }
    return "Unknown";
  };
};

// TODO: Can we get rid of this?
var getTopFrameSet = function() {
  // Get the top frame set
  var
      topFrameSet = window,
      parent,
      location;
  try {
    parent = topFrameSet.parent;
    location = topFrameSet.location;
    while ((parent) &&
    (parent.location) &&
    (location) &&
    ('' + parent.location != '' + location) &&
    (topFrameSet.location) &&
    ('' + parent.location != '' + topFrameSet.location) &&
    (parent.location.host == location.host)) {
      topFrameSet = parent;
      parent = topFrameSet.parent;
    }
  } catch (e) {}

  return topFrameSet;
};

var exports = {};

exports.getBrowser = matcher({
  OmniWeb: /OmniWeb/,
  "Opera Mini": /Opera Mini/,
  "Opera Mobile": /Opera Mobi/,
  Opera: /Opera/,
  "Mobile Safari": /Mobile(\/[0-9A-z]+)? Safari/,
  Chrome: /Chrome/,
  Firefox: /Firefox/,
  "IE Mobile": /IEMobile/,
  IE: /MSIE|Trident/,
  Safari: /Safari/
});

exports.getOS = matcher({
  iOS: /iPhone|iPad|iPod/,
  Blackberry: /BlackBerry/,
  "Symbian OS": /SymbOS/,
  Maemo: /Maemo/,
  Android: /Android [0-9\.]+;/,
  Linux: / Linux /,
  Unix: /FreeBSD|OpenBSD|CrOS/,
  Windows: /[\( ]Windows /,
  MacOS: /Macintosh;/
});

exports.getDeviceType = matcher({
  iPhone: /iPhone/,
  iPad: /iPad/,
  iPod: /iPod/,
  Nokia: /SymbOS|Maemo/,
  "Windows Phone": /IEMobile/,
  Blackberry: /BlackBerry/,
  Android: /Android [0-9\.]+;/,
  Desktop: /.*/
});

exports.getUserAgent = function() {
  return navigator.userAgent;
};

exports.getBrowserWidth = function() {
  return window.innerWidth ? window.innerWidth : document.documentElement.offsetWidth;
};

exports.getBrowserHeight = function() {
  return window.innerHeight ? window.innerHeight : document.documentElement.offsetHeight;
};

exports.getResolution = function() {
  return window.screen.width + "x" + window.screen.height;
};

exports.getColorDepth = function() {
  return window.screen.pixelDepth ? window.screen.pixelDepth : window.screen.colorDepth;
};

exports.getJSVersion = function() {
  var
      tm = new Date,
      a,o,i,
      j = '1.2',
      pn = 0;

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
          i=new Iterator(o);
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
        } catch (e) {}
      }
    }
  }

  return j;
};

exports.getIsJavaEnabled = function() {
  return navigator.javaEnabled();
};

exports.getIsCookiesEnabled = function() {
  return window.navigator.cookieEnabled;
};

// TODO: Can we get rid of this?
exports.getConnectionType = function() {
  try {
    document.body.addBehavior('#default#clientCaps');
    return document.body.connectionType;
  } catch (e) {}
};

// TODO: Can we get rid of this?
exports.getIsHomePage = function() {
  try {
    document.body.addBehavior('#default#homePage');
    var isHomePage = document.body.isHomePage;
    return isHomePage ? isHomePage(getTopFrameSet().location) : false;
  } catch (e) {}
};

module.exports = exports;

