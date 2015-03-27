window.frameworkEnabled = true;

var SL = _satellite;

_satellite.stringify = function(obj, seenValues) {
  if (JSON && JSON.stringify) {
    return JSON.stringify(obj);
  }
  seenValues = seenValues || [];
  if (SL.isObject(obj)) {
    if (SL.contains(seenValues, obj)) {
      return '<Cycle>';
    } else {
      seenValues.push(obj);
    }
  }

  if (SL.isArray(obj)) {
    return '[' + SL.map(obj, function(value) {
      return SL.stringify(value, seenValues);
    }).join(',') + ']';
  } else if (SL.isString(obj)) {
    return '"' + String(obj) + '"';
  }
  if (SL.isObject(obj)) {
    var data = [];
    for (var prop in obj) {
      data.push('"' + prop + '":' + SL.stringify(obj[prop], seenValues));
    }
    return '{' + data.join(',') + '}';
  } else {
    return String(obj);
  }
};



_satellite.createBeacon = function(config, successCallback, failCallback) {
  /*
  config = {
      type: 'image','ajax','form'
      beaconURL: string
      beaconData: json (framework) || string
  }

  iframe beacons have no way to give a failiure response.
  so it is always a success
  */
  var connection,
    request = config.beaconURL;

  // GET using an Image
  if (config.type === 'image') {
    if (config.beaconData) {
      request += '?' + SL.encodeObjectToURI(config.beaconData);
    }
    if (SL.browserInfo.browser === 'IE') {
      request = request.substring(0, 2047);
    }
    connection = new Image;
    connection.alt = "";
  }

  if (config.type === 'form') {
    this.createBeacon.createIframeBeacon(config.url, _satellite.stringify(config.beaconData), successCallback);
  }

  // Default POST via ajax
  connection = connection ? connection : new XMLHttpRequest;


  connection.success = function() {
    successCallback ? successCallback(connection) : '';
  };

  connection.onload = connection.src ? connection.success : undefined;


  connection.onabort = connection.onerror = connection.failure = function() {
    console.log('beacon failed');
    failCallback ? failCallback(connection) : '';
  };
  connection.onreadystatechange = function() {
    if (connection.readyState === 4) {
      if (connection.status === 200) {
        connection.success();
      } else {
        connection.failure();
      }
    }
  };

  if (config.type === 'ajax') {
    connection.open('POST', request, true);
    connection.send(_satellite.stringify(config.beaconData));
  } else if (config.type === 'image') {
    connection.src = request;
  }

};

_satellite.createBeacon.getBeaconIframesContainer = function() {
  if (this.containerIframe) {
    return this.containerIframe;
  }
  this.containerIframe = document.createElement('iframe');
  this.containerIframe.style.display = 'none';
  document.body.appendChild(this.containerIframe);
  return this.containerIframe;
};

_satellite.createBeacon.createIframeBeacon = function(url, data, callback) {
  var childFrame = document.createElement('iframe');
  var form = document.createElement('form');
  var input = document.createElement('input');
  input.name = 'data';
  input.value = data;
  form.action = url;
  form.method = 'POST';

  form.appendChild(input);
  this.getBeaconIframesContainer().contentDocument.body.appendChild(childFrame);
  childFrame.contentDocument.body.appendChild(form);

  childFrame.onload = function() {
    childFrame.remove();
    if (callback) {
      callback();
    }
  };
  form.submit();
};


_satellite.availableTools.sc.prototype.getTimestamp = function() {
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
};

_satellite.availableTools.sc.prototype.queryStringParamMap = {
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
};

_satellite.availableTools.sc.prototype.remodelDataToQueryString = function(data) {
  var result = {};
  var key;

  result.t = this.getTimestamp();

  var queryStringParamMap = this.queryStringParamMap;
  var translate = function(key, value) {
    var translator = queryStringParamMap[key];

    if (!translator) {
      var prefix = key.substr(0, 4);
      translator = queryStringParamMap[prefix];
    }

    if (translator) {
      if (typeof translator === 'string') {
        result[translator] = value;
      } else {
        translator(result, key, value);
      }
    }
  };

  var browserInfo = data.browserInfo;

  if (browserInfo) {
    for (key in browserInfo) {
      if (browserInfo.hasOwnProperty(key)) {
        var browserInfoValue = browserInfo[key];
        if (browserInfoValue) {
          translate(key, browserInfoValue);
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
          translate(key, varValue);
        }
      }
    }
  }

  var events = data.events;

  if (events) {
    translate('events', events);
  }

  result = SL.encodeObjectToURI(result);
  return result;
};

