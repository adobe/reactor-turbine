var FacebookConnect = function(extensionSettings) {
  this.extensionSettings = extensionSettings;
  this._loadSDK();
};

dtmUtils.extend(FacebookConnect.prototype, {
  _loadSDK: function() {
    var self = this;
    dtmUtils.loadScript('//connect.facebook.net/en_US/sdk.js', function(error) {
      if (!error) {
        FB.init({
          appId: self.extensionSettings.appId,
          xfbml: self.extensionSettings.hasOwnProperty('xfbml') ? self.extensionSettings.xfbml : true,
          version: self.extensionSettings.version || 'v2.3'
        });
      }
    });
  },
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
  logOut: function() {
    FB.logout();
  },
  showDialog: function(actionSettings) {
    FB.ui(actionSettings);
  },
  parseXFBML: function(actionSettings) {
    if (actionSettings.hasOwnProperty('selector')) {
      FB.XFBML.parse(dtmUtils.querySelector(actionSettings.selector));
    } else {
      FB.XFBML.parse();
    }
  }
});

return FacebookConnect;
