extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('auth.logout', function(response) {
    next(eventSettingsCollection, response);
  });
});
