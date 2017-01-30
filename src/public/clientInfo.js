/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

var matchUserAgent = function(regexs) {
  return function(userAgent) {
    var keys = Object.keys(regexs);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var regex = regexs[key];
      if (regex.test(userAgent)) {
        return key;
      }
    }
    return 'Unknown';
  };
};

var browser = matchUserAgent({
  'IE Edge Mobile': /Windows Phone.*Edge/,
  'IE Edge': /Edge/,
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

/**
 * Contains information about the client environment.
 */
module.exports = {
  browser: browser,
  os: os,
  deviceType: deviceType
};
