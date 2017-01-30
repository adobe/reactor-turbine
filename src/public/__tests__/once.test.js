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

describe('once', function() {
  var once;

  beforeAll(function() {
    once = require('../once');
  });

  it('calls the target function at most a single time', function() {
    var targetFn = jasmine.createSpy();
    var oncified = once(targetFn);

    oncified();

    expect(targetFn.calls.count()).toBe(1);

    oncified();

    expect(targetFn.calls.count()).toBe(1);
  });

  it('calls the target function with the provided context', function() {
    var targetFn = jasmine.createSpy();
    var context = {};
    var oncified = once(targetFn, context);

    oncified();

    expect(targetFn.calls.first().object).toBe(context);
  });

  it('calls the target function with the provided arguments', function() {
    var targetFn = jasmine.createSpy();
    var oncified = once(targetFn);

    oncified('a', 'b');

    expect(targetFn.calls.first().args).toEqual(['a', 'b']);
  });
});
