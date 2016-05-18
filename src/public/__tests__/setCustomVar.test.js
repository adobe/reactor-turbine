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
