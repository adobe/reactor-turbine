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
      expect(isAnchor(innerSpan, false)).toBe(false);
    });

    it('returns false if searchAncestors is false', function() {
      expect(isAnchor(innerSpan, false)).toBe(false);
    });
  });
});
