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

var textCleaner = require('../cleanText');

describe('cleanText', function() {
  it('removes extra spaces from a string', function() {
    expect(textCleaner('Clean   multiple    spaces')).toEqual('Clean multiple spaces');
  });

  it('removes new lines from a string', function() {
    expect(textCleaner('new line here \n and\nhere \n')).toEqual('new line here and here');
  });

  it('returns same string if no modifications need to be made', function() {
    expect(textCleaner('This is my Perfect String')).toEqual('This is my Perfect String');
  });

  it('removes spaces from the beginning and end of a string', function() {
    expect(textCleaner('  This is my String     ')).toEqual('This is my String');
  });

  it('returns unmodified value it is not a string', function() {
    expect(textCleaner()).toBeUndefined();
    expect(textCleaner(123)).toBe(123);
    var obj = {};
    expect(textCleaner(obj)).toBe(obj);
  });
});
