extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('edge.create', function(url, element) {
    next(eventSettingsCollection, { url: url, element: element });
  });
});
