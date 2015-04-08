// TODO...very much TODO.
////// Begin mbox stub code.
var mboxes = [];

function getMboxByName(name) {
  for (var i = 0; i < mboxes.length; i++) {
    var mbox = mboxes[i];
    if (mbox.name === name) {
      return mbox;
    }
  }
};

var mbox = function(name, setOfferCallback) {
  this.name = name;
  this.setOfferCallback = setOfferCallback;
}
mbox.prototype.setOffer = function(mboxOfferAjax) {
  this.setOfferCallback(mboxOfferAjax.content);
};
mbox.prototype.getOffer = function() {
  return {
    setOnLoad: function() {}
  }
};
mbox.prototype.loaded = function() {};
mbox.prototype.setEventTime = function() {};

window.mboxFactories = {
  get: function() {
    return {
      get: getMboxByName,
      getPCId: function() {
        return {
          forceId: function() {}
        }
      }
    }
  }
}
////// End mbox stub code.

window.mboxOfferAjax = function(content) {
  this.content = content;
};

var MILLIS_IN_MINUTE = 60000;

// TODO: Handle canceling tool initialization. Not sure why this is supported.
var AdobeTargetExtension = function(propertySettings, extensionSettings) {
  this._propertySettings = propertySettings;
  this._extensionSettings = extensionSettings;
  this._mboxPageId = this._generateId();
  this._browserTimeOffset = this._getBrowserTimeOffset();
  // TODO: There's more involved here. See mboxSession() in mbox.js.
  this._mboxSessionId = this._generateId();
  // TODO: This is appears to be set from the first mbox response script via forceId()
  this._mboxPCId = '1428072735333-818489.28_10';
};

_satellite.utils.extend(AdobeTargetExtension.prototype, {
  // TODO: Can we use an ID generator util provided by DTM?
  _generateId: function() {
    return (new Date()).getTime() + "-" + Math.floor(Math.random() * 999999);
  },
  // TODO: Should this be a DTM util?
  _getBrowserTimeOffset: function() {
    return -new Date().getTimezoneOffset();
  },
  // TODO: Should this be a DTM util?
  _getTime: function() {
    var now = new Date();
    return now.getTime() - (now.getTimezoneOffset() * MILLIS_IN_MINUTE)
  },
  // TODO: Should be a DTM util.
  _createScript: function(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  },
  addMbox: function(actionSettings) {
    if (getMboxByName(actionSettings.mboxName)) {
      return;
    }

    //{"mboxGoesAround":".hero","mboxName":"myhero","arguments":["localmboxparam1=localmboxvalue1"],"timeout":"1500"}]}

    var protocol = document.location.protocol == 'file:' ? 'http:' : document.location.protocol;

    var args = {
      mboxHost: document.location.hostname,
      mboxPage: this._mboxPageId,
      screenWidth: _satellite.data.clientInfo.screenWidth,
      screenHeight: _satellite.data.clientInfo.screenHeight,
      browserWidth: _satellite.data.clientInfo.browserWidth,
      browserHeight: _satellite.data.clientInfo.browserHeight,
      browserTimeOffset: this._browserTimeOffset,
      colorDepth: _satellite.data.clientInfo.colorDepth,
      mboxSession: this._mboxSessionId,
      mboxPC: this._mboxPCId,
      mboxCount: 1, // TODO needs to be incremented for each Mbox I believe.
      mboxTime: this._getTime(),
      mbox: actionSettings.mboxName,
      mboxId: 0, // TODO needs to come from the number of mboxes with the same mbox name?
      mboxURL: document.location, // TODO should only get sent when passPageParameters is true? See _urlBuilder.setUrlProcessAction
      mboxReferrer: document.referrer, // TODO should only get sent when passPageParameters is true and URL is under 2000? See _urlBuilder.setUrlProcessAction
      mboxVersion: 56 // TODO remove when using framework?
    };

    _satellite.utils.extend(args, actionSettings.mboxArguments);

    var showPage = _satellite.utils.hidePage();

    var setOffer = function(mboxContent) {
      document.querySelector(actionSettings.mboxGoesAround).innerHTML = mboxContent;
      showPage();
    };

    mboxes.push(new mbox(actionSettings.mboxName, setOffer));

    var requestType = 'ajax';

    var url = protocol + '//' + this._extensionSettings.serverHost + '/m2/' +
        this._extensionSettings.clientCode + '/mbox/' + requestType + '?' +
        _satellite.utils.encodeObjectToURI(args);

    this._createScript(url);

  }
});

module.exports = AdobeTargetExtension;
