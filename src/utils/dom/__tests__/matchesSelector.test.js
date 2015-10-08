describe('matchesSelector', function() {
  var matchesSelector = require('../matchesSelector');

  it('returns true if the selector matches', function() {
    var div = document.createElement('div');
    div.className = 'foo';
    expect(matchesSelector(div, '.foo')).toBe(true);
  });

  it('returns false if the selector does not match', function() {
    var div = document.createElement('div');
    div.className = 'goo';
    expect(matchesSelector(div, '.foo')).toBe(false);
  });

  it('returns false for document', function() {
    expect(matchesSelector(document, 'document')).toBe(false);
  });

  it('returns false for window', function() {
    expect(matchesSelector(window, 'window')).toBe(false);
  });
});
