var Promise = require('Promise');

module.exports = function(settings) {
  return new Promise(function(resolve, reject) {
    var instance = {
      visitorId: null
    };

    setTimeout(function() {
      instance.visitorId = 'ABC123';
      resolve(instance);
    }, 2000);
  });
};



