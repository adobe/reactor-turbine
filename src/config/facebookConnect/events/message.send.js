extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('message.send', function(url) {
    next(eventSettingsCollection, { url: url });
  });
});
