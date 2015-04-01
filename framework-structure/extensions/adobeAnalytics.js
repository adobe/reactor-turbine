// TODO: Handle canceling tool initialization. Not sure why this is supported.
var AdobeAnalyticsExtension = function(extensionSettings) {
  this.extensionSettings = extensionSettings;
};

_satellite.utils.extend(AdobeAnalyticsExtension, {
  queryStringParamMap: {
    browserHeight: 'bh',
    browserWidth: 'bw',
    campaign: 'v0',
    channel: 'ch',
    charSet: 'ce',
    colorDepth: 'c',
    connectionType: 'ct',
    cookiesEnabled: function(obj, key, value) {
      obj['k'] = value ? 'Y' : 'N';
    },
    currencyCode: 'cc',
    dynamicVariablePrefix: 'D',
    eVar: function(obj, key, value) {
      obj['v' + key.substr(4)] = value;
    },
    events: function(obj, key, value) {
      obj['events'] = value.join(',');
    },
    hier: function(obj, key, value) {
      obj['h' + key.substr(4)] = value.substr(0, 255);
    },
    homePage: function(obj, key, value) {
      obj['hp'] = value ? 'Y' : 'N';
    },
    javaEnabled: function(obj, key, value) {
      obj['v'] = value ? 'Y' : 'N';
    },
    javaScriptVersion: 'j',
    linkName: 'pev2',
    linkType: function(obj, key, value) {
      obj['pe'] = 'lnk_' + value;
    },
    linkURL: 'pev1',
    pageName: 'pageName',
    pageType: 'pageType',
    pageURL: function(obj, key, value) {
      obj['g'] = value.substr(0, 255);
      if (value.length > 255) {
        obj['-g'] = value.substring(255);
      }
    },
    plugins: 'p',
    products: 'products',
    prop: function(obj, key, value) {
      obj['c' + key.substr(4)] = value;
    },
    purchaseID: 'purchaseID',
    referrer: 'r',
    resolution: 's',
    server: 'server',
    state: 'state',
    timestamp: 'ts',
    transactionID: 'xact',
    visitorID: 'vid',
    marketingCloudVisitorID: 'mid',
    zip: 'zip'
  },
  translateToQueryStringParam: function(queryStringObj, key, value) {
    var translator = this.queryStringParamMap[key];

    if (!translator) {
      // Things like prop1 and prop2 use the same translator. Also, eVar1 and eVar2.
      var prefix = key.substr(0, 4);
      translator = this.queryStringParamMap[prefix];
    }

    if (translator) {
      if (typeof translator === 'string') {
        queryStringObj[translator] = value;
      } else {
        translator(queryStringObj, key, value);
      }
    }
  },
  remodelDataToQueryString: function(data) {
    var queryStringParams = {};
    var key;

    queryStringParams.t = this.getTimestamp();

    var clientInfo = data.clientInfo;

    if (clientInfo) {
      for (key in clientInfo) {
        if (clientInfo.hasOwnProperty(key)) {
          var clientInfoValue = clientInfo[key];
          if (clientInfoValue) {
            this.translateToQueryStringParam(queryStringParams, key, clientInfoValue);
          }
        }
      }
    }

    var vars = data.vars;

    if (vars) {
      for (key in vars) {
        if (vars.hasOwnProperty(key)) {
          var varValue = vars[key];
          if (varValue) {
            this.translateToQueryStringParam(queryStringParams, key, varValue);
          }
        }
      }
    }

    var events = data.events;

    if (events) {
      this.translateToQueryStringParam(queryStringParams, 'events', events);
    }

    return SL.encodeObjectToURI(queryStringParams);
  },
  getTrackingURI: function(queryString) {
    var tagContainerMarker = 'D' + SL.appVersion;
    var cacheBuster = "s" + Math.floor(new Date().getTime() / 10800000) % 10 +
        Math.floor(Math.random() * 10000000000000);
    var protocol = SL.isHttps() ? 'https://' : 'http://';
    var uri = protocol + this.getTrackingServer() + '/b/ss/' + this.extensionSettings.account +
        '/1/JS-1.4.3-' + tagContainerMarker + '/' + cacheBuster;

    if (queryString) {
      if (queryString[0] !== '?') {
        uri += '?';
      }

      uri += queryString;
    }

    return uri;
  },
  getTimestamp: function() {
    var now = new Date();
    var year = now.getYear();
    return now.getDate() + '/'
        + now.getMonth() + '/'
        + (year < 1900 ? year + 1900 : year) + ' '
        + now.getHours() + ':'
        + now.getMinutes() + ':'
        + now.getSeconds() + ' '
        + now.getDay() + ' '
        + now.getTimezoneOffset();
  },
  getTrackingServer: function() {
    // TODO: Use getAccount from tool since it deals with accountByHost? What is accountByHost anyway?
    // TODO: What do we do if account is not default. Returning null is probably not awesome.
    if (this.extensionSettings.trackingServer) {
      return this.extensionSettings.trackingServer;
    }

    var account = this.extensionSettings.account;

    if (!account) {
      return null
    }

    // based on code in AppMeasurement.
    var c = ''
    var dataCenter = this.extensionSettings.trackVars.dc || 'd1'
    var e
    var f
    e = account.indexOf(",")
    e >= 0 && (account = account.gb(0, e))
    account = account.replace(/[^A-Za-z0-9]/g, "")
    c || (c = "2o7.net")
    c == "2o7.net" && (dataCenter == "d1" ? dataCenter = "112" : dataCenter == "d2" && (dataCenter = "122"), f = "")
    e = account + "." + dataCenter + "." + f + c
    return e
  },
  trackPageView: function(actionSettings) {
    var trackVars = {};
    _satellite.utils.extend(trackVars, this.extensionSettings.trackVars);
    _satellite.utils.extend(trackVars, actionSettings.trackVars);

    // Referrer is intentionally only tracked on the first page view beacon.
    if (this.initialPageViewTracked) {
      delete this.referrer;
    }

    this.initialPageViewTracked = true;

    if (actionSettings.customSetup) {
      // TODO: Do we need to send the originating event into the custom setup function?
      actionSettings.customSetup();
    }

    this.track(trackVars, actionSettings.trackEvents);
  },
  doesExtensionVarApplyToLinkTracking: function(varName){
    return !/^(eVar[0-9]+)|(prop[0-9]+)|(hier[0-9]+)|campaign|purchaseID|channel|server|state|zip|pageType$/.test(varName);
  },
  trackLink: function(actionSettings) {
    var trackVars = {};

    for (var varName in this.extensionSettings.trackVars) {
      if (this.doesExtensionVarApplyToLinkTracking(varName)) {
        trackVars[varName] = this.extensionSettings.trackVars[varName];
      }
    }

    _satellite.utils.extend(trackVars, actionSettings.trackVars);

    // Referrer is never sent for link tracking.
    delete trackVars.referrer;

    if (actionSettings.customSetup) {
      // TODO: Do we need to send the originating event into the custom setup function?
      actionSettings.customSetup();
    }

    this.track(trackVars, actionSettings.trackEvents);
  },
  track: function(trackVars, trackEvents) {
    var queryString = this.remodelDataToQueryString({
      vars: trackVars,
      events: trackEvents,
      clientInfo: _satellite.data.clientInfo
    });

    var uri = this.getTrackingURI(queryString);

    SL.createBeacon({
      beaconURL: uri,
      type: 'image'
    });

    recordDTMUrl(uri);
  }
});

module.exports = AdobeAnalyticsExtension;
