extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('comment.remove', function(event) {
    callback(eventSettingsCollection, event);
  });
});
