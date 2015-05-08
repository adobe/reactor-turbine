var connect = require('extensions').getOne('facebookConnect');

module.exports = function(trigger) {
  connect.then(function() {
    FB.Event.subscribe('comment.remove', function(event) {
      trigger(event);
    });
  })
};
