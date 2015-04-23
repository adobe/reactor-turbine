extensions.facebookConnect[0].loadSDKPromise.then(function() {
  FB.Event.subscribe('edge.remove', function(url, element) {
    next(eventSettingsCollection, { url: url, element: element });
  });
});
