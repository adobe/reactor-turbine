extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('auth.authResponseChanged', function(response) {
    next(eventSettingsCollection, response);
  });
});