_satellite.availableTools.sc.prototype.sendBeacon = function() {
  if (window.frameworkEnabled) {
    var queryString = this.remodelDataToQueryString({
      vars: this.varBindings,
      events: this.events,
      browserInfo: {
        browserHeight: SL.browserInfo.getBrowserHeight(),
        browserWidth: SL.browserInfo.getBrowserWidth(),
        resolution: SL.browserInfo.resolution,
        colorDepth: SL.browserInfo.colorDepth,
        javaScriptVersion: SL.browserInfo.jsVersion,
        javaEnabled: SL.browserInfo.isJavaEnabled,
        cookiesEnabled: SL.browserInfo.isCookiesEnabled,
        connectionType: SL.connectionType,
        homePage: SL.isHomePage
      }
    });

    var uri = this.getTrackingURI(queryString);
    SL.createBeacon({
      beaconURL: uri,
      type: 'image'
    });

    recordDTMUrl(uri);
  } else {
    var s = this.getS(window[this.settings.renameS || 's'])
    if (!s){
      SL.notify('Adobe Analytics: page code not loaded', 1)
      return
    }
    if (this.settings.customInit){
      if (this.settings.customInit(s) === false){
        SL.notify("Adobe Analytics: custom init suppressed beacon", 1)
        return
      }
    }

    if (this.settings.executeCustomPageCodeFirst) {
      this.applyVarBindingsOnTracker(s, this.varBindings)
    }
    this.executeCustomSetupFuns(s)

    s.t()
    this.clearVarBindings()
    this.clearCustomSetup()
    SL.notify("Adobe Analytics: tracked page view", 1)
  }
};

_satellite.availableTools.sc.prototype.$trackLink = function(elm, evt, params) {
  params = params || {}
  var type = params.type
  var linkName = params.linkName
  if (!linkName &&
      elm &&
      elm.nodeName &&
      elm.nodeName.toLowerCase() === 'a'){
    linkName = elm.innerHTML
  }
  if (!linkName){
    linkName = 'link clicked'
  }
  var vars = params && params.setVars
  var events = (params && params.addEvent) || []

  if (window.frameworkEnabled) {
    this.trackLinkUsingFramework(vars, events, linkName, type);
  } else {
    var s = this.getS(null, {
      setVars: vars,
      addEvent: events
    })

    if (!s){
      SL.notify('Adobe Analytics: page code not loaded', 1)
      return
    }

    var orgLinkTrackVars = s.linkTrackVars
    var orgLinkTrackEvents = s.linkTrackEvents
    var definedVarNames = this.definedVarNames(vars)

    if (params && params.customSetup){
      params.customSetup.call(elm, evt, s)
    }

    if (events.length > 0)
      definedVarNames.push('events')
    if (s.products)
      definedVarNames.push('products')

    // add back the vars from s
    definedVarNames = this.mergeTrackLinkVars(s.linkTrackVars, definedVarNames)

    // add back events from s
    events = this.mergeTrackLinkVars(s.linkTrackEvents, events)

    s.linkTrackVars = this.getCustomLinkVarsList(definedVarNames)

    var eventsKeys = SL.map(events, function(item) {
      return item.split(':')[0]
    });
    s.linkTrackEvents = this.getCustomLinkVarsList(eventsKeys)

    s.tl(true, type || 'o', linkName)
    SL.notify([
      'Adobe Analytics: tracked link ',
      'using: linkTrackVars=',
      SL.stringify(s.linkTrackVars),
      '; linkTrackEvents=',
      SL.stringify(s.linkTrackEvents)
    ].join(''), 1)

    s.linkTrackVars = orgLinkTrackVars
    s.linkTrackEvents = orgLinkTrackEvents
  }
};

