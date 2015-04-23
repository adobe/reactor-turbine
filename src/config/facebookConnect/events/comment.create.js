extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('comment.create', function(event) {
    next(eventSettingsCollection, event);
  });
});
