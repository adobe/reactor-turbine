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

describe('hasDomContentLoaded', function() {
  it('returns true after DOM content was loaded', function() {
    var injectHasDomContentLoaded = require('inject!../hasDomContentLoaded');
    var hasDomContentLoaded = injectHasDomContentLoaded({
      'document': {
        addEventListener: function(type, callback) {
          if (type === 'DOMContentLoaded') {
            callback();
          }
        }
      }
    });

    expect(hasDomContentLoaded()).toBe(true);
  });

  it('returns false before DOM content was loaded', function() {
    var injectHasDomContentLoaded = require('inject!../hasDomContentLoaded');
    var hasDomContentLoaded = injectHasDomContentLoaded({
      'document': {
        addEventListener: function() {}
      }
    });

    expect(hasDomContentLoaded()).toBe(false);
  });
});
