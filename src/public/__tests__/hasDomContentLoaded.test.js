describe('hasDomContentLoaded', function() {
  it('returns true after DOM content was loaded', function() {
    var injectHasDomContentLoaded = require('inject!../hasDomContentLoaded');
    var hasDomContentLoaded = injectHasDomContentLoaded({
      'document': {
        addEventListener: function(type, callback) {
          if (type === 'DOMContentLoaded') {
            callback();
          }
        }
      }
    });

    expect(hasDomContentLoaded()).toBe(true);
  });

  it('returns false before DOM content was loaded', function() {
    var injectHasDomContentLoaded = require('inject!../hasDomContentLoaded');
    var hasDomContentLoaded = injectHasDomContentLoaded({
      'document': {
        addEventListener: function() {}
      }
    });

    expect(hasDomContentLoaded()).toBe(false);
  });
});
