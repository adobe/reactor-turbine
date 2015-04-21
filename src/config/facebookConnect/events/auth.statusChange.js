extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('auth.statusChange', function(response) {
    callback(eventSettingsCollection, response);
  });
});
