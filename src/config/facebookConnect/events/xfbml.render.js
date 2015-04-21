extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('xfbml.render', function() {
    callback(eventSettingsCollection);
  });
});
