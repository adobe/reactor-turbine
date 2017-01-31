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

describe('Promise', function() {
  var clearRequireCache = function() {
    // Make sure we start fresh for each test so we're not dealing
    // with cached values from previous tests. This is important so
    // that we properly determine what gets exported depending on global
    // variables that exist when turbine is loaded on a website.
    delete require.cache[require.resolve('../Promise')];
    delete require.cache[require.resolve('promise-polyfill')];
  };

  beforeEach(clearRequireCache);

  afterAll(clearRequireCache);

  it('returns native promise if available', function() {
    var originalPromise = window.Promise;
    var mockPromise = {};
    window.Promise = mockPromise;
    var Promise = require('../Promise');

    expect(Promise).toBe(mockPromise);

    window.Promise = originalPromise;
  });

  it('returns ponyfill promise if native promise not available', function() {
    var originalPromise = window.Promise;
    window.Promise = undefined;
    var Promise = require('../Promise');

    expect(Promise).toEqual(jasmine.any(Function));
    expect(Promise).not.toBe(originalPromise);
    expect(window.Promise).toBeUndefined();

    window.Promise = originalPromise;
  });
});
