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

describe('setCustomVar', function() {
  var customVars;
  var setCustomVar;

  beforeEach(function() {
    customVars = {};
    setCustomVar = require('inject!../setCustomVar')({
      '../state': {
        customVars: customVars
      }
    });
  });

  it('sets a single custom var', function() {
    setCustomVar('foo', 'bar');

    expect(customVars['foo']).toBe('bar');
  });

  it('sets multiple custom vars', function() {
    setCustomVar({
      foo: 'bar',
      animal: 'unicorn'
    });

    expect(customVars['foo']).toBe('bar');
    expect(customVars['animal']).toBe('unicorn');
  });
});
