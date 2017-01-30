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

var isPlainObject = require('../isPlainObject');

describe('isObject', function() {
  it('returns true when the item is a regular object', function() {
    var objects = [
      Object.create({}),
      Object.create(Object.prototype),
      {foo: 'bar'},
      {}
    ];

    objects.forEach(function(item) {
      expect(isPlainObject(item)).toBe(true);
    });
  });

  it('returns false when the item is not a regular object', function() {
    var Foo = function() {
      this.abc = {};
    };

    var nonObjects = [
      /foo/,
      function() {},
      1,
      ['foo', 'bar'],
      [],
      new Foo,
      null,
      Object.create(null)
    ];

    nonObjects.forEach(function(item) {
      expect(isPlainObject(item)).toBe(false);
    });
  });
});
