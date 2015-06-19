var assign = require('assign');
var clientInfo = require('clientInfo');
var hideElements = require('hideElements');
var encodeObjectToURI = require('encodeObjectToURI');
var loadScript = require('loadScript');

// TODO...very much TODO.
////// Begin mbox stub code.

// EXAMPLE RESPONSE FROM LOADING MBOX WITH HTML OFFER
// var mboxCurrent = mboxFactories.get('default').get('frameworkdemo',0);
// mboxCurrent.setOffer(new mboxOfferAjax('<!-- Offer Id: 127993  -->Framework Demo Content'));
// mboxCurrent.getOffer().setOnLoad(function() {});
// mboxCurrent.loaded();

// EXAMPLE RESPONSE FROM LOADING MBOX WITH REDIRECT OFFER
// var mboxCurrent = mboxFactories.get('default').get('frameworkredirectdemo', 0);
// mboxCurrent.setOffer(new mboxOfferAjax(''));
// mboxCurrent.getOffer().setOnLoad(function() {
//   window.location.replace('http://dtm.aaronhardy.com/redirected.html');
// });
// mboxCurrent.loaded();
// mboxFactories.get('default').getPCId().forceId("1428596329084-332984.28_38");

var mboxes = [];

function getMboxByName(name) {
  for (var i = 0; i < mboxes.length; i++) {
    var mbox = mboxes[i];
    if (mbox.name === name) {
      return mbox;
    }
  }
}
var mbox = function(name, setOfferCallback) {
  this.name = name;
  this.setOfferCallback = setOfferCallback;
};
mbox.prototype.setOffer = function(mboxOfferAjax) {
  this.setOfferCallback(mboxOfferAjax.content);
  return {
    show: function() {
    }
  };
};
mbox.prototype.getOffer = function() {
  return {
    setOnLoad: function(fn) {
      fn(); // Normally not called until mbox.loaded() is called.
    }
  };
};
mbox.prototype.loaded = function() {
};
mbox.prototype.setEventTime = function() {
};
mbox.prototype.cancelTimeout = function() {
};

window.mboxFactories = {
  get: function() {
    return {
      get: getMboxByName,
      getPCId: function() {
        return {
          forceId: function() {
          }
        };
      }
    };
  }
};

var mboxOfferDefault = function() {
};
mboxOfferDefault.prototype.show = function() {
};
window.mboxOfferDefault = mboxOfferDefault;

window.mboxOfferAjax = function(content) {
  this.content = content;
};
////// End mbox stub code.


var MILLIS_IN_MINUTE = 60000;

var adobeVisitor = require('extensions').getOne('adobeVisitor');

// TODO: Handle canceling tool initialization. Not sure why this is supported.
var AdobeTarget = function(extensionSettings) {
  this._extensionSettings = extensionSettings;
  this._mboxPageId = this._generateId();
  this._browserTimeOffset = this._getBrowserTimeOffset();
  // TODO: There's more involved here. See mboxSession() in mbox.js.
  this._mboxSessionId = this._generateId();
  // TODO: This is appears to be set from the first mbox response script via forceId()
  this._mboxPCId = '1428072735333-818489.28_10';

  // Demonstrating extension dependency.
  adobeVisitor.then(function(instance) {
    console.log('VisitorID received by Target extension: ' + instance.visitorId);
  });
};

assign(AdobeTarget.prototype, {
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
    return now.getTime() - (now.getTimezoneOffset() * MILLIS_IN_MINUTE);
  },
  addMbox: function(actionSettings) {
    if (getMboxByName(actionSettings.name)) {
      return;
    }

    var protocol = document.location.protocol == 'file:' ? 'http:' : document.location.protocol;

    var args = {
      mboxHost: document.location.hostname,
      mboxPage: this._mboxPageId,
      screenWidth: clientInfo.getScreenWidth(),
      screenHeight: clientInfo.getScreenHeight(),
      browserWidth: clientInfo.getBrowserWidth(),
      browserHeight: clientInfo.getBrowserHeight(),
      browserTimeOffset: this._browserTimeOffset,
      colorDepth: clientInfo.colorDepth,
      mboxSession: this._mboxSessionId,
      mboxPC: this._mboxPCId,
      mboxCount: 1, // TODO needs to be incremented for each Mbox I believe.
      mboxTime: this._getTime(),
      mbox: actionSettings.name,
      mboxId: 0, // TODO needs to come from the number of mboxes with the same mbox name?
      mboxURL: document.location, // TODO should only get sent when passPageParameters is true? See _urlBuilder.setUrlProcessAction
      mboxReferrer: document.referrer, // TODO should only get sent when passPageParameters is true and URL is under 2000? See _urlBuilder.setUrlProcessAction
      mboxVersion: 56 // TODO remove when using framework?
    };

    assign(args, actionSettings.arguments);

    var showPage;

    if (actionSettings.hideElement) {
      showPage = hideElements(actionSettings.hideElement);
    }

    var setOffer = function(mboxContent) {
      if (mboxContent !== undefined) {
        var mboxContainer = document.querySelector(actionSettings.populateElement);
        if (mboxContainer) {
          mboxContainer.innerHTML = mboxContent;
        }
      }

      if (showPage) {
        showPage();
      }
    };

    mboxes.push(new mbox(actionSettings.name, setOffer));

    var requestType = 'ajax';

    var url = protocol + '//' + this._extensionSettings.serverHost + '/m2/' +
      this._extensionSettings.clientCode + '/mbox/' + requestType + '?' +
      encodeObjectToURI(args);

    loadScript(url);
  }
});

module.exports = function(extensionSettings) {
  return new AdobeTarget(extensionSettings);
};
