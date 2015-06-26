'use strict';

var Promise = require('Promise');

module.exports = function() {
  return new Promise(function(resolve) {
    var instance = {
      visitorId: null
    };

    setTimeout(function() {
      instance.visitorId = 'ABC123';
      resolve(instance);
    }, 2000);
  });
};



