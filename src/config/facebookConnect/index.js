// Only a single extension instance is supported primarily because the Facebook SDK only supports
// a single app ID per page.
return function(extensionSettings) {
  var loadSDKPromise = new dtmUtils.Promise(function(resolve, reject) {
    // TODO: Implement timeout.
    dtmUtils.loadScript('//connect.facebook.net/en_US/sdk.js', function(error) {
      if (error) {
        reject();
      } else {
        FB.init({
          appId: extensionSettings.appId,
          xfbml: !extensionSettings.hasOwnProperty('xfbml') || extensionSettings.xfbml === true,
          version: extensionSettings.version || 'v2.3'
        });
        resolve();
      }
    });
  });

  return {
    logIn: function() {
      loadSDKPromise.then(function() {
        FB.getLoginStatus(function(response) {
          if (response.status !== 'connected') {
            FB.login(dtmUtils.noop, { scope: extensionSettings.scope });
          }
        });
      });
    },
    logOut: function() {
      loadSDKPromise.then(function() {
        FB.logout();
      });
    },
    showDialog: function(actionSettings) {
      loadSDKPromise.then(function() {
        FB.ui(actionSettings);
      });
    },
    parseXFBML: function(actionSettings) {
      loadSDKPromise.then(function() {
        if (actionSettings.hasOwnProperty('selector')) {
          FB.XFBML.parse(dtmUtils.querySelector(actionSettings.selector));
        } else {
          FB.XFBML.parse();
        }
      });
    },
    loadSDKPromise: loadSDKPromise
  };
};
