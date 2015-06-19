var connect = require('extensions').getOne('facebookConnect');

module.exports = function(trigger) {
  connect.then(function() {
    FB.Event.subscribe('auth.statusChange', function(response) {
      trigger(response);
    });
  });
};
