return function(extensionSettings) {
  var promise = new dtmUtils.Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve('ABC123');
    }, 2000);
  });

  return {
    loadIdPromise: promise
  };
};
