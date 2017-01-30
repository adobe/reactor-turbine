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

var isAnchor = require('../isAnchor');

describe('isAnchor', function() {
  it('returns true if element is an anchor', function() {
    var a = document.createElement('a');
    expect(isAnchor(a)).toBe(true);
  });

  it('returns false if element is not an anchor', function() {
    var div = document.createElement('div');
    expect(isAnchor(div)).toBe(false);
  });

  describe('with element nested within anchor', function() {
    var innerSpan;

    beforeAll(function() {
      innerSpan = document.createElement('span');

      var outerSpan = document.createElement('span');
      outerSpan.appendChild(innerSpan);

      var a = document.createElement('a');
      a.appendChild(outerSpan);
    });

    it('returns true if searchAncestors is true', function() {
      expect(isAnchor(innerSpan, true)).toBe(true);
    });

    it('returns false if searchAncestors is false', function() {
      expect(isAnchor(innerSpan, false)).toBe(false);
    });
  });

  describe('with element nested within div', function() {
    var innerSpan;

    beforeAll(function() {
      innerSpan = document.createElement('span');

      var outerSpan = document.createElement('span');
      outerSpan.appendChild(innerSpan);

      var div = document.createElement('div');
      div.appendChild(outerSpan);
    });

    it('returns false if searchAncestors is true', function() {
      expect(isAnchor(innerSpan, true)).toBe(false);
    });

    it('returns false if searchAncestors is false', function() {
      expect(isAnchor(innerSpan, false)).toBe(false);
    });
  });
});
