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

var Promise = require('./Promise');

var getPromise = function(url, script) {
  return new Promise(function(resolve, reject) {
    if ('onload' in script) {
      script.onload = function() {
        resolve(script);
      };

      script.onerror = function() {
        reject(new Error('Failed to load script ' + url));
      };
    } else if ('readyState' in script) {
      script.onreadystatechange = function() {
        var rs = script.readyState;
        if (rs === 'loaded' || rs === 'complete') {
          script.onreadystatechange = null;
          resolve(script);
        }
      };
    }
  });
};

module.exports = function(url) {
  var script = document.createElement('script');
  script.src = url;
  script.async = true;

  var promise = getPromise(url, script);

  document.getElementsByTagName('head')[0].appendChild(script);
  return promise;
};
