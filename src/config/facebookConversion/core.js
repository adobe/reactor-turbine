var loadScript = require('loadScript');

var core;

module.exports = function(extensionSettings) {
  if (core) {
    return core;
  }

  var _fbq = window._fbq || (window._fbq = []);

  // Not sure why we need to use the loaded property but that's Facebook's documented way.
  if (!_fbq.loaded) {
    var locale = extensionSettings.locale || 'en_US';
    loadScript('//connect.facebook.net/' + locale + '/fbds.js');
    _fbq.loaded = true;
  }

  core = {
    track: function(actionSettings) {
      window._fbq.push([
        'track',
        actionSettings.pixelId,
        {
          value: actionSettings.value,
          currency: actionSettings.currency
        }
      ]);
    }
  };

  return core;
};
