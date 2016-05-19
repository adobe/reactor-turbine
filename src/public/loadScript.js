var Promise = require('./Promise');

var getPromise = function(url, script) {
  return new Promise(function(resolve, reject) {
    if ('onload' in script) {
      script.onload = function() {
        resolve(script);
      };

      script.onerror = function() {
        reject(new Error('Failed to load script ' + url));
      };
    } else if ('readyState' in script) {
      script.onreadystatechange = function() {
        var rs = script.readyState;
        if (rs === 'loaded' || rs === 'complete') {
          script.onreadystatechange = null;
          resolve(script);
        }
      };
    }
  });
};

module.exports = function(url) {
  var script = document.createElement('script');
  script.src = url;
  script.async = true;

  var promise = getPromise(url, script);

  document.getElementsByTagName('head')[0].appendChild(script);
  return promise;
};
