var FacebookConnect = function(extensionSettings) {
  this.extensionSettings = extensionSettings;

  dtmUtils.loadScript('//connect.facebook.net/en_US/sdk.js', function(error) {
    if (!error) {
      FB.init({
        appId      : extensionSettings.appId,
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.3' // use version 2.3
      });
    }
  });
};

dtmUtils.extend(FacebookConnect.prototype, {
  logIn: function() {
    var self = this;
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        FB.login(function(response) {
          console.log('Welcome! Fetching your information...');
          FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
          });
        }, {
          scope: self.extensionSettings.scope
        });
      }
    });
  },
  share: function(actionSettings) {
    FB.ui({
      method: 'share',
      href: actionSettings.href,
      caption: actionSettings.caption
    }, function(response) {});
  }
});

return FacebookConnect;
