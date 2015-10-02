'use strict';

var assign = require('assign');
var clientInfo = require('clientInfo');
var hideElements = require('hideElements');
var encodeObjectToURI = require('encodeObjectToURI');
var loadScript = require('loadScript');
var adobeVisitor = require('extensionCores').get('adobeVisitor');

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

var getMboxByName = function(name) {
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

// TODO: Can we use an ID generator util provided by DTM?
var generateId = function() {
  return (new Date()).getTime() + '-' + Math.floor(Math.random() * 999999);
};

// TODO: Should this be a DTM util?
var getTime = function() {
  var now = new Date();
  return now.getTime() - (now.getTimezoneOffset() * MILLIS_IN_MINUTE);
};

// TODO: Should this be a DTM util?
var browserTimeOffset = -new Date().getTimezoneOffset();

var mboxPageId = generateId();

// TODO: There's more involved here. See mboxSession() in mbox.js.
var mboxSessionId = this._generateId();

// TODO: This is appears to be set from the first mbox response script via forceId()
var mboxPCId = '1428072735333-818489.28_10';

// Demonstrating extension dependency.
adobeVisitor.then(function(instance) {
  console.log('VisitorID received by Target extension: ' + instance.visitorId);
});

module.exports = function(config) {
  if (!config.integrationConfigs.length) {
    return;
  }

  // Only support one integration at the moment.
  var integrationConfig = config.integrationConfigs[0];

  if (getMboxByName(config.actionConfig.name)) {
    return;
  }

  var protocol = document.location.protocol === 'file:' ? 'http:' : document.location.protocol;

  var args = {
    mboxHost: document.location.hostname,
    mboxPage: mboxPageId,
    screenWidth: clientInfo.getScreenWidth(),
    screenHeight: clientInfo.getScreenHeight(),
    browserWidth: clientInfo.getBrowserWidth(),
    browserHeight: clientInfo.getBrowserHeight(),
    browserTimeOffset: browserTimeOffset,
    colorDepth: clientInfo.colorDepth,
    mboxSession: mboxSessionId,
    mboxPC: mboxPCId,
    mboxCount: 1, // TODO needs to be incremented for each Mbox I believe.
    mboxTime: getTime(),
    mbox: config.actionConfig.name,
    mboxId: 0, // TODO needs to come from the number of mboxes with the same mbox name?
    // TODO should only get sent when passPageParameters is true?
    // See _urlBuilder.setUrlProcessAction
    mboxURL: document.location,
    // TODO should only get sent when passPageParameters is true and URL is under 2000?
    // See _urlBuilder
    mboxReferrer: document.referrer,
    mboxVersion: 56 // TODO remove when using framework?
  };

  assign(args, config.actionConfig.arguments);

  var showPage;

  if (config.actionConfig.hideElement) {
    showPage = hideElements(config.actionConfig.hideElement);
  }

  var setOffer = function(mboxContent) {
    if (mboxContent !== undefined) {
      var mboxContainer = document.querySelector(config.actionConfig.populateElement);
      if (mboxContainer) {
        mboxContainer.innerHTML = mboxContent;
      }
    }

    if (showPage) {
      showPage();
    }
  };

  /*eslint-disable new-cap*/
  mboxes.push(new mbox(config.actionConfig.name, setOffer));
  /*eslint-enable new-cap*/

  var requestType = 'ajax';

  var url = protocol + '//' + integrationConfig.serverHost + '/m2/' +
    integrationConfig.clientCode + '/mbox/' + requestType + '?' +
    encodeObjectToURI(args);

  loadScript(url);
};