_satellite.availableTools.sc.prototype.trackLinkUsingFramework = function(vars, events, linkName, linkType) {
  var mergedVars = {};

  // Copy variables from tool except those that should only come from the rule ("defined var names")
  var varBindingsDefinedVars = this.definedVarNames(this.varBindings);

  for (var key in this.varBindings) {
    if (varBindingsDefinedVars.indexOf(key) === -1) {
      mergedVars[key] = this.varBindings[key];
    }
  }

  // Copy vars from rule.
  SL.extend(mergedVars, vars);

  // Add in specific link info.
  mergedVars.linkName = linkName;
  mergedVars.linkType = linkType || 'o';

  // Referrer is never sent for link tracking.
  delete mergedVars['referrer'];

  var queryString = this.remodelDataToQueryString({
    vars: mergedVars,
    events: events,
    browserInfo: {
      browserHeight: SL.browserInfo.getBrowserHeight(),
      browserWidth: SL.browserInfo.getBrowserWidth(),
      resolution: SL.browserInfo.resolution,
      colorDepth: SL.browserInfo.colorDepth,
      javaScriptVersion: SL.browserInfo.jsVersion,
      javaEnabled: SL.browserInfo.isJavaEnabled,
      cookiesEnabled: SL.browserInfo.isCookiesEnabled,
      connectionType: SL.connectionType,
      homePage: SL.isHomePage
    }
  });

  var uri = this.getTrackingURI(queryString);

  SL.createBeacon({
    beaconURL: uri,
    type: 'image'
  });

  recordDTMUrl(uri);
  // TODO: Support custom setup code. Custom setup code will no longer have access to an "s" object though.
};

_satellite.availableTools.sc.prototype.trackPageViewUsingFramework = function(vars, events) {
  var mergedVars = {};
  SL.extend(mergedVars, this.varBindings);
  SL.extend(mergedVars, vars);

  // Referrer is never sent for page view tracking. Tracking referrer on the initial page load
  // is handled in sendBeacon().
  delete mergedVars.referrer;

  var queryString = this.remodelDataToQueryString({
    vars: mergedVars,
    events: events,
    browserInfo: {
      browserHeight: SL.browserInfo.getBrowserHeight(),
      browserWidth: SL.browserInfo.getBrowserWidth(),
      resolution: SL.browserInfo.resolution,
      colorDepth: SL.browserInfo.colorDepth,
      javaScriptVersion: SL.browserInfo.jsVersion,
      javaEnabled: SL.browserInfo.isJavaEnabled,
      cookiesEnabled: SL.browserInfo.isCookiesEnabled,
      connectionType: SL.connectionType,
      homePage: SL.isHomePage
    }
  });

  var uri = this.getTrackingURI(queryString);

  SL.createBeacon({
    beaconURL: uri,
    type: 'image'
  });

  recordDTMUrl(uri);
};

_satellite.availableTools.sc.prototype.$trackPageView = function(elm, evt, params){
  var vars = params && params.setVars
  var events = (params && params.addEvent) || []

  if (window.frameworkEnabled) {
    this.trackPageViewUsingFramework(vars, events);
  } else {
    var s = this.getS(null, {
      setVars: vars,
      addEvent: events
    })

    if (!s){
      SL.notify('Adobe Analytics: page code not loaded', 1)
      return
    }
    s.linkTrackVars = ''
    s.linkTrackEvents = ''
    this.executeCustomSetupFuns(s)
    if (params && params.customSetup){
      params.customSetup.call(elm, evt, s)
    }
    s.t()
    this.clearVarBindings()
    this.clearCustomSetup()
    SL.notify("Adobe Analytics: tracked page view", 1)
  }
},

_satellite.availableTools.sc.prototype.getTrackingURI = function(queryString) {
  var tagContainerMarker = 'D' + SL.appVersion;
  var cacheBuster = "s" + Math.floor(new Date().getTime() / 10800000) % 10 +
      Math.floor(Math.random() * 10000000000000);
  var protocol = SL.isHttps() ? 'https://' : 'http://';
  var uri = protocol + this.getTrackingServer() + '/b/ss/' + this.settings.account + '/1/JS-1.4.3-' +
      tagContainerMarker + '/' + cacheBuster;

  if (queryString) {
    if (queryString[0] !== '?') {
      uri += '?';
    }

    uri += queryString;
  }

  return uri;
};
