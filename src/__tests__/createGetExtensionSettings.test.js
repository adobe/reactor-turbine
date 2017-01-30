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

'use strict';

describe('function returned by createGetExtensionConfiguration', function() {
  var createGetExtensionSettings = require('inject!../createGetExtensionSettings')({
    './public/replaceTokens': function(obj) {
      var replacedObj = {};

      // Simulate replacing data element tokens.
      Object.keys(obj).forEach(function(key) {
        replacedObj[key] = obj[key] + ' - replaced';
      });

      return replacedObj;
    }
  });

  it('returns settings with data element tokens replaced', function() {
    var getExtensionSettings = createGetExtensionSettings({
      name: '%foo%'
    });

    expect(getExtensionSettings()).toEqual({
      name: '%foo% - replaced'
    });
  });

  it('gracefully handles undefined settings', function() {
    var getExtensionSettings = createGetExtensionSettings();

    expect(getExtensionSettings()).toEqual({});
  });
});
