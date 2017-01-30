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

var EventEmitter = require('../EventEmitter');

describe('EventEmitter', function() {
  describe('mixin', function() {
    it('should extend existing constructors functions', function() {
      var fn = function() {};
      EventEmitter.mixin(fn);

      var instance = new fn();
      expect(instance.on).toEqual(jasmine.any(Function));
      expect(instance.off).toEqual(jasmine.any(Function));
      expect(instance.emit).toEqual(jasmine.any(Function));
    });

    it('should extend existing object', function() {
      var instance = {};
      EventEmitter.mixin(instance);

      expect(instance.on).toEqual(jasmine.any(Function));
      expect(instance.off).toEqual(jasmine.any(Function));
      expect(instance.emit).toEqual(jasmine.any(Function));
    });
  });
});
