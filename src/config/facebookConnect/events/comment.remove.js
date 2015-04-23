extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('comment.remove', function(event) {
    next(eventSettingsCollection, event);
  });
});
