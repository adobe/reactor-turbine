var loadScript = require('loadScript');

// Only a single extension instance is supported primarily because the Facebook SDK only supports
// a single app ID per page.

var Promise = require('Promise');

var promise;

function create(extensionSettings) {
  // There can only be a single FacebookConnect instance for the page.
  if (promise) {
    return promise;
  }

  var engine = {
    logIn: function() {
      promise.then(function() {
        FB.getLoginStatus(function(response) {
          if (response.status !== 'connected') {
            FB.login(function(){}, { scope: extensionSettings.scope });
          }
        });
      });
    },
    logOut: function() {
      promise.then(function() {
        FB.logout();
      });
    },
    showDialog: function(actionSettings) {
      promise.then(function() {
        FB.ui(actionSettings);
      });
    },
    parseXFBML: function(actionSettings) {
      promise.then(function() {
        if (actionSettings.hasOwnProperty('selector')) {
          FB.XFBML.parse(document.querySelector(actionSettings.selector));
        } else {
          FB.XFBML.parse();
        }
      });
    }
  };

  promise = new Promise(function(resolve, reject) {
    // TODO: Implement timeout.
    loadScript('//connect.facebook.net/en_US/sdk.js', function(error) {
      if (error) {
        reject();
      } else {
        FB.init({
          appId: extensionSettings.appId,
          xfbml: !extensionSettings.hasOwnProperty('xfbml') || extensionSettings.xfbml === true,
          version: extensionSettings.version || 'v2.3'
        });
        resolve(engine);
      }
    });
  });

  return promise;
}

module.exports = function(extensionSettings) {
  return create(extensionSettings);
};
