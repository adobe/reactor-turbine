var connect = require('extensions').getOne('facebookConnect');

module.exports = function(trigger) {
  connect.then(function() {
    FB.Event.subscribe('message.send', function(url) {
      trigger({url: url});
    });
  });
};
