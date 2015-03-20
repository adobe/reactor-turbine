window.frameworkEnabled = true;

var getBrowserWidth = function() {
  return window.innerWidth ? window.innerWidth : document.documentElement.offsetWidth;
};

var getBrowserHeight = function() {
  return window.innerHeight ? window.innerHeight : document.documentElement.offsetHeight;
};

var getResolution = function() {
  return window.screen.width + "x" + window.screen.height;
};

var getColorDepth = function() {
  return window.screen.pixelDepth ? window.screen.pixelDepth : window.screen.colorDepth;
};

var getJSVersion = function() {
  var
      tm = new Date,
      a,o,i,
      j = '1.2',
      pn = 0;

  if (tm.setUTCDate) {
    j = '1.3';
    if (pn.toPrecision) {
      j = '1.5';
      a = [];
      if (a.forEach) {
        j = '1.6';
        i = 0;
        o = {};
        try {
          i=new Iterator(o);
          if (i.next) {
            j = '1.7';
            if (a.reduce) {
              j = '1.8';
              if (j.trim) {
                j = '1.8.1';
                if (Date.parse) {
                  j = '1.8.2';
                  if (Object.create) {
                    j = '1.8.5';
                  }
                }
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  return j;
};

var getIsJavaEnabled = function() {
  return navigator.javaEnabled() ? 'Y' : 'N';
};

var getIsCookiesEnabled = function() {
  return window.navigator.cookieEnabled ? 'Y' : 'N';
};

// TODO: Can we get rid of this?
var getConnectionType = function() {
  try {
    document.body.addBehavior('#default#clientCaps');
    return document.body.connectionType;
  } catch (e) {}
};

// TODO: Can we get rid of this?
var getIsHomePage = function() {
  try {
    document.body.addBehavior('#default#homePage');
    var isHomePage = document.body.isHomePage;
    return isHomePage ? isHomePage(getTopFrameSet().location) : 'N';
  } catch (e) {}
};

// TODO: Can we get rid of this?
var getTopFrameSet = function() {
  // Get the top frame set
  var
      topFrameSet = window,
      parent,
      location;
  try {
    parent = topFrameSet.parent;
    location = topFrameSet.location;
    while ((parent) &&
    (parent.location) &&
    (location) &&
    ('' + parent.location != '' + location) &&
    (topFrameSet.location) &&
    ('' + parent.location != '' + topFrameSet.location) &&
    (parent.location.host == location.host)) {
      topFrameSet = parent;
      parent = topFrameSet.parent;
    }
  } catch (e) {}

  return topFrameSet;
};

var getClientInfo = function() {
  return {
    browserHeight: getBrowserHeight(),
    browserWidth: getBrowserWidth(),
    resolution: getResolution(),
    colorDepth: getColorDepth(),
    javaScriptVersion: getJSVersion(),
    javaEnabled: getIsJavaEnabled(),
    cookiesEnabled: getIsCookiesEnabled(),
    connectionType: getConnectionType(),
    homePage: getIsHomePage()
  };
};

var SL = _satellite;

_satellite.stringify = function(obj, seenValues) {
    if(JSON && JSON.stringify){
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
            data.push('"'+ prop + '":' + SL.stringify(obj[prop], seenValues));
        }
        return '{' + data.join(',') + '}';
    } else {
        return String(obj);
    }
};



_satellite.createBeacon =  function (config, successCallback, failCallback) {
    /*
    config = {
        type: 'image','ajax'
        beaconURL: string
        beaconData: json (framework) || string
    }
    */
    var connection,
        request = config.beaconURL;

    // GET using an Image
    if (config.type === 'image') {
        if(config.beaconData){
            request += '?' + SL.encodeObjectToURI(config.beaconData);
        }
        if (SL.browserInfo.browser === 'IE') {
            request = request.substring(0, 2047);
        }
        connection = new Image;
        connection.alt = "";
    }

    // Default POST via ajax
    connection = connection ? connection : new XMLHttpRequest;


    connection.success = function() {
        successCallback ? successCallback(connection) : '';
    };

    connection.onload = connection.src ? connection.success: undefined;


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

    if(config.type === 'ajax'){
        connection.open('POST', request, true);
        connection.send(_satellite.stringify(config.beaconData));
    } else if(config.type === 'image'){
        connection.src = request;
    }

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
      cookiesEnabled: 'k',
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
  homePage: 'hp',
      javaEnabled: 'v',
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

  var clientInfo = data.clientInfo;

  if (clientInfo) {
    for (key in clientInfo) {
      if (clientInfo.hasOwnProperty(key)) {
        var clientInfoValue = clientInfo[key];
        if (clientInfoValue) {
          translate(key, clientInfoValue);
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
      clientInfo: getClientInfo()
    });

    var uri = this.getTrackingURI(queryString);

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
    clientInfo: getClientInfo()
  });

  var uri = this.getTrackingURI(queryString);

  recordDTMUrl(uri);
  // TODO: Support custom setup code.
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
    clientInfo: getClientInfo()
  });

  var uri = this.getTrackingURI(queryString);

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




// s.sendRequest = function(request) {
//     var
//         connection,
//         method,
//         parent;
//
//     // POST - Only if a Visitor ID is present and the URL is too long
//     if ((s._hasVisitorID()) && (request.length > 2047)) {
//         if (typeof(XMLHttpRequest) != "undefined") {
//             connection = new XMLHttpRequest;
//             if ("withCredentials" in connection) {
//                 method = 1;
//             } else {
//                 connection = 0;
//             }
//         }
//         if ((!connection) && (typeof(XDomainRequest) != "undefined")) {
//             connection = new XDomainRequest;
//             method = 2;
//         }
//         if ((connection) && (s.AudienceManagement) && (s.AudienceManagement.isReady())) {
//             if (s._jsonSupported) {
//                 connection.audienceManagementCallbackNeeded = true;
//             } else {
//                 connection = 0;
//             }
//         }
//     }
//
//     // If not using POST and in IE we have to trim the request down
//     if ((!connection) && (s.isIE)) {
//         request = request.substring(0, 2047);
//     }
//
//     // JSONP
//     if ((!connection) && (s.d.createElement) &&
//         (s.AudienceManagement) && (s.AudienceManagement.isReady())) {
//         connection = s.d.createElement("SCRIPT");
//         if ((connection) && ("async" in connection)) {
//             parent = s.d.getElementsByTagName("HEAD");
//             if ((parent) && (parent[0])) {
//                 parent = parent[0];
//             } else {
//                 parent = s.d.body;
//             }
//             if (parent) {
//                 connection.type = "text/javascript";
//                 connection.setAttribute("async", "async");
//                 method = 3;
//             } else {
//                 connection = 0;
//             }
//         }
//     }
//
//     // Image
//     if (!connection) {
//         connection = new Image;
//         connection.alt = "";
//     }
//
//     connection.cleanup = function() {
//         var e;
//         try {
//             if (s.requestTimeout) {
//                 clearTimeout(s.requestTimeout);
//                 s.requestTimeout = 0;
//             }
//             if (connection.timeout) {
//                 clearTimeout(connection.timeout);
//                 connection.timeout = 0;
//             }
//         } catch (e) {}
//     };
//
//     connection.onload = connection.success = function() {
//         connection.cleanup();
//         s.deleteOfflineRequestList();
//         s.bodyClickRepropagate();
//         s.handlingRequest = 0;
//         s.handleRequestList();
//
//         if (connection.audienceManagementCallbackNeeded) {
//             connection.audienceManagementCallbackNeeded = false;
//
//             var e;
//             try {
//                 var
//                     audienceManagementData = s._jsonParse(connection.responseText);
//                 AudienceManagement.passData(audienceManagementData);
//             } catch (e) {}
//         }
//     };
//
//     connection.onabort = connection.onerror = connection.failure = function() {
//         connection.cleanup();
//         // Condition to avoid having multiple of the same request put back onto the queue.
//         if (((s.trackOffline) || (s.offline)) && (s.handlingRequest)) {
//             s.requestList.unshift(s.currentRequest);
//         }
//         s.handlingRequest = 0;
//         if (s.lastEnqueuedPacketTimestamp > s.lastOfflineWriteTimestamp) {
//             s.saveOfflineRequestList(s.requestList);
//         }
//         s.bodyClickRepropagate();
//         s.scheduleCallToHandleRequestList(500);
//     };
//     connection.onreadystatechange = function() {
//         if (connection.readyState == 4) {
//             if (connection.status == 200) {
//                 connection.success();
//             } else {
//                 connection.failure();
//             }
//         }
//     };
//
//     s.lastRequestTimestamp = s.getCurrentTimeInMilliseconds();
//
//     if ((method == 1) || (method == 2)) {
//         var
//             dataPos = request.indexOf("?"),
//             uri = request.substring(0, dataPos),
//             data = request.substring((dataPos + 1));
//         data = data.replace(/&callback=[a-zA-Z0-9_.\[\]]+/, "");
//         if (method == 1) {
//             connection.open("POST", uri, true);
//             connection.send(data);
//         } else if (method == 2) {
//             connection.open("POST", uri);
//             connection.send(data);
//         }
//     } else {
//         connection.src = request;
//         if (method == 3) {
//             // If we previously injected a script tag remove the old one
//             if (s.lastConnection) {
//                 try {
//                     parent.removeChild(s.lastConnection);
//                 } catch (e) {}
//             }
//             if (parent.firstChild) {
//                 parent.insertBefore(connection, parent.firstChild);
//             } else {
//                 parent.appendChild(connection);
//             }
//             s.lastConnection = s.currentConnection;
//         }
//     }
//
//     // Only schedule forced request timeouts if the connection supports abort
//     if (connection.abort) {
//         s.requestTimeout = setTimeout(connection.abort, 5000);
//     }
//
//     s.currentRequest = request;
//     s.currentConnection = w['s_i_' + s.replace(s.account, ',', '_')] = connection;
//
//     // Setup timeout for forced link tracking
//     if (((s.useForcedLinkTracking) && (s.bodyClickEvent)) || (s.bodyClickFunction)) {
//         if (!s.forcedLinkTrackingTimeout) {
//             s.forcedLinkTrackingTimeout = 250;
//         }
//         s.bodyClickRepropagateTimer = setTimeout(s.bodyClickRepropagate, s.forcedLinkTrackingTimeout);
//     }
// };
