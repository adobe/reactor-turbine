/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2012 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

/** @license ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============

 AppMeasurement for JavaScript version: 1.4.3
 Copyright 1996-2013 Adobe, Inc. All Rights Reserved
 More info available at http://www.omniture.com
 */

/*********************************************************************
 * Class AppMeasurement(): Track for tracking
 *
 * @constructor
 * @noalias
 *********************************************************************/
function AppMeasurement() {
  /**
   * @type {AppMeasurement}
   * @noalias
   */
  var s = this;

  s.version = "1.4.3";

  /**
   * @type {!Window}
   * @noalias
   */
  var w = window;
  if (!w.s_c_in) {
    w.s_c_il = [];
    w.s_c_in = 0;
  }
  s._il = w.s_c_il;
  s._in = w.s_c_in;
  s._il[s._in] = s;
  w.s_c_in++;
  s._c="s_c";

  // This and the use of Null below is a hack to keep Google Closure Compiler from creating a global variable for null
  var Null = w.Null;
  if (!Null) {
    Null = null;
  }

  // Get the top frame set
  var
      topFrameSet = w,
      parent,
      location,
      e;
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

  /*********************************************************************
   * Function logDebug(message): Log debug message
   *     message = Debug message
   * Returns:
   *     Nothing
   *********************************************************************/
  s.logDebug = function(message) {
    var e;
    try {
      console.log(message);
    } catch(e) {}
  };

  /*********************************************************************
   * Function isNumber(x): Is string a number?
   *     x = String/number to check
   * Returns:
   *     True if number, false if not
   *********************************************************************/
  s.isNumber = function(x) {
    return ('' + parseInt(x) == '' + x);
  };

  /*********************************************************************
   * Function replace(x,o,n): String replace
   *     x = Source string
   *     o = String to match
   *     n = String to replaces all matches with
   * Returns:
   *     x with all o's replaced with n's
   *********************************************************************/
  s.replace = function(x,o,n) {
    if ((!x) || (x.indexOf(o) < 0)) {
      return x;
    }
    return x.split(o).join(n);
  };

  /*********************************************************************
   * Function escape(x): String URL-encode (sometimes '+' is not URL
   *                     encoded)
   *     x = String to URL-encode
   * Returns:
   *     URL-encoded [x]
   *********************************************************************/
  s.escape = function(x) {
    var
        y,
        fix = "+~!*()'",
        fixPos,
        fixChar;
    if (!x) {
      return x;
    }
    y = encodeURIComponent(x);
    for (fixPos = 0;fixPos < fix.length;fixPos++) {
      fixChar = fix.substring(fixPos,(fixPos + 1));
      if (y.indexOf(fixChar) >= 0) {
        y = s.replace(y,fixChar,"%" + fixChar.charCodeAt(0).toString(16).toUpperCase());
      }
    }
    return y;
  };

  /*********************************************************************
   * Function unescape(x): String URL-decode (sometimes '+' is not URL
   *                       decoded)
   *     x = String to URL-decode
   * Returns:
   *     URL-decoded [x]
   *********************************************************************/
  s.unescape = function(x) {
    var
        y,
        e;
    if (!x) {
      return x;
    }
    y = (x.indexOf('+') >= 0 ? s.replace(x,'+',' ') : x);
    try {
      return decodeURIComponent(y);
    } catch (e) {}
    return unescape(y);
  };

  /*********************************************************************
   * Function getCookieDomain(): Generate and return domain to use for setting cookies
   *     Nothing
   * Returns:
   *     Domain to use for setting cookies
   *********************************************************************/
  s.getCookieDomain = function() {
    var
        d = w.location.hostname,
        n = s.fpCookieDomainPeriods,
        p;
    if (!n) {
      n = s.cookieDomainPeriods;
    }
    if ((d) && (!s.cookieDomain) && (!(/^[0-9.]+$/).test(d))) {
      n = (n ? parseInt(n) : 2);
      n = (n > 2? n : 2);
      p = d.lastIndexOf('.');
      if (p >= 0) {
        while ((p >= 0) && (n > 1)) {
          p = d.lastIndexOf('.',p - 1);
          n--;
        }
        s.cookieDomain = (p > 0 ? d.substring(p) : d);
      }
    }
    return s.cookieDomain;
  };

  /*********************************************************************
   * Function cookieRead(k): Read, URL-decode, and return value of k in cookies
   *     k = key to read value for out of cookies
   * Returns:
   *     Value of k in cookies if found, blank if not
   *********************************************************************/
  s.c_r = s.cookieRead = function(k) {
    k = s.escape(k);
    var
        c = ' ' + s.d.cookie,
        i = c.indexOf(' ' + k + '='),
        e = (i < 0 ? i : c.indexOf(';',i)),
        v = (i < 0 ? '' : s.unescape(c.substring((i + 2 + k.length),(e < 0 ? c.length : e))));
    return (v != '[[B]]' ? v : '');
  };

  /*********************************************************************
   * Function cookieWrite(k,v,e): Write value v as key k in cookies with
   *                              optional expiration e and domain automaticly
   *                              generated by getCookieDomain()
   *     k = key to write value for in cookies
   *     v = value to write to cookies
   *     e = optional expiration Date object or 1 to use default expiration
   * Returns:
   *     True if value was successfuly written and false if it was not
   *********************************************************************/
  s.c_w = s.cookieWrite = function(k,v,e) {
    var
        d = s.getCookieDomain(),
        l = s.cookieLifetime,
        t;
    v = '' + v;
    l = (l ? ('' + l).toUpperCase() : '');
    if ((e) && (l != 'SESSION') && (l != 'NONE')) {
      t = (v != '' ? parseInt(l ? l : 0) : -60);
      if (t) {
        e = new Date;
        e.setTime(e.getTime() + (t * 1000));
      } else if (e == 1) {
        e = new Date;
        var y = e.getYear();
        e.setYear( y + 5 + (y < 1900 ? 1900 : 0));
      }
    }
    if ((k) && (l != 'NONE')) {
      s.d.cookie = k + '=' + s.escape(v != ''? v : '[[B]]' ) + '; path=/;'
      + ((e) && (l != 'SESSION') ? ' expires=' + e.toGMTString() + ';' : '')
      + (d ? ' domain=' + d + ';' : '');
      return (s.cookieRead(k) == v);
    }
    return 0;
  };

  /*********************************************************************
   * Function delayCall(methodName,args,onlyPrerender): Delay a call to a method if needed
   *     methodName    = Name of method called
   *     args          = Arguments to method call
   *     onlyPrerender = Optionally only delay due to prerender
   * Returns:
   *     1 if a delay is needed or 0 if not
   *********************************************************************/
  s.delayCallQueue = [];
  s.delayCall = function(methodName,args,onlyPrerender) {
    if (s.delayCallDisabled)
      return 0;

    if (!s.maxDelay) {
      s.maxDelay = 250;
    }

    var
        delayNeeded = 0,
        tm = new Date,
        timeout = tm.getTime() + s.maxDelay,
        visibilityState = s.d.visibilityState,
        visibilityStateEventList = ["webkitvisibilitychange","visibilitychange"],
        visibilityStateEventNum;

    if (!visibilityState) {
      visibilityState = s.d.webkitVisibilityState;
    }
    if ((visibilityState) && (visibilityState == 'prerender')) {
      if (!s.delayCallPrerender) {
        s.delayCallPrerender = 1;
        for (visibilityStateEventNum = 0;visibilityStateEventNum < visibilityStateEventList.length;visibilityStateEventNum++) {
          s.d.addEventListener(visibilityStateEventList[visibilityStateEventNum],function() {
            var
                visibilityState = s.d.visibilityState;
            if (!visibilityState) {
              visibilityState = s.d.webkitVisibilityState;
            }
            if (visibilityState == 'visible') {
              s.delayCallPrerender = 0;
              s['delayReady']();
            }
          });
        }
      }
      delayNeeded = 1;
      timeout = 0;
    } else if (!onlyPrerender) {
      if (s.callModuleMethod("_d")) {
        delayNeeded = 1;
      }
    }

    if (delayNeeded) {
      s.delayCallQueue.push({
        'm':methodName,
        'a':args,
        't':timeout
      });
      if (!s.delayCallPrerender) {
        setTimeout(s['delayReady'],s.maxDelay);
      }
    }

    return delayNeeded;
  };

  /*********************************************************************
   * Function delayReady(): Handle the possible end of the delay
   *     Nothing
   * Returns:
   *     Nothing
   *********************************************************************/
  s['delayReady'] = function() {
    var
        tm = new Date,
        now = tm.getTime(),
        delayNeeded = 0,
        entry;
    if (s.callModuleMethod("_d")) {
      delayNeeded = 1;
    } else {
      // s.delayReady is already called by the Integrate module when a module is ready so we're pigybacking on that to update the modules ready state
      s._modulesReadyCallback();
    }
    while (s.delayCallQueue.length > 0) {
      entry = s.delayCallQueue.shift();
      if ((delayNeeded) && (!entry['t']) && (entry['t'] > now)) {
        s.delayCallQueue.unshift(entry);
        setTimeout(s['delayReady'],parseInt(s.maxDelay / 2));
        return;
      }
      s.delayCallDisabled = 1;
      s[entry['m']].apply(s,entry['a']);
      s.delayCallDisabled = 0;
    }
  };

  /*********************************************************************
   * Function setAccount(account): Change the account for this instance but still keep track of the account history for this instance
   *     account = New account
   * Returns:
   *     Nothing
   *********************************************************************/
  s.setAccount = s.sa = function(account) {
    var
        accountList,
        accountNum;

    // Handle any delay that's needed
    if (s.delayCall('setAccount',arguments)) {
      return;
    }

    s.account = account;
    if (!s.allAccounts) {
      s.allAccounts = account.split(",");
    } else {
      accountList = s.allAccounts.concat(account.split(","));
      s.allAccounts = [];
      accountList.sort();
      for (accountNum = 0;accountNum < accountList.length;accountNum++) {
        if ((accountNum == 0) || (accountList[(accountNum - 1)] != accountList[accountNum])) {
          s.allAccounts.push(accountList[accountNum]);
        }
      }
    }
  };

  /*********************************************************************
   * Function foreachVar(varHandler,trackVars): Interate over all variables filtered based on the current state and hand them to the passd in handler function
   *     varHandler = Variable handler function:
   *                  function(varKey,varValue) {
	*                       ...
	*                  }
   *     trackVars  = Option string containing an additional filter for variables
   * Returns:
   *     Nothing
   *********************************************************************/
  s.foreachVar = function(varHandler,trackVars) {
    var
        varList,
        varNum,
        varKey,
        varValue,
        varFilter = "",
        eventFilter = "",
        moduleName = "";

    // Setup list
    if (s.lightProfileID) {
      varList = s.lightVarList;
      varFilter = s.lightTrackVars;
      if (varFilter) {
        varFilter = "," + varFilter + "," + s.lightRequiredVarList.join(",") + ",";
      }
    } else {
      varList = s.accountVarList;

      // Setup filters
      if ((s.pe) || (s.linkType)) {
        varFilter   = s.linkTrackVars;
        eventFilter = s.linkTrackEvents;
        if (s.pe) {
          moduleName = s.pe.substring(0,1).toUpperCase() + s.pe.substring(1);
          if (s[moduleName]) {
            varFilter   = s[moduleName].trackVars;
            eventFilter = s[moduleName].trackEvents;
          }
        }
      }
      if (varFilter) {
        varFilter = "," + varFilter + "," + s.requiredVarList.join(",") + ",";
      }
      if (eventFilter) {
        eventFilter = "," + eventFilter + ",";
        if (varFilter) {
          varFilter += ",events,";
        }
      }
    }

    if (trackVars) {
      trackVars = "," + trackVars + ",";
    }

    for (varNum = 0;varNum < varList.length;varNum++) {
      varKey   = varList[varNum];
      varValue = s[varKey];

      // If we have a value and this variable is not filtered out
      if ((varValue) &&
          ((!varFilter) || (varFilter.indexOf("," + varKey + ",") >= 0)) &&
          ((!trackVars) || (trackVars.indexOf("," + varKey + ",") >= 0))) {
        varHandler(varKey,varValue);
      }
    }
  };

  /*********************************************************************
   * Function serializeToQueryString(varKey,varValue,varFilter,varFilterPrefix,filter): Serialize an object to a query-string structure
   *     varKey          = Name of the object
   *     varValue        = The object
   *     varFilter       = Filter for variables
   *     varFilterPrefix = Filter prefix for variables
   *     filter          = Used internaly for recursive calls to group structure members
   * Returns:
   *     Serialized object or empty string if nothing to serialize
   *********************************************************************/
  s.serializeToQueryString = function(varKey,varValue,varFilter,varFilterPrefix,filter) {
    var
        queryString = "",
        subVarKey,
        subVarValue,
        subVarPrefix,
        subVarSuffix,
        nestedKeyEnd,
        nestedKey,
        nestedFilter,
        nestedFilterList = 0,
        nestedFilterNum,
        nestedFilterMatch;

    if (varKey == "contextData") {
      varKey = "c";
    }

    if (varValue) {
      for (subVarKey in varValue) {
        if ((!Object.prototype[subVarKey]) &&
            ((!filter) || (subVarKey.substring(0,filter.length) == filter)) &&
            (varValue[subVarKey]) &&
            ((!varFilter) || (varFilter.indexOf("," + (varFilterPrefix ? varFilterPrefix + "." : "") + subVarKey + ",") >= 0))) {
          nestedFilterMatch = false;
          if (nestedFilterList) {
            for (nestedFilterNum = 0;nestedFilterNum < nestedFilterList.length;nestedFilterNum++) {
              if (subVarKey.substring(0,nestedFilterList[nestedFilterNum].length) == nestedFilterList[nestedFilterNum]) {
                nestedFilterMatch = true;
              }
            }
          }
          if (!nestedFilterMatch) {
            if (queryString == "") {
              queryString += "&" + varKey + ".";
            }
            subVarValue = varValue[subVarKey];
            if (filter) {
              subVarKey = subVarKey.substring(filter.length);
            }
            if (subVarKey.length > 0) {
              nestedKeyEnd = subVarKey.indexOf(".");
              if (nestedKeyEnd > 0) {
                nestedKey = subVarKey.substring(0,nestedKeyEnd);
                nestedFilter = (filter ? filter : "") + nestedKey + ".";
                if (!nestedFilterList) {
                  nestedFilterList = [];
                }
                nestedFilterList.push(nestedFilter);
                queryString += s.serializeToQueryString(nestedKey,varValue,varFilter,varFilterPrefix,nestedFilter);
              } else {
                if (typeof(subVarValue) == "boolean") {
                  // Change to string "true" or "false"
                  if (subVarValue) {
                    subVarValue = "true";
                  } else {
                    subVarValue = "false";
                  }
                }
                if (subVarValue) {
                  if ((varFilterPrefix == "retrieveLightData") && (filter.indexOf(".contextData.") < 0)) {
                    subVarPrefix = subVarKey.substring(0,4);
                    subVarSuffix = subVarKey.substring(4);
                    switch (subVarKey) {
                      case "transactionID" : {
                        subVarKey = "xact";
                      } break;
                      case "channel" : {
                        subVarKey = "ch";
                      } break;
                      case "campaign" : {
                        subVarKey = "v0";
                      } break;
                      default : {
                        if (s.isNumber(subVarSuffix)) {
                          if (subVarPrefix == "prop") {
                            subVarKey = "c" + subVarSuffix;
                          } else if (subVarPrefix == "eVar") {
                            subVarKey = "v" + subVarSuffix;
                          } else if (subVarPrefix == "list") {
                            subVarKey = "l" + subVarSuffix;
                          } else if (subVarPrefix == "hier") {
                            subVarKey   = "h" + subVarSuffix;
                            subVarValue = subVarValue.substring(0,255);
                          }
                        }
                      } break;
                    }
                  }
                  queryString += "&" + s.escape(subVarKey) + "=" + s.escape(subVarValue);
                }
              }
            }
          }
        }
      }
      if (queryString != "") {
        queryString += "&." + varKey;
      }
    }

    return queryString;
  };

  /*********************************************************************
   * Function getQueryString(): Build the query-string
   *     Nothing
   * Returns:
   *     Query-String
   *********************************************************************/
  s.getQueryString = function() {
    var
        queryString = "",
        varList,
        varNum,
        varSubNum,
        varKey,
        varValue,
        varValueParts,
        varValuePart,
        varValuePartPos,
        varPrefix,
        varSuffix,
        varFilter = "",
        eventFilter = "",
        moduleName = "",
        events = "",
        products = "";

    // Setup list
    if (s.lightProfileID) {
      varList = s.lightVarList;
      varFilter = s.lightTrackVars;
      if (varFilter) {
        varFilter = "," + varFilter + "," + s.lightRequiredVarList.join(",") + ",";
      }
    } else {
      varList = s.accountVarList;

      // Setup filters
      if ((s.pe) || (s.linkType)) {
        varFilter   = s.linkTrackVars;
        eventFilter = s.linkTrackEvents;
        if (s.pe) {
          moduleName = s.pe.substring(0,1).toUpperCase() + s.pe.substring(1);
          if (s[moduleName]) {
            varFilter   = s[moduleName].trackVars;
            eventFilter = s[moduleName].trackEvents;
          }
        }
      }
      if (varFilter) {
        varFilter = "," + varFilter + "," + s.requiredVarList.join(",") + ",";
      }
      if (eventFilter) {
        eventFilter = "," + eventFilter + ",";
        if (varFilter) {
          varFilter += ",events,";
        }
      }

      // Build product event list to be added to event list
      if (s.events2) {
        events += (events != "" ? "," : "") + s.events2;
      }
    }

    // Add AudienceManagement config params
    if ((s.AudienceManagement) && (s.AudienceManagement.isReady())) {
      queryString += s.serializeToQueryString("d",s.AudienceManagement.getEventCallConfigParams());
    }

    for (varNum = 0;varNum < varList.length;varNum++) {
      varKey    = varList[varNum];
      varValue  = s[varKey];
      varPrefix = varKey.substring(0,4);
      varSuffix = varKey.substring(4);

      if (!varValue) {
        if ((varKey == "events") && (events)) {
          varValue = events;
          events = "";
        }
      }

      // If we have a value and this variable is not filtered out
      if ((varValue) &&
          ((!varFilter) || (varFilter.indexOf("," + varKey + ",") >= 0))) {
        switch (varKey) {
          case "supplementalDataID" : {
            varKey = "sdid";
          } break;
          case "timestamp" : {
            varKey = "ts";
          } break;
          case "dynamicVariablePrefix" : {
            varKey = "D";
          } break;
          case "visitorID" : {
            varKey = "vid";
          } break;
          case "marketingCloudVisitorID" : {
            varKey = "mid";
          } break;
          case "analyticsVisitorID" : {
            varKey = "aid";
          } break;
          case "audienceManagerLocationHint" : {
            varKey = "aamlh";
          } break;
          case "audienceManagerBlob" : {
            varKey = "aamb";
          } break;
          case "authState" : {
            varKey = "as";
          } break;
          case "pageURL" : {
            varKey = "g";
            if (varValue.length > 255) {
              s.pageURLRest = varValue.substring(255);
              varValue = varValue.substring(0,255);
            }
          } break;
          case "pageURLRest" : {
            varKey = "-g";
          } break;
          case "referrer" : {
            varKey = "r";
          } break;
          case "vmk" :
          case "visitorMigrationKey" : {
            varKey = "vmt";
          } break;
          case "visitorMigrationServer" : {
            varKey = "vmf";
            if ((s.ssl) && (s.visitorMigrationServerSecure)) {
              varValue = "";
            }
          } break;
          case "visitorMigrationServerSecure" : {
            varKey = "vmf";
            if ((!s.ssl) && (s.visitorMigrationServer)) {
              varValue = "";
            }
          } break;
          case "charSet" : {
            varKey = "ce";
          } break;
          case "visitorNamespace" : {
            varKey = "ns";
          } break;
          case "cookieDomainPeriods" : {
            varKey = "cdp";
          } break;
          case "cookieLifetime" : {
            varKey = "cl";
          } break;
          case "variableProvider" : {
            varKey = "vvp";
          } break;
          case "currencyCode" : {
            varKey = "cc";
          } break;
          case "channel" : {
            varKey = "ch";
          } break;
          case "transactionID" : {
            varKey = "xact";
          } break;
          case "campaign" : {
            varKey = "v0";
          } break;
          case "latitude" : {
            varKey = "lat";
          } break;
          case "longitude" : {
            varKey = "lon";
          } break;
          case "resolution" : {
            varKey = "s";
          } break;
          case "colorDepth" : {
            varKey = "c";
          } break;
          case "javascriptVersion" : {
            varKey = "j";
          } break;
          case "javaEnabled" : {
            varKey = "v";
          } break;
          case "cookiesEnabled" : {
            varKey = "k";
          } break;
          case "browserWidth" : {
            varKey = "bw";
          } break;
          case "browserHeight" : {
            varKey = "bh";
          } break;
          case "connectionType" : {
            varKey = "ct";
          } break;
          case "homepage" : {
            varKey = "hp";
          } break;
          case "events" : {
            // Add events from eventList
            if (events) {
              varValue += (varValue != "" ? "," : "") + events;
            }

            // Filter events if needed
            if (eventFilter) {
              varValueParts = varValue.split(",");
              varValue = "";
              for (varSubNum = 0;varSubNum < varValueParts.length;varSubNum++) {
                varValuePart = varValueParts[varSubNum];
                varValuePartPos = varValuePart.indexOf("=");
                if (varValuePartPos >= 0) {
                  varValuePart = varValuePart.substring(0,varValuePartPos);
                }
                varValuePartPos = varValuePart.indexOf(":");
                if (varValuePartPos >= 0) {
                  varValuePart = varValuePart.substring(0,varValuePartPos);
                }
                if (eventFilter.indexOf("," + varValuePart + ",") >= 0) {
                  varValue += (varValue ? "," : "") + varValueParts[varSubNum];
                }
              }
            }
          } break;
          case "events2" : {
            varValue = "";
          } break;
          case "contextData" : {
            queryString += s.serializeToQueryString("c",s[varKey],varFilter,varKey);
            varValue = "";
          } break;
          case "lightProfileID" : {
            varKey = "mtp";
          } break;
          case "lightStoreForSeconds" : {
            varKey = "mtss";
            if (!s.lightProfileID) {
              varValue = "";
            }
          } break;
          case "lightIncrementBy" : {
            varKey = "mti";
            if (!s.lightProfileID) {
              varValue = "";
            }
          } break;
          case "retrieveLightProfiles" : {
            varKey = "mtsr";
          } break;
          case "deleteLightProfiles" : {
            varKey = "mtsd";
          } break;
          case "retrieveLightData" : {
            if (s.retrieveLightProfiles) {
              queryString += s.serializeToQueryString("mts",s[varKey],varFilter,varKey);
            }
            varValue = "";
          } break;
          default : {
            if (s.isNumber(varSuffix)) {
              if (varPrefix == "prop") {
                varKey = "c" + varSuffix;
              } else if (varPrefix == "eVar") {
                varKey = "v" + varSuffix;
              } else if (varPrefix == "list") {
                varKey = "l" + varSuffix;
              } else if (varPrefix == "hier") {
                varKey   = "h" + varSuffix;
                varValue = varValue.substring(0,255);
              }
            }
          } break;
        }
        if (varValue) {
          queryString += "&" + varKey + "=" + (varKey.substring(0,3) != "pev" ? s.escape(varValue) : varValue);
        }
      }

      // Add ClickMap query-string after pev# variables (pev3 is the last one) if it's set
      if ((varKey == 'pev3') && (s.clickMapQueryString)) {
        queryString += s.clickMapQueryString;
      }
    }

    return queryString;
  };

  /*********************************************************************
   * Function getObjectType(o): Return object type or tag-name in upper-case
   *     o = object to get type or tage-name for
   * Returns:
   *     type or tag-name in upper-case
   *********************************************************************/
  s.getObjectType = function(o) {
    var
        t = o.tagName;
    if ((('' + o.tagUrn) != 'undefined') || ((('' + o.scopeName) != 'undefined') && (('' + o.scopeName).toUpperCase() != 'HTML'))) {
      return '';
    }
    t = ((t) && (t.toUpperCase) ? t.toUpperCase() : '');
    if (t == 'SHAPE') {
      t = '';
    }
    if (t) {
      if (((t == 'INPUT') || (t == 'BUTTON')) && (o.type) && (o.type.toUpperCase)) {
        t = o.type.toUpperCase();
      } else if ((!t) && (o.href)) {
        t = 'A';
      }
    }
    return t;
  };

  /*********************************************************************
   * Function getObjectHREF(o): Return object href if possible
   *     o = object to get href from
   * Returns:
   *     href
   *********************************************************************/
  s.getObjectHREF = function(o) {
    var
        location = w.location,
        href = (o.href ? o.href : ''),
        i,
        j,
        k,
        protocol;
    i = href.indexOf(':');
    j = href.indexOf('?');
    k = href.indexOf('/');
    if ((href) && ((i < 0) || ((j >= 0) && (i > j)) || ((k >= 0) && (i > k)))) {
      protocol = ((o.protocol) && (o.protocol.length > 1) ? o.protocol : (l.protocol ? l.protocol : ''));
      i = l.pathname.lastIndexOf('/');
      href = (protocol ? protocol + '//' : '') + (o.host ? o.host : (l.host ? l.host:'')) + (h.substring(0,1) != '/' ? l.pathname.substring(0,(i < 0 ? 0 : i)) + '/' : '') + href;
    }
    return href;
  };

  /*********************************************************************
   * Function getObjectID(o): Generate object ID and type and add to passed in object as s_oid and s_oidt
   *     o = object to generate ID for
   * Returns:
   *     Array with generated ID 'id' and ID type 'type'
   *********************************************************************/
  s.getObjectID = function(o) {
    var
        t = s.getObjectType(o),
        p,
        c,
        n = '',
        x = 0;
    if (t) {
      p = o.protocol;
      c = o.onclick;
      if ((o.href) && ((t == 'A') || (t == 'AREA')) && ((!c) || (!p) || (p.toLowerCase().indexOf('javascript') < 0))) {
        n = s.getObjectHREF(o);
      } else if (c) {
        n = s.replace(s.replace(s.replace(s.replace('' + c,"\r",''),"\n",''),"\t",''),' ','');
        x = 2;
      } else if ((t == 'INPUT') || (t=='SUBMIT')) {
        if (o.value) {
          n = o.value;
        } else if (o.innerText) {
          n = o.innerText;
        } else if (o.textContent) {
          n = o.textContent;
        }
        x = 3;
      } else if ((o.src) && (t == 'IMAGE')) {
        n = o.src;
      }
      if (n) {
        return {
          id:n.substring(0,100),
          type:x
        };
      }
    }

    return 0
  };

  /*********************************************************************
   * Function getObjectUsable(o): Get usable object if any out of passed in object
   *     o = object to get usable object from
   * Returns:
   *     Usable object or 0 if none
   *********************************************************************/
  s.getObjectUsable = function(o) {
    var
        objectType = s.getObjectType(o),
        objectID = s.getObjectID(o),
        onClick;
    while ((o) && (!objectID) && (objectType != 'BODY')) {
      o = (o.parentElement ? o.parentElement : o.parentNode);
      if (o) {
        objectType = s.getObjectType(o);
        objectID = s.getObjectID(o);
      }
    }
    if ((!objectID) || (objectType == 'BODY')) {
      o = 0;
    }
    if (o) {
      onClick = (o.onclick ? '' + o.onclick : '');
      if ((onClick.indexOf('.tl(') >= 0) || (onClick.indexOf('.trackLink(') >= 0)) {
        o = 0;
      }
    }
    return o;
  };

  /*********************************************************************
   * Function prepareLinkTracking(): Populate the link-tracking variables including ClickMap
   *     Nothing
   * Returns:
   *     Nothing
   *********************************************************************/
  s.prepareLinkTracking = function() {
    var
        objectType,
        objectID,
        linkObject = s.linkObject,
        linkType   = s.linkType,
        linkURL    = s.linkURL,
        queryStringPos,
        hashPos;

    s.linkTrack = 1; // Start off tracking because this could be a manual call to
    if (!linkObject) {
      s.linkTrack = 0; // If linkObject isn't set at this point we know that it's an automatic call so don't track until we decode that we are good to go later based on linkURL/Name and linkType
      linkObject = s.clickObject;
    }
    if (linkObject) {
      // Make sure we have a clickable object
      objectType = s.getObjectType(linkObject);
      objectID   = s.getObjectID(linkObject);
      while ((linkObject) && (!objectID) && (objectType != 'BODY')) {
        linkObject = (linkObject.parentElement ? linkObject.parentElement : linkObject.parentNode);
        if (linkObject) {
          objectType = s.getObjectType(linkObject);
          objectID = s.getObjectID(linkObject);
        }
      }
      if ((!objectID) || (objectType == 'BODY')) {
        linkObject = 0;
      }
      if (linkObject) {
        var onClick = (linkObject.onclick ? '' + linkObject.onclick : '');
        if ((onClick.indexOf('.tl(') >= 0) || (onClick.indexOf('.trackLink(') >= 0)) {
          linkObject = 0;
        }
      }
    } else {
      s.linkTrack = 1; // If we don't have a passed in link object or one from the body onclick this isn't a link tracking call so we should track
    }

    // Get the link URL
    if ((!linkURL) && (linkObject)) {
      linkURL = s.getObjectHREF(linkObject);
    }
    if ((linkURL) && (!s.linkLeaveQueryString)) {
      queryStringPos = linkURL.indexOf('?');
      if (queryStringPos >= 0) {
        linkURL = linkURL.substring(0,queryStringPos);
      }
    }

    // If we have a link URL but no manually specified type do automatic type determination
    if ((!linkType) && (linkURL)) {
      var
          href,
          filterList,
          filterNum,
          filterMethod = 0,
          matchedFilter = 0,
          match;

      // Check for a download link type
      if ((s.trackDownloadLinks) && (s.linkDownloadFileTypes)) {
        href = linkURL.toLowerCase();
        queryStringPos = href.indexOf('?');
        hashPos = href.indexOf('#');
        /* Truncate at the hash or the start of the query-string */
        if (queryStringPos >= 0) {
          if ((hashPos >= 0) && (hashPos < queryStringPos)) {
            queryStringPos = hashPos;
          }
        } else {
          queryStringPos = hashPos;
        }
        if (queryStringPos >= 0) {
          href = href.substring(0,queryStringPos);
        }
        filterList = s.linkDownloadFileTypes.toLowerCase().split(",");
        for (filterNum = 0;filterNum < filterList.length;filterNum++) {
          match = filterList[filterNum];
          if ((match) && (href.substring((href.length - (match.length + 1))) == '.' + match)) {
            linkType = 'd';
          }
        }
      }

      // Check for an exit link type (if linkType hasn't already been qualified)
      if ((s.trackExternalLinks) && (!linkType)) {
        href = linkURL.toLowerCase();
        if (s.hrefSupportsLinkTracking(href)) {
          // Default linkInternalFilters to the document hostname
          if (!s.linkInternalFilters) {
            s.linkInternalFilters = w.location.hostname;
          }
          filterList = 0;
          if (s.linkExternalFilters) {
            filterList = s.linkExternalFilters.toLowerCase().split(",");
            filterMethod = 1;
          } else if (s.linkInternalFilters) {
            filterList = s.linkInternalFilters.toLowerCase().split(",");
          }
          if (filterList) {
            for (filterNum = 0;filterNum < filterList.length;filterNum++) {
              match = filterList[filterNum];
              if (href.indexOf(match) >= 0) {
                matchedFilter = 1;
              }
            }
            if (matchedFilter) {
              if (filterMethod) {
                linkType = 'e';
              }
            } else if (!filterMethod) {
              linkType = 'e';
            }
          }
        }
      }
    }

    s.linkObject = linkObject;
    s.linkURL    = linkURL;
    s.linkType   = linkType;

    // Handle ClickMap
    if ((s.trackClickMap) || (s.trackInlineStats)) {
      // Clear the ClickMap query-string fragment
      s.clickMapQueryString = '';

      // If we are dealing with the click of an object...
      if (linkObject) {
        var
            pageID = s.pageName,
            pageIDType = 1,
            objectIndex = linkObject.sourceIndex;;
        if (!pageID) {
          pageID     = s.pageURL;
          pageIDType = 0;
        }
        if (w['s_objectID']) {
          objectID.id   = w['s_objectID'];
          objectID.type = 1;
          objectIndex   = 1;
        }
        if ((pageID) && (objectID) && (objectID.id) && (objectType)) {
          s.clickMapQueryString =
              '&pid=' + s.escape(pageID.substring(0,255)) +
              (pageIDType ? '&pidt=' + pageIDType : '') +
              '&oid=' + s.escape(objectID.id.substring(0,100)) +
              (objectID.type ? '&oidt=' + objectID.type : '') +
              '&ot='   + objectType +
              (objectIndex ? '&oi=' + objectIndex : '')
          ;
        }
      }
    }
  };

  /*********************************************************************
   * Function handleLinkTracking(): Handle link-tracking variables including ClickMap
   *     Nothing
   * Returns:
   *     Nothing
   *********************************************************************/
  s.handleLinkTracking = function() {
    var
        track = s.linkTrack,
        objectType,
        objectID,
        linkObject = s.linkObject,
        linkType   = s.linkType,
        linkURL    = s.linkURL,
        linkName   = s.linkName,
        queryStringPos;

    if ((linkType) && ((linkURL) || (linkName))) {
      linkType = linkType.toLowerCase();
      if ((linkType != "d") && (linkType != "e")) {
        linkType = "o";
      }

      s.pe   = "lnk_" + linkType;
      s.pev1 = (linkURL ? s.escape(linkURL) : "");
      s.pev2 = (linkName ? s.escape(linkName) : "");

      track = 1; // We know we need to track this link
    }

    if (s.abort) {
      track = 0;
    }

    // Handle ClickMap
    if ((s.trackClickMap) || (s.trackInlineStats)) {
      var
          clickMapData = {},
          clickMapDataChanged = 0,
          cookie = s.cookieRead("s_sq"),
          entryList = (cookie ? cookie.split("&") : 0),
          entryNum,
          partList,
          accountList,
          accountNum,subAccountNum,
          account,queryString,
          useCookie = 0;

      // If we have a cookie value parse it out
      if (entryList) {
        for (entryNum = 0;entryNum < entryList.length;entryNum++) {
          partList = entryList[entryNum].split("=");
          accountList = s.unescape(partList[0]).split(",");
          queryString = s.unescape(partList[1]);
          clickMapData[queryString] = accountList;
        }
      }
      accountList = s.account.split(",");

      // If we are about to track or if we have a new ClickMap query-string fragment update the ClickMap data
      if ((track) || (s.clickMapQueryString)) {
        // Remove ClickMap data for current account(s)
        // If we are tracking and don't have a new ClickMap query-string look for one in the data from the ClickMap cookie
        if ((track) && (!s.clickMapQueryString)) {
          useCookie = 1;
        }
        for (queryString in clickMapData) {
          if (!Object.prototype[queryString]) {
            for (accountNum = 0;accountNum < accountList.length;accountNum++) {
              // If we need to use ClickMap query-string fragments from the cookie and we have an exact match for the account(s) add the fragement and nuke the entry
              if (useCookie) {
                account = clickMapData[queryString].join(',');
                if (account == s.account) {
                  s.clickMapQueryString += (queryString.charAt(0) != '&' ? '&' : '') + queryString;
                  clickMapData[queryString] = [];
                  clickMapDataChanged = 1;
                }
              }
              for (subAccountNum = 0;subAccountNum < clickMapData[queryString].length;subAccountNum++) {
                account = clickMapData[queryString][subAccountNum];
                if (account == accountList[accountNum]) {
                  // If we need to use ClickMap query-string fragments from the cookie and we have a single account match add the fragment wrapped as account specific variables
                  if (useCookie) {
                    s.clickMapQueryString += "&u=" + s.escape(account) + (queryString.charAt(0) != '&' ? '&' : '') + queryString + "&u=0";
                  }
                  clickMapData[queryString].splice(subAccountNum,1);
                  clickMapDataChanged = 1;
                }
              }
            }
          }
        }

        // If we are not about to track and just have a new ClickMap query-string we need to update the cookie
        if (!track) {
          clickMapDataChanged = 1;
        }

        // If the ClickMap data changed write the new cookie out or delete it
        if (clickMapDataChanged) {
          cookie = '';
          entryNum = 2; // Default to writing out 2 cookie entries
          // If we need to store the new ClickMap query-string fragment for later
          if ((!track) && (s.clickMapQueryString)) {
            cookie = s.escape(accountList.join(",")) + "=" + s.escape(s.clickMapQueryString);
            entryNum = 1; // We have already added our first entry so just add one more
          }
          // Add 1 or 2 more entries to the cookie
          for (queryString in clickMapData) {
            if (!Object.prototype[queryString]) {
              if ((entryNum > 0) && (clickMapData[queryString].length > 0)) {
                cookie += (cookie ? "&" : "") + s.escape(clickMapData[queryString].join(",")) + "=" + s.escape(queryString);
                entryNum--;
              }
            }
          }
          // Write out the new cookie
          s.cookieWrite("s_sq",cookie);
        }
      }
    }

    return track;
  };

  /*********************************************************************
   * Function handleTechnology(): Populate the technology variables
   *     Nothing
   * Returns:
   *     Nothing
   *********************************************************************/
  s.handleTechnology = function() {
    if (!s.technologyHandled) {
      var
          tm = new Date,
          tl = topFrameSet.location,
          a,o,i,
          x = '',
          c = '',
          v = '',
          p = '',
          bw = '',
          bh = '',
          j = '1.2',
          k = (s.cookieWrite('s_cc','true',0) ? 'Y' : 'N'),
          hp = '',
          ct = '',
          pn = 0,
          e;

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
      x = screen.width + 'x' + screen.height;
      v = (navigator.javaEnabled() ? 'Y' : 'N');
      c = (screen.pixelDepth ? screen.pixelDepth : screen.colorDepth);
      bw = (s.w.innerWidth ? s.w.innerWidth : s.d.documentElement.offsetWidth);
      bh = (s.w.innerHeight ? s.w.innerHeight : s.d.documentElement.offsetHeight);
      try {
        s.b.addBehavior("#default#homePage");
        hp = (s.b.isHomePage(tl) ? "Y" : "N");
      } catch (e) {}
      try {
        s.b.addBehavior("#default#clientCaps");
        ct = s.b.connectionType;
      } catch (e) {}

      s.resolution        = x;
      s.colorDepth        = c;
      s.javascriptVersion = j;
      s.javaEnabled       = v;
      s.cookiesEnabled    = k;
      s.browserWidth      = bw;
      s.browserHeight     = bh;
      s.connectionType    = ct;
      s.homepage          = hp;

      s.technologyHandled = 1;
    }
  };

  /*********************************************************************
   * Function loadModule(): Load a module into this instance
   *     moduleName = Module name
   *     onLoad     = Optional onLoad function to execute after the module
   *                  is loaded
   * Returns:
   *     Nothing
   *********************************************************************/
  s.modules = {};
  s.loadModule = function(moduleName,onLoad) {
    var
        module = s.modules[moduleName],
        e;
    if (!module) {
      // Create the module instance
      if (w["AppMeasurement_Module_" + moduleName]) {
        module = new w["AppMeasurement_Module_" + moduleName](s);
      } else {
        module = {};
      }
      s.modules[moduleName] = s[moduleName] = module;

      // Handle module onLoad
      module._getOnLoad = function() {
        return module._onLoad;
      };
      module._setOnLoad = function(v) {
        module._onLoad = v;
        if (v) {
          s[moduleName + '_onLoad'] = v;
          if (!s.delayCall(moduleName + '_onLoad',[s,module],1)) {
            v(s,module);
          }
        }
      };
      try {
        // Try to use Object.defineProperty
        if (Object['defineProperty']) {
          Object['defineProperty'](module,"onLoad",{
            'get':module._getOnLoad,
            'set':module._setOnLoad
          });
        } else {
          // We don't have Object.defineProperty so set a flag telling callModuleMethod to look for the onLoad later
          module['_olc'] = 1;
        }
      } catch(e) {
        // Object.defineProperty threw an exception so set a flag telling callModuleMethod to look for the onLoad later
        module['_olc'] = 1;
      }
    }

    if (onLoad) {
      s[moduleName + '_onLoad'] = onLoad;
      if (!s.delayCall(moduleName + '_onLoad',[s,module],1)) {
        onLoad(s,module);
      }
    }
  };

  /*********************************************************************
   * Function callModuleMethod(methodName): Call method on all modules if defined
   *     methodName = Method name to call
   * Returns:
   *     1 if any module returns something that tests as true for the method.  0 otherwise
   *********************************************************************/
  s.callModuleMethod = function(methodName) {
    var
        moduleName,
        module;
    for (moduleName in s.modules) {
      if (!Object.prototype[moduleName]) {
        module = s.modules[moduleName];
        if (module) {
          if ((module['_olc']) && (module['onLoad'])) {
            module['_olc'] = 0;
            module['onLoad'](s,module);
          }
          if (module[methodName]) {
            if (module[methodName]()) {
              return 1;
            }
          }
        }
      }
    }
    return 0;
  };

  /********************************************************************
   * Function vs(x): Check to see if visitor should be sampled or
   *                 not if visitor-sampling is turned on
   *     x  = Random sampling number
   * Returns:
   *     1 if visitor falls into sampling group or 0 if not
   *********************************************************************/
  s.isVisitorInSample = function() {
    var
        visitorSamplingNumber      = Math.floor(Math.random() * 10000000000000),
        visitorSampling            = s.visitorSampling,
        visitorSamplingGroup       = s.visitorSamplingGroup,
        visitorSamplingCookieKey   ='s_vsn_' + (s.visitorNamespace ? s.visitorNamespace : s.account) + (visitorSamplingGroup ? '_' + visitorSamplingGroup : ''),
        visitorSamplingCookieValue = s.cookieRead(visitorSamplingCookieKey);
    if (visitorSampling) {
      visitorSampling *= 100;
      if (visitorSamplingCookieValue) {
        visitorSamplingCookieValue = parseInt(visitorSamplingCookieValue);
      }
      if (!visitorSamplingCookieValue) {
        if (!s.cookieWrite(visitorSamplingCookieKey,visitorSamplingNumber)) {
          return 0;
        }
        visitorSamplingCookieValue = visitorSamplingNumber;
      }
      if (visitorSamplingCookieValue % 10000 > v) {
        return 0;
      }
    }

    return 1;
  };

  /*********************************************************************
   * Function variableOverridesApply(variableOverrides,restoring): Apply variable overrides
   *     variableOverrides = Object containing one time variable overrides
   *     restoring         = Optional restore flag
   * Returns:
   *     Nothing
   *********************************************************************/
  s.variableOverridesApply = function(variableOverrides,restoring) {
    var
        listNum,
        list,
        varNum,
        varKey,
        varValue,
        subVarKey;

    for (listNum = 0;listNum < 2;listNum++) {
      list = (listNum > 0 ? s.accountConfigList : s.accountVarList);
      for (varNum = 0;varNum < list.length;varNum++) {
        varKey   = list[varNum];
        varValue = variableOverrides[varKey];
        if ((varValue) || (variableOverrides['!' + varKey])) {
          if ((!restoring) && ((varKey == 'contextData') || (varKey == 'retrieveLightData')) && (s[varKey])) {
            for (subVarKey in s[varKey]) {
              if (!varValue[subVarKey]) {
                varValue[subVarKey] = s[varKey][subVarKey];
              }
            }
          }
          s[varKey] = varValue;
        }
      }
    }
  };

  /*********************************************************************
   * Function variableOverridesBuild(variableOverrides): Build variable overrides
   *     variableOverrides = Object to fill in with variable overrides
   *     onlySet           = Optional flag to not build unsets (!varKey)
   * Returns:
   *     Nothing
   *********************************************************************/
  s.variableOverridesBuild = function(variableOverrides,onlySet) {
    var
        listNum,
        list,
        varNum,
        varKey;

    for (listNum = 0;listNum < 2;listNum++) {
      list = (listNum > 0 ? s.accountConfigList : s.accountVarList);
      for (varNum = 0;varNum < list.length;varNum++) {
        varKey = list[varNum];
        variableOverrides[varKey] = s[varKey];
        if ((!onlySet) && (!variableOverrides[varKey])) {
          variableOverrides['!' + varKey] = 1;
        }
      }
    }
  };

  /*********************************************************************
   * Function fixReferrer(x): Fix referrers we know about
   *                 Reorder query-string variables to put
   *
   *                 Google:
   *                         q
   *                         ie
   *                         start
   *                         search_key
   *                         word
   *                         kw
   *                         cd
   *                 Yahoo:
   *                         p
   *
   *                         first in the query-string.  To match google
   *                         the hostname must contain "google" and the
   *                         query-string must contain at least one of
   *                         the above query-string variables.  To match
   *                         Yahoo the hostname must contain "yahoo.co"
   *                         and the query-string must contain at least
   *                         one of the above query-string variables. We
   *                         also truncate the path in favor of keeping
   *                         the query-string
   *     referrer = referrer URL
   * Returns:
   *     Fixed referrer URL or original if no fix was needed
   *********************************************************************/
  s.fixReferrer = function(referrer) {
    var
        newReferrer,
        i,j,
        host,
        path,
        queryStringKeySet = 0,
        queryString,
        newQueryStringLeft = "",
        newQueryStringRight = "",
        pairList,
        pair;
    if ((referrer) && (referrer.length > 255)) {
      newReferrer = "" + referrer;
      i = newReferrer.indexOf("?");
      if (i > 0) {
        queryString = newReferrer.substring(i + 1);
        newReferrer = newReferrer.substring(0,i);
        host        = newReferrer.toLowerCase();
        j = 0;
        if (host.substring(0,7) == "http://") {
          j += 7;
        } else if (host.substring(0,8) == "https://") {
          j += 8;
        }
        i = host.indexOf("/",j);
        if (i > 0) {
          host = host.substring(j,i);
          path = newReferrer.substring(i);
          newReferrer = newReferrer.substring(0,i);
          if (host.indexOf("google") >= 0) {
            queryStringKeySet = ",q,ie,start,search_key,word,kw,cd,";
          } else if (host.indexOf('yahoo.co') >= 0) {
            queryStringKeySet = ",p,ei,";
          }
          if ((queryStringKeySet) && (queryString)) {
            /* Do query-string reordering */
            pairList = queryString.split("&");
            if ((pairList) && (pairList.length > 1)) {
              for (j = 0;j < pairList.length;j++) {
                pair = pairList[j];
                i = pair.indexOf("=");
                if ((i > 0) && (queryStringKeySet.indexOf("," + pair.substring(0,i) + ",") >= 0)) {
                  newQueryStringLeft += (newQueryStringLeft ? "&" : "") + pair;
                } else {
                  newQueryStringRight += (newQueryStringRight ? "&" : "") + pair;
                }
              }
              if ((newQueryStringLeft) && (newQueryStringRight)) {
                queryString = newQueryStringLeft + "&" + newQueryStringRight;
              } else {
                newQueryStringRight = "";
              }
            }
            /* Truncate path if needed */
            i = 253 - (queryString.length - newQueryStringRight.length) - newReferrer.length;
            /* Put it back together */
            referrer = newReferrer + (i > 0 ? path.substring(0,i) : '') + '?' + queryString;
          }
        }
      }
    }

    return referrer;
  };

  /*********************************************************************
   * Function _checkVisibility(callback): Check the browser visibility state
   *     callback = Callback to call once the browser is visible
   * Returns:
   *     true if the browser window is visible or false if not
   *********************************************************************/
  s._checkVisibility = function(callback) {
    var
        delayNeeded = 0,
        tm = new Date,
        timeout = tm.getTime() + s.maxDelay,
        visibilityState = s.d.visibilityState,
        visibilityStateEventList = ["webkitvisibilitychange","visibilitychange"],
        visibilityStateEventNum;

    if (!visibilityState) {
      visibilityState = s.d.webkitVisibilityState;
    }
    if ((visibilityState) && (visibilityState == 'prerender')) {
      if (callback) {
        for (visibilityStateEventNum = 0;visibilityStateEventNum < visibilityStateEventList.length;visibilityStateEventNum++) {
          s.d.addEventListener(visibilityStateEventList[visibilityStateEventNum],function(){
            var
                visibilityState = s.d.visibilityState;
            if (!visibilityState) {
              visibilityState = s.d.webkitVisibilityState;
            }
            if (visibilityState == 'visible') {
              callback();
            }
          });
        }
      }
      return false;
    }
    return true;
  };

  /*********************************************************************
   * Function _visibilityCallback(): Callback for when browser is visible
   * Returns:
   *     Nothing
   *********************************************************************/
  s._waitingForVisibility = false;
  s._doneWaitingForVisibility = false;
  s._visibilityCallback = function() {
    s._doneWaitingForVisibility = true;
    s._callbackWhenReadyToTrackCheck();
  };

  /*********************************************************************
   * Function _marketingCloudVisitorIDCallback(marketingCloudVisitorID): Visitor API callback for Marketing Cloud Visitor ID
   *     marketingCloudVisitorID = Marketing Cloud Visitor ID
   * Returns:
   *     Nothing
   *********************************************************************/
  s._waitingForMarketingCloudVisitorID = false;
  s._doneWaitingForMarketingCloudVisitorID = false;
  s._marketingCloudVisitorIDCallback = function(marketingCloudVisitorID) {
    s.marketingCloudVisitorID = marketingCloudVisitorID;
    s._doneWaitingForMarketingCloudVisitorID = true;
    s._callbackWhenReadyToTrackCheck();
  };

  /*********************************************************************
   * Function _analyticsVisitorIDCallback(analyticsVisitorID): Visitor API callback for Analytics Visitor ID
   *     analyticsVisitorID = Analytics Visitor ID
   * Returns:
   *     Nothing
   *********************************************************************/
  s._waitingForAnalyticsVisitorID = false;
  s._doneWaitingForAnalyticsVisitorID = false;
  s._analyticsVisitorIDCallback = function(analyticsVisitorID) {
    s.analyticsVisitorID = analyticsVisitorID;
    s._doneWaitingForAnalyticsVisitorID = true;
    s._callbackWhenReadyToTrackCheck();
  };

  /*********************************************************************
   * Function _audienceManagerLocationHintCallback(audienceManagerLocationHint): Visitor API callback for Audience Manager Location Hint
   *     audienceManagerLocationHint = Audience Manager Location Hint
   * Returns:
   *     Nothing
   *********************************************************************/
  s._waitingForAudienceManagerLocationHint = false;
  s._doneWaitingForAudienceManagerLocationHint = false;
  s._audienceManagerLocationHintCallback = function(audienceManagerLocationHint) {
    s.audienceManagerLocationHint = audienceManagerLocationHint;
    s._doneWaitingForAudienceManagerLocationHint = true;
    s._callbackWhenReadyToTrackCheck();
  };

  /*********************************************************************
   * Function _audienceManagerBlobCallback(audienceManagerBlob): Visitor API callback for Audience Manager Blob
   *     audienceManagerBlob = Audience Manager Blob
   * Returns:
   *     Nothing
   *********************************************************************/
  s._waitingForAudienceManagerBlob = false;
  s._doneWaitingForAudienceManagerBlob = false;
  s._audienceManagerBlobCallback = function(audienceManagerBlob) {
    s.audienceManagerBlob = audienceManagerBlob;
    s._doneWaitingForAudienceManagerBlob = true;
    s._callbackWhenReadyToTrackCheck();
  };

  /*********************************************************************
   * Function _checkModulesReady(callback): Check for mobule readyness
   *     callback = Callback to call once modules are ready or on timeout
   * Returns:
   *     true if mobules are ready or false if not
   *********************************************************************/
  s._checkModulesReady = function(callback) {
    if (!s.maxDelay) {
      s.maxDelay = 250;
    }

    if (s.callModuleMethod("_d")) {
      if (callback) {
        setTimeout(function() {
          callback();
        },s.maxDelay);
      }
      return false;
    }
    return true;
  };

  /*********************************************************************
   * Function _modulesReadyCallback(): Callback for when modules are ready or time out
   * Returns:
   *     Nothing
   *********************************************************************/
  s._waitingForModulesReady = false;
  s._doneWaitingForModulesReady = false;
  s._modulesReadyCallback = function() {
    s._doneWaitingForModulesReady = true;
    s._callbackWhenReadyToTrackCheck();
  };

  /*********************************************************************
   * Function isReadyToTrack(): Check to see if the instance is ready to track
   * Returns:
   *     true if ready to track or false if not
   *********************************************************************/
  s.isReadyToTrack = function() {
    var
        readyToTrack = true,
        visitor = s.visitor;

    // Client/browser state
    if ((!s._waitingForVisibility) && (!s._doneWaitingForVisibility)) {
      if (!s._checkVisibility(s._visibilityCallback)) {
        s._waitingForVisibility = true;
      } else {
        s._doneWaitingForVisibility = true;
      }
    }
    // IMPORTANT: If we're waiting for visibility don't do any of the other ready checks because that will fire off actions that we don't want to happen when the browser window isn't visible
    if ((s._waitingForVisibility) && (!s._doneWaitingForVisibility)) {
      return false;
    }

    // Visitor
    if ((visitor) && (visitor.isAllowed())) {
      // Marketing Cloud Visitor ID
      if ((!s._waitingForMarketingCloudVisitorID) && (!s.marketingCloudVisitorID) && (visitor.getMarketingCloudVisitorID)) {
        s._waitingForMarketingCloudVisitorID = true;
        s.marketingCloudVisitorID = visitor.getMarketingCloudVisitorID([s,s._marketingCloudVisitorIDCallback]);
        if (s.marketingCloudVisitorID) {
          s._doneWaitingForMarketingCloudVisitorID = true;
        }
      }

      // Analytics Visitor ID
      if ((!s._waitingForAnalyticsVisitorID) && (!s.analyticsVisitorID) && (visitor.getAnalyticsVisitorID)) {
        s._waitingForAnalyticsVisitorID = true;
        s.analyticsVisitorID = visitor.getAnalyticsVisitorID([s,s._analyticsVisitorIDCallback]);
        if (s.analyticsVisitorID) {
          s._doneWaitingForAnalyticsVisitorID = true;
        }
      }

      // Audience Manager Location Hint & Blob
      if ((!s._waitingForAudienceManagerLocationHint) && (!s.audienceManagerLocationHint) && (visitor.getAudienceManagerLocationHint)) {
        s._waitingForAudienceManagerLocationHint = true;
        s.audienceManagerLocationHint = visitor.getAudienceManagerLocationHint([s,s._audienceManagerLocationHintCallback]);
        if (s.audienceManagerLocationHint) {
          s._doneWaitingForAudienceManagerLocationHint = true;
        }
      }
      if ((!s._waitingForAudienceManagerBlob) && (!s.audienceManagerBlob) && (visitor.getAudienceManagerBlob)) {
        s._waitingForAudienceManagerBlob = true;
        s.audienceManagerBlob = visitor.getAudienceManagerBlob([s,s._audienceManagerBlobCallback]);
        if (s.audienceManagerBlob) {
          s._doneWaitingForAudienceManagerBlob = true;
        }
      }

      // Make sure we have everything we need
      if (((s._waitingForMarketingCloudVisitorID)     && (!s._doneWaitingForMarketingCloudVisitorID)     && (!s.marketingCloudVisitorID)) ||
          ((s._waitingForAnalyticsVisitorID)          && (!s._doneWaitingForAnalyticsVisitorID)          && (!s.analyticsVisitorID)) ||
          ((s._waitingForAudienceManagerLocationHint) && (!s._doneWaitingForAudienceManagerLocationHint) && (!s.audienceManagerLocationHint)) ||
          ((s._waitingForAudienceManagerBlob)         && (!s._doneWaitingForAudienceManagerBlob)         && (!s.audienceManagerBlob))) {
        readyToTrack = false;
      }
    }

    // Modules
    if ((!s._waitingForModulesReady) && (!s._doneWaitingForModulesReady)) {
      if (!s._checkModulesReady(s._modulesReadyCallback)) {
        s._waitingForModulesReady = true;
      } else {
        s._doneWaitingForModulesReady = true;
      }
    }
    if ((s._waitingForModulesReady) && (!s._doneWaitingForModulesReady)) {
      readyToTrack = false;
    }

    return readyToTrack;
  };

  /*********************************************************************
   * Function callbackWhenReadyToTrack(): Callback when instance is ready to track
   *     callbackThis = Object for callback
   *     callback     = Callback function object
   *     args         = Arguments for callback
   * Returns:
   *     Nothing
   *********************************************************************/
  s._callbackWhenReadyToTrackQueue = Null;
  s._callbackWhenReadyToTrackInterval = 0;
  s.callbackWhenReadyToTrack = function(callbackThis,callback,args) {
    var
        callbackInfo;

    callbackInfo = {};
    callbackInfo.callbackThis = callbackThis;
    callbackInfo.callback     = callback;
    callbackInfo.args         = args;
    if (s._callbackWhenReadyToTrackQueue == Null) {
      s._callbackWhenReadyToTrackQueue = [];
    }
    s._callbackWhenReadyToTrackQueue.push(callbackInfo);

    if (s._callbackWhenReadyToTrackInterval == 0) {
      s._callbackWhenReadyToTrackInterval = setInterval(s._callbackWhenReadyToTrackCheck,100);
    }
  };

  /*********************************************************************
   * Function _callbackWhenReadyToTrackCheck(): Interval check to see if the instance is ready to track
   * Returns:
   *     Nothing
   *********************************************************************/
  s._callbackWhenReadyToTrackCheck = function() {
    var
        callbackNum,
        callbackInfo;

    if (s.isReadyToTrack()) {
      if (s._callbackWhenReadyToTrackInterval) {
        clearInterval(s._callbackWhenReadyToTrackInterval);
        s._callbackWhenReadyToTrackInterval = 0;
      }
      if (s._callbackWhenReadyToTrackQueue != Null) {
        while (s._callbackWhenReadyToTrackQueue.length > 0) {
          callbackInfo = s._callbackWhenReadyToTrackQueue.shift();
          callbackInfo.callback.apply(callbackInfo.callbackThis,callbackInfo.args);
        }
      }
    }
  };

  /*********************************************************************
   * Function _handleNotReadyToTrack(variableOverrides): Handle not ready to track.  If not ready register callback
   *     variableOverrides = Object containing one time variable overrides
   * Returns:
   *     true if not ready to track and false if ready
   *********************************************************************/
  s._handleNotReadyToTrack = function(variableOverrides) {
    var
        args,
        varKey,
        variableOverridesCopy = Null,
        setVariables = Null;

    if (!s.isReadyToTrack()) {
      args = [];
      if (variableOverrides != Null) {
        variableOverridesCopy = {};
        for (varKey in variableOverrides) {
          variableOverridesCopy[varKey] = variableOverrides[varKey];
        }
      }
      setVariables = {};
      s.variableOverridesBuild(setVariables,true);
      args.push(variableOverridesCopy);
      args.push(setVariables);
      s.callbackWhenReadyToTrack(s,s.track,args);

      return true;
    }

    return false;
  };

  /*********************************************************************
   * Function getFallbackVisitorID(): Get the fallback visitor ID
   *     Nothing
   * Returns:
   *     The fallback visitor ID if supported or 0 if not
   *********************************************************************/
  s.getFallbackVisitorID = function() {
    var
        digits = "0123456789ABCDEF",
        key = "s_fid",
        fallbackVisitorID = s.cookieRead(key),
        high = "",low = "",
        digitNum,digitValue,highDigitValueMax = 8,lowDigitValueMax = 4; /* The first nibble can't have the left-most bit set because we are deailing with signed 64bit numbers.  The low part can only use the 2 right-most bits to avoid collisions */
    if ((!fallbackVisitorID) || (fallbackVisitorID.indexOf("-") < 0)) {
      for (digitNum = 0;digitNum < 16;digitNum++) {
        digitValue = Math.floor(Math.random() * highDigitValueMax);
        high += digits.substring(digitValue,(digitValue + 1));
        digitValue = Math.floor(Math.random() * lowDigitValueMax);
        low += digits.substring(digitValue,(digitValue + 1));
        highDigitValueMax = lowDigitValueMax = 16;
      }
      fallbackVisitorID = high + "-" + low;
    }
    if (!s.cookieWrite(key,fallbackVisitorID,1)) {
      fallbackVisitorID = 0;
    }
    return fallbackVisitorID;
  };


  /*********************************************************************
   * Function track(vo): Gather and send stats.  This is where the stats
   *                     are gathered and sent to mod-stats
   *     variableOverrides = Optional object containing one time variable overrides
   *     setVariables      = Optional object containing perminent variable overrides
   * Returns:
   *     Nothing
   *********************************************************************/
  s.t = s.track = function(variableOverrides,setVariables) {
    var
        notReadyToTrack,
        variableOverridesBackup,
        tm = new Date,
        sed = Math.floor(Math.random() * 10000000000000),
        cacheBusting = "s" + Math.floor(tm.getTime() / 10800000) % 10 + sed,
        year = tm.getYear(),
        time =
            tm.getDate() + '/'
            + tm.getMonth() + '/'
            + (year < 1900 ? year + 1900 : year) + ' '
            + tm.getHours() + ':'
            + tm.getMinutes() + ':'
            + tm.getSeconds() + ' '
            + tm.getDay() + ' '
            + tm.getTimezoneOffset(),
        queryString = "t=" + s.escape(time);

    // Simple Visitor API Usage
    if (s.visitor) {
      // Handle authenticated state
      if (s.visitor.getAuthState) {
        s.authState = s.visitor.getAuthState();
      }
      // Handle supplemental-data ID
      if ((!s.supplementalDataID) && (s.visitor.getSupplementalDataID)) {
        s.supplementalDataID = s.visitor.getSupplementalDataID("AppMeasurement:" + s._in,(s.expectSupplementalData ? false : true));
      }
    }

    // Call module setup methods and consiquently any module onLoad that hasn't been handled yet
    s.callModuleMethod("_s");

    // Handle not ready to track
    notReadyToTrack = s._handleNotReadyToTrack(variableOverrides);
    if (!notReadyToTrack) {
      if (setVariables) {
        s.variableOverridesApply(setVariables);
      }

      // Apply variable overrides
      if (variableOverrides) {
        variableOverridesBackup = {};
        s.variableOverridesBuild(variableOverridesBackup,0);
        s.variableOverridesApply(variableOverrides);
      }

      // Do visitor-sampling
      if (s.isVisitorInSample()) {
        // Make sure we have a fallback visitor ID if we don't already have an alternative
        if ((!s.analyticsVisitorID) && (!s.marketingCloudVisitorID)) {
          s.fid = s.getFallbackVisitorID();
        }

        // Prepare link tracking information before doPlugins so it can be reviewed and optionaly altered
        s.prepareLinkTracking();

        // Fire off manual plugins/modules
        if ((s.usePlugins) && (s.doPlugins)) {
          s.doPlugins(s);
        }

        // If we have an account build query-string and track
        if (s.account) {
          if (!s.abort) {
            // If timestamp hasn't been set yet and offline tracking is on set the timestamp
            if ((s.trackOffline) && (!s.timestamp)) {
              s.timestamp = Math.floor(tm.getTime() / 1000);
            }

            // Polulate basic account variables
            var l = w.location;
            if (!s.pageURL) {
              s.pageURL = (l.href ? l.href : l);
            }
            if ((!s.referrer) && (!s._1_referrer)) {
              s.referrer = topFrameSet.document.referrer;
            }
            s._1_referrer = 1;
            s.referrer = s.fixReferrer(s.referrer);

            // Give modules a chance to give us variables
            s.callModuleMethod("_g");
          }

          // Handle link tracking - If it doesn't tell us to skip tracking and we havn't already been told to not track...
          // IMPORTANT-NOTE: Even if doPlugins told us to abort we still need to handle the link tracking
          if ((s.handleLinkTracking()) && (!s.abort)) {
            // Fill in technology
            s.handleTechnology();

            // Get query-string part for account variables
            queryString += s.getQueryString();

            // Fire off request
            s.makeRequest(cacheBusting,queryString);

            // Give modules a chance to take variables and use them
            s.callModuleMethod("_t");

            // Clear out referrer because we only want to use it once
            s.referrer = "";
          }
        }
      }

      // Restore variables
      if (variableOverrides) {
        s.variableOverridesApply(variableOverridesBackup,1);
      }
    }

    // Reset variables
    s.abort               =
        s.supplementalDataID  =
            s.timestamp           =
                s.pageURLRest         =
                    s.linkObject          =
                        s.clickObject         =
                            s.linkURL             =
                                s.linkName            =
                                    s.linkType            =
                                        w.s_objectID          =
                                            s.pe                  =
                                                s.pev1                =
                                                    s.pev2                =
                                                        s.pev3                =
                                                            s.clickMapQueryString =
                                                                0;
  };

  /*********************************************************************
   * Function trackLink(linkObject,linkType,linkName,variableOverrides,doneAction): Track link click
   *     linkObject        = link object
   *     linkType          = link type
   *     linkName          = link name
   *     variableOverrides = Optional object containing one time variable overrides
   *     doneAction        = Optional function to call when tracking is finished or times out
   * Returns:
   *     Nothing
   *********************************************************************/
  s.tl = s.trackLink = function(linkObject,linkType,linkName,variableOverrides,doneAction) {
    s.linkObject = linkObject;
    s.linkType = linkType;
    s.linkName = linkName;
    if (doneAction) {
      s.bodyClickTarget   = linkObject;
      s.bodyClickFunction = doneAction;
    }
    return s.track(variableOverrides);
  };

  /*********************************************************************
   * Function trackLight(profileID,storeForSeconds,incrementBy,variableOverrides): Track light server call
   *     profileID         = Light server call profile ID
   *     storeForSeconds   = Light server call store for seconds
   *     incrementBy       = Light server call increment by
   *     variableOverrides = Optional object containing one time variable overrides
   * Returns:
   *     Nothing
   *********************************************************************/
  s.trackLight = function(profileID,storeForSeconds,incrementBy,variableOverrides) {
    s.lightProfileID       = profileID;
    s.lightStoreForSeconds = storeForSeconds;
    s.lightIncrementBy     = incrementBy;
    return s.track(variableOverrides);
  };

  /*********************************************************************
   * Function clearVars(): Clear a standard set of variables
   * Returns:
   *     Nothing
   *********************************************************************/
  s.clearVars = function() {
    var
        varNum,
        varKey;

    for (varNum = 0;varNum < s.accountVarList.length;varNum++) {
      varKey = s.accountVarList[varNum];
      // We don't want to clear everything
      if ((varKey.substring(0,4) == "prop") ||
          (varKey.substring(0,4) == "eVar") ||
          (varKey.substring(0,4) == "hier") ||
          (varKey.substring(0,4) == "list") ||
          (varKey                == "channel") ||
          (varKey                == "events") ||
          (varKey                == "eventList") ||
          (varKey                == "products") ||
          (varKey                == "productList") ||
          (varKey                == "purchaseID") ||
          (varKey                == "transactionID") ||
          (varKey                == "state") ||
          (varKey                == "zip") ||
          (varKey                == "campaign")) {
        s[varKey] = undefined;
      }
    }
  }

  /*********************************************************************
   * Function makeRequest(cacheBusting,queryString): Make Request
   *     cacheBusting = Cache-Busting
   *     queryString  = Stats query string
   * Returns:
   *     Nothing
   *********************************************************************/
  s.tagContainerMarker = "";
  s.makeRequest = function(cacheBusting,queryString) {
    var
        request,
        trackingServer = s.trackingServer,
        trackingServerBase = "",
        dc = s.dc,
        product = "sc.",
        prefix = s.visitorNamespace,
        ci;

    if (trackingServer) {
      if ((s.trackingServerSecure) && (s.ssl)) {
        trackingServer = s.trackingServerSecure;
      }
    } else {
      if (!prefix) {
        prefix = s.account;
        ci = prefix.indexOf(",");
        if (ci >= 0) {
          prefix = prefix.substring(0,ci);
        }
        prefix = prefix.replace(/[^A-Za-z0-9]/g,'');
      }

      if (!trackingServerBase) {
        trackingServerBase = "2o7.net";
      }

      if (dc) {
        dc = (""+dc).toLowerCase();
      } else {
        dc = "d1";
      }
      if (trackingServerBase == "2o7.net") {
        if (dc == "d1") {
          dc = "112";
        } else if (dc == "d2") {
          dc = "122";
        }
        product = "";
      }

      trackingServer = prefix + "." + dc + "." + product + trackingServerBase;
    }

    if (s.ssl) {
      request = "https://";
    } else {
      request = "http://";
    }

    var
        useAudienceManagement = ((s.AudienceManagement) && (s.AudienceManagement.isReady()));
    request += trackingServer + "/b/ss/" + s.account + "/" + (s.mobile? "5." : "" ) + (useAudienceManagement ? "10" : "1") + "/JS-" + s.version + (s.tagContainerName ? "T" : "") + (s.tagContainerMarker ? "-" + s.tagContainerMarker : "") + "/" + cacheBusting + "?AQB=1&ndh=1&pf=1&" + (useAudienceManagement ? "callback=s_c_il[" + s._in + "].AudienceManagement.passData&" : "") + queryString + "&AQE=1";


    recordAMUrl(request);
    s.enqueueRequest(request);
    s.handleRequestList();

    return "";
  };

  /*********************************************************************
   * Function enqueueRequest(request): Makes sure everything is prepped for request handling and add request to s.requestList
   *     request = Request to send off
   * Returns:
   *     Nothing
   *********************************************************************/
  s.enqueueRequest = function(request) {
    if (!s.requestList) {
      s.initRequestList();
    }
    s.requestList.push(request);
    s.lastEnqueuedPacketTimestamp = s.getCurrentTimeInMilliseconds();
    s.trimRequestListToOfflineLimit();
  };

  s.initRequestList = function() {
    s.requestList = s.loadOfflineRequestList();
    if (!s.requestList) {
      s.requestList = new Array;
    }
  };

  /*********************************************************************
   * Function loadOfflineRequestList(): Load s.requestList from permanent storage
   *     Nothing
   * Returns:
   *     Array containing offline requests, or nothing if none has been stored.
   *********************************************************************/
  s.loadOfflineRequestList = function() {
    var e, requestList;
    var storedString;

    if (!s.offlineStorageSupported()) {
      return;
    }

    try {
      storedString = w.localStorage.getItem(s.makeUniqueOfflineFilename());
      if (storedString) {
        requestList = w.JSON.parse(storedString);
      }
    } catch (e) {}

    return requestList;
  };

  s.offlineStorageSupported = function() {
    var offlineStorageSupport = true;
    if (!s.trackOffline || !s.offlineFilename || !w.localStorage || !w.JSON) {
      offlineStorageSupport = false;
    }
    return offlineStorageSupport;
  };

  s.getPendingRequestCount = function() {
    var pendingRequestCount = 0;
    if (s.requestList) {
      pendingRequestCount = s.requestList.length;
    }
    if (s.handlingRequest) {
      pendingRequestCount ++;
    }

    return pendingRequestCount;
  }


  /*********************************************************************
   * Function handleRequestList(): Handle pulling from s.requestList and sending off the requests
   *     Nothing
   * Returns:
   *     Nothing
   * NOTE:
   *     Called by setTimeout and directly
   *********************************************************************/
  s.handleRequestList = function() {
    if (s.handlingRequest) {
      return;
    }
    s.handleRequestListTimer = Null;

    if (s.offline) {
      if (s.lastEnqueuedPacketTimestamp > s.lastOfflineWriteTimestamp) {
        s.saveOfflineRequestList(s.requestList);
      }
      s.scheduleCallToHandleRequestList(500);
      return;
    }

    var requestThrottleDelay = s.calculateRequestThrottleDelay();
    if (requestThrottleDelay > 0) {
      s.scheduleCallToHandleRequestList(requestThrottleDelay);
      return;
    }

    var request = s.dequeueRequest();
    if (!request) {
      return;
    }
    s.handlingRequest = 1;
    s.logRequest(request);
    s.sendRequest(request);
  };

  s.scheduleCallToHandleRequestList = function(timeoutInMilliseconds) {
    if (s.handleRequestListTimer) {
      return;
    }
    if (!timeoutInMilliseconds) {
      timeoutInMilliseconds = 0;
    }
    s.handleRequestListTimer = setTimeout(s.handleRequestList, timeoutInMilliseconds);
  };

  s.calculateRequestThrottleDelay = function() {
    var currentTimestamp;
    var timeSinceLastRequest;
    if (!s.trackOffline || s.offlineThrottleDelay <= 0) {
      return 0;
    }
    currentTimestamp = s.getCurrentTimeInMilliseconds();
    timeSinceLastRequest = currentTimestamp - s.lastRequestTimestamp;
    if (s.offlineThrottleDelay < timeSinceLastRequest) {
      return 0;
    }
    return (s.offlineThrottleDelay - timeSinceLastRequest);
  };

  s.dequeueRequest = function() {
    if (s.requestList.length > 0) {
      return s.requestList.shift();
    }
  };

  s.logRequest = function(request) {
    if (s.debugTracking) {
      var
          debug = 'AppMeasurement Debug: ' + request,
          debugLines = request.split('&'),
          debugLineNum;
      for (debugLineNum = 0;debugLineNum < debugLines.length;debugLineNum++) {
        debug += "\n\t" + s.unescape(debugLines[debugLineNum]);
      }
      s.logDebug(debug);
    }
  };

  s._hasVisitorID = function() {
    return ((s.marketingCloudVisitorID) || (s.analyticsVisitorID));
  };

  s._jsonSupported = false;
  {
    var
        jsonTest,
        e;
    // Try native JSON support first
    try {
      jsonTest = JSON.parse("{\"x\":\"y\"}");
    } catch (e) {
      jsonTest = null;
    }
    if ((jsonTest) && (jsonTest.x == "y")) {
      s._jsonSupported = true;
      s._jsonParse = function(j){return JSON.parse(j);};
      // Fallback to jQuery JSON support
    } else if ((w['$']) && (w['$']['parseJSON'])) {
      s._jsonParse = function(j){return w['$']['parseJSON'](j);};
      s._jsonSupported = true;
    } else {
      s._jsonParse = function(){return null;};
    }
  }

  s.sendRequest = function(request) {
    var
        connection,
        method,
        parent;

    // POST - Only if a Visitor ID is present and the URL is too long
    if ((s._hasVisitorID()) && (request.length > 2047)) {
      if (typeof(XMLHttpRequest) != "undefined") {
        connection = new XMLHttpRequest;
        if ("withCredentials" in connection) {
          method = 1;
        } else {
          connection = 0;
        }
      }
      if ((!connection) && (typeof(XDomainRequest) != "undefined")) {
        connection = new XDomainRequest;
        method = 2;
      }
      if ((connection) && (s.AudienceManagement) && (s.AudienceManagement.isReady())) {
        if (s._jsonSupported) {
          connection.audienceManagementCallbackNeeded = true;
        } else {
          connection = 0;
        }
      }
    }

    // If not using POST and in IE we have to trim the request down
    if ((!connection) && (s.isIE)) {
      request = request.substring(0,2047);
    }

    // JSONP
    if ((!connection) && (s.d.createElement) &&
        (s.AudienceManagement) && (s.AudienceManagement.isReady())) {
      connection = s.d.createElement("SCRIPT");
      if ((connection) && ("async" in connection)) {
        parent = s.d.getElementsByTagName("HEAD");
        if ((parent) && (parent[0])) {
          parent = parent[0];
        } else {
          parent = s.d.body;
        }
        if (parent) {
          connection.type = "text/javascript";
          connection.setAttribute("async","async");
          method = 3;
        } else {
          connection = 0;
        }
      }
    }

    // Image
    if (!connection) {
      connection = new Image;
      connection.alt = "";
    }

    connection.cleanup = function() {
      var e;
      try {
        if (s.requestTimeout) {
          clearTimeout(s.requestTimeout);
          s.requestTimeout = 0;
        }
        if (connection.timeout) {
          clearTimeout(connection.timeout);
          connection.timeout = 0;
        }
      } catch (e) {}
    };

    connection.onload = connection.success = function() {
      connection.cleanup();
      s.deleteOfflineRequestList();
      s.bodyClickRepropagate();
      s.handlingRequest = 0;
      s.handleRequestList();

      if (connection.audienceManagementCallbackNeeded) {
        connection.audienceManagementCallbackNeeded = false;

        var e;
        try {
          var
              audienceManagementData = s._jsonParse(connection.responseText);
          AudienceManagement.passData(audienceManagementData);
        } catch (e) {}
      }
    };

    connection.onabort = connection.onerror = connection.failure = function() {
      connection.cleanup();
      // Condition to avoid having multiple of the same request put back onto the queue.
      if (((s.trackOffline) || (s.offline)) && (s.handlingRequest)) {
        s.requestList.unshift(s.currentRequest);
      }
      s.handlingRequest = 0;
      if (s.lastEnqueuedPacketTimestamp > s.lastOfflineWriteTimestamp) {
        s.saveOfflineRequestList(s.requestList);
      }
      s.bodyClickRepropagate();
      s.scheduleCallToHandleRequestList(500);
    };
    connection.onreadystatechange = function() {
      if (connection.readyState == 4) {
        if (connection.status == 200) {
          connection.success();
        } else {
          connection.failure();
        }
      }
    };

    s.lastRequestTimestamp = s.getCurrentTimeInMilliseconds();

    if ((method == 1) || (method == 2)) {
      var
          dataPos = request.indexOf("?"),
          uri = request.substring(0,dataPos),
          data = request.substring((dataPos + 1));
      data = data.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,"");
      if (method == 1) {
        connection.open("POST",uri,true);
        connection.send(data);
      } else if (method == 2) {
        connection.open("POST",uri);
        connection.send(data);
      }
    } else {
      connection.src = request;
      if (method == 3) {
        // If we previously injected a script tag remove the old one
        if (s.lastConnection) {
          try {
            parent.removeChild(s.lastConnection);
          } catch (e) {}
        }
        if (parent.firstChild) {
          parent.insertBefore(connection,parent.firstChild);
        } else {
          parent.appendChild(connection);
        }
        s.lastConnection = s.currentConnection;
      }
    }

    // Only schedule forced request timeouts if the connection supports abort
    if (connection.abort) {
      s.requestTimeout = setTimeout(connection.abort, 5000);
    }

    s.currentRequest = request;
    s.currentConnection = w['s_i_' + s.replace(s.account,',','_')] = connection;

    // Setup timeout for forced link tracking
    if (((s.useForcedLinkTracking) && (s.bodyClickEvent)) || (s.bodyClickFunction)) {
      if (!s.forcedLinkTrackingTimeout) {
        s.forcedLinkTrackingTimeout = 250;
      }
      s.bodyClickRepropagateTimer = setTimeout(s.bodyClickRepropagate, s.forcedLinkTrackingTimeout);
    }
  };

  s.deleteOfflineRequestList = function() {
    if (!s.offlineStorageSupported()) {
      return;
    }
    if (s.lastOfflineDeletionTimestamp > s.lastOfflineWriteTimestamp) {
      return;
    }

    var e;
    try {
      w.localStorage.removeItem(s.makeUniqueOfflineFilename());
      s.lastOfflineDeletionTimestamp = s.getCurrentTimeInMilliseconds();

    } catch (e) {}
  };

  s.saveOfflineRequestList = function(requestList) {
    if (!s.offlineStorageSupported()) {
      return;
    }

    s.trimRequestListToOfflineLimit();

    var e;
    try {
      w.localStorage.setItem(s.makeUniqueOfflineFilename(), w.JSON.stringify(requestList));
      s.lastOfflineWriteTimestamp = s.getCurrentTimeInMilliseconds();
    } catch (e) {}
  };

  s.trimRequestListToOfflineLimit = function() {
    if (!s.trackOffline) {
      return;
    }
    if (!s.offlineLimit || s.offlineLimit <= 0) {
      s.offlineLimit = 10;
    }

    while (s.requestList.length > s.offlineLimit) {
      s.dequeueRequest();
    }
  };

  s.forceOffline = function() {
    s.offline = true;
  };

  s.forceOnline = function() {
    s.offline = false;
  };

  s.makeUniqueOfflineFilename = function() {
    return s.offlineFilename + "-"  + s.visitorNamespace + s.account;
  };

  s.getCurrentTimeInMilliseconds = function() {
    return (new Date).getTime();
  };

  s.hrefSupportsLinkTracking = function(href) {
    href = href.toLowerCase();
    if ((href.indexOf("#") != 0) &&
        (href.indexOf("about:") != 0) &&
        (href.indexOf("opera:") != 0) &&
        (href.indexOf("javascript:") != 0)) {
      return true;
    }
    return false;
  };

  /*********************************************************************
   * Function setTagContainer(tagContainerName): Set the tag container
   *             and use the tag container loader if it exists to get the
   *             queues for calls to execute that happened before the
   *             container was loaded
   *     tagContainerName = Name of tag container (same as s.tagContainerName)
   * Returns:
   *     Nothing
   *********************************************************************/
  s.setTagContainer = function(tagContainerName) {
    var i,
        containerLoader,
        container,
        module;
    s.tagContainerName = tagContainerName;
    for (i=0; i<s._il.length; i++) {
      containerLoader = s._il[i];
      if (containerLoader && containerLoader['_c'] == 's_l'
          && containerLoader['tagContainerName'] == tagContainerName) {

        s.variableOverridesApply(containerLoader);

        // Load queued up modules
        if (containerLoader['lmq']) {
          for (i=0; i<containerLoader['lmq'].length; i++) {
            container = containerLoader['lmq'][i];
            s.loadModule(container['n']);
          }
        }
        // Transfer various module member objects (such as: s.Media.trackMilestones etc.)
        if (containerLoader['ml']) {
          for (container in containerLoader['ml']) {
            if (s[container]) {
              module = s[container];
              container = containerLoader['ml'][container];
              for(i in container) {
                if (!Object.prototype[i]){
                  if (typeof(container[i])!='function' || (''+container[i]).indexOf('s_c_il')<0)
                    module[i] = container[i];
                }
              }
            }
          }
        }
        // Execute queued up module function calls
        if (containerLoader['mmq']) {
          for (i=0; i<containerLoader['mmq'].length; i++) {
            container = containerLoader['mmq'][i];
            if (s[container['m']]){
              module = s[container['m']];
              if (module[container['f']]&&typeof(module[container['f']])=='function'){
                if (container['a']) {
                  module[container['f']].apply(module, container['a']);
                }
                else {
                  module[container['f']].apply(module);
                }
              }
            }
          }
        }
        // Execute queued up track calls
        if (containerLoader['tq']) {
          for (i=0; i<containerLoader['tq'].length; i++) {
            s.track(containerLoader['tq'][i]);
          }
        }
        containerLoader['s'] = s;
        return;
      }
    }
  };

  /* Utilities API */
  s.Util = {
    'urlEncode':s.escape,
    'urlDecode':s.unescape,
    'cookieRead':s.cookieRead,
    'cookieWrite':s.cookieWrite,
    'getQueryParam':function(key,url,delim){
      var
          queryStringPos,
          value;
      /* If we don't have a custom URL like document.referrer... */
      if (!url) {
        /* Look for a custom page URL in s.pageURL */
        if (s.pageURL) {
          url = s.pageURL;
          /* Default to window.location */
        } else {
          url = w.location;
        }
      }
      /* If we don't have a custom delimiter (usualy ";") default to "&" */
      if (!delim) {
        delim = '&';
      }
      /* If we have a good URL and key look for the value */
      if ((key) && (url)) {
        url = '' + url;
        queryStringPos = url.indexOf('?');
        if (queryStringPos >= 0) {
          value = delim + url.substring(queryStringPos + 1) + delim;
          queryStringPos = value.indexOf(delim + key + '=');
          if (queryStringPos >= 0) {
            value = value.substring(queryStringPos + delim.length + key.length + 1);
            queryStringPos = value.indexOf(delim);
            if (queryStringPos >= 0) {
              value = value.substring(0,queryStringPos);
            }
            if (value.length > 0) {
              /* We found something so URL decode it before returning */
              return s.unescape(value);
            }
          }
        }
      }
      /* We didn't find anything so return an empty string */
      return '';
    }
  };

  // BEGIN VARIABLE REPLACEMENT
  // This will be replaced with the variable lists by the Makefile
  //APPMEASUREMENT_VARAIBLES

  s.requiredVarList = [
    'supplementalDataID',
    'timestamp',
    'dynamicVariablePrefix',
    'visitorID',
    'marketingCloudVisitorID',
    'analyticsVisitorID',
    'audienceManagerLocationHint',
    'authState',
    'fid',
    'vmk',
    'visitorMigrationKey',
    'visitorMigrationServer',
    'visitorMigrationServerSecure',
    'charSet',
    'visitorNamespace',
    'cookieDomainPeriods',
    'fpCookieDomainPeriods',
    'cookieLifetime',
    'pageName',
    'pageURL',
    'referrer',
    'contextData',
    'currencyCode',
    'lightProfileID',
    'lightStoreForSeconds',
    'lightIncrementBy',
    'retrieveLightProfiles',
    'deleteLightProfiles',
    'retrieveLightData',
    'pe',
    'pev1',
    'pev2',
    'pev3',
    'pageURLRest'
  ];

  s.accountVarList = s.requiredVarList.concat([
    'purchaseID',
    'variableProvider',
    'channel',
    'server',
    'pageType',
    'transactionID',
    'campaign',
    'state',
    'zip',
    'events',
    'events2',
    'products',
    'audienceManagerBlob',
    'tnt'
  ]);

  s.lightRequiredVarList = [
    'timestamp',
    'charSet',
    'visitorNamespace',
    'cookieDomainPeriods',
    'cookieLifetime',
    'contextData',
    'lightProfileID',
    'lightStoreForSeconds',
    'lightIncrementBy'
  ];

  s.lightVarList = s.lightRequiredVarList.slice(0);
  s.accountConfigList = [
    'account',
    'allAccounts',
    'debugTracking',
    'visitor',
    'trackOffline',
    'offlineLimit',
    'offlineThrottleDelay',
    'offlineFilename',
    'usePlugins',
    'doPlugins',
    'configURL',
    'visitorSampling',
    'visitorSamplingGroup',
    'linkObject',
    'clickObject',
    'linkURL',
    'linkName',
    'linkType',
    'trackDownloadLinks',
    'trackExternalLinks',
    'trackClickMap',
    'trackInlineStats',
    'linkLeaveQueryString',
    'linkTrackVars',
    'linkTrackEvents',
    'linkDownloadFileTypes',
    'linkExternalFilters',
    'linkInternalFilters',
    'useForcedLinkTracking',
    'forcedLinkTrackingTimeout',
    'trackingServer',
    'trackingServerSecure',
    'ssl',
    'abort',
    'mobile',
    'dc',
    'lightTrackVars',
    'maxDelay',
    'expectSupplementalData',
    'AudienceManagement'
  ];

  for (var varNum = 0;varNum <= 250;varNum++) {
    if (varNum < 76) {
      s.accountVarList.push('prop' + varNum);
      s.lightVarList.push('prop' + varNum);
    }
    s.accountVarList.push('eVar' + varNum);
    s.lightVarList.push('eVar' + varNum);
    if (varNum < 6) {
      s.accountVarList.push('hier' + varNum);
    }
    if (varNum < 4) {
      s.accountVarList.push('list' + varNum);
    }
  }
  var technologyVarList = [
    'latitude',
    'longitude',
    'resolution',
    'colorDepth',
    'javascriptVersion',
    'javaEnabled',
    'cookiesEnabled',
    'browserWidth',
    'browserHeight',
    'connectionType',
    'homepage'
  ];
  s.accountVarList = s.accountVarList.concat(technologyVarList);
  s.requiredVarList = s.requiredVarList.concat(technologyVarList);

  // END VARIABLE REPLACEMENT

  // Defaults
  s.ssl = (w.location.protocol.toLowerCase().indexOf('https')>=0);
  s.charSet = "UTF-8";
  s.contextData = {};

  s.offlineThrottleDelay = 0;
  s.offlineFilename = "AppMeasurement.offline";

  // Timestamps that controls request throttling, and offline request storage
  s.lastRequestTimestamp = 0;
  s.lastEnqueuedPacketTimestamp = 0;
  s.lastOfflineWriteTimestamp = 0;
  s.lastOfflineDeletionTimestamp = 0;

  s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";

  // Aliases
  s.w = w;
  /**
   * @type {!Document}
   * @noalias
   */
  s.d = w.document;

  // Basic browser detection
  var
      e;
  try {
    s.isIE = (navigator.appName == "Microsoft Internet Explorer");
  } catch (e) {}

  /*********************************************************************
   * Function bodyClickRepropagate(): Repropagate a cloned click event
   *                                  from s.bct and s.bce or run a
   *                                  custom callback in s.bcf
   *     Nothing
   * Returns:
   *     Nothing
   * NOTE:
   *     Called by setTimeout and directly
   *********************************************************************/
  s.bodyClickRepropagate = function() {
    if (s.bodyClickRepropagateTimer) {
      w.clearTimeout(s.bodyClickRepropagateTimer);
      s.bodyClickRepropagateTimer = Null;
    }

    /*
     For future connections supporting abort, this would be a good place to call it.
     If offline storage is turned on, this would then save the pending request.
     If offline storage is turend on the forcedLinkTrackingTimeout could also be
     set shorter because requests would end up being saved.
     if (s.handlingRequest && s.currentConnection.abort) {
     s.currentConnection.abort();
     }
     */
    if ((s.bodyClickTarget) && (s.bodyClickEvent)) {
      s.bodyClickTarget.dispatchEvent(s.bodyClickEvent);
    }
    if (s.bodyClickFunction) {
      if (typeof(s.bodyClickFunction) == 'function') {
        s.bodyClickFunction();
      } else if ((s.bodyClickTarget) && (s.bodyClickTarget.href)) {
        s.d.location = s.bodyClickTarget.href;
      }
    }
    s.bodyClickTarget = s.bodyClickEvent = s.bodyClickFunction = 0;
  };

  // Setup the body when it exists
  s.setupBody = function() {
    s.b = s.d.body;

    if (s.b) {
      /*********************************************************************
       * Function bodyClick(e): <body> click handler
       *     e = Click event object
       * Returns:
       *     Nothing
       *********************************************************************/
      s.bodyClick = function(e) {
        var
            parent,
            x,
            newEvent,
            target,
            requestCount,
            anchor,
            href,
            e;

        /* If ClickMap plugin is running or this is a fake click event ignore */
        if (((s.d) && (s.d.getElementById("cppXYctnr"))) ||
            ((e) && (e['s_fe_' + s._in]))) {
          return;
        }

        /* If we don't have forced body click support turn off the flag */
        if (!s.blockingBodyClick) {
          s.useForcedLinkTracking=0;
          /* If we do have forced body click support but it's turned off remove the capture event listener and turn the support flag off */
        } else if(!s.useForcedLinkTracking){
          s.b.removeEventListener("click",s.bodyClick,true);
          s.blockingBodyClick = s.useForcedLinkTracking = 0;
          return
          /* If we do have forced body click support and it's turned on remove the bubble event listener */
        } else {
          s.b.removeEventListener("click",s.bodyClick,false);
        }

        s.clickObject = (e.srcElement ? e.srcElement : e.target);
        try {
          if ((s.clickObject) && ((!s.lastClickObject) || (s.lastClickObject != s.clickObject)) && ((s.clickObject.tagName) || (s.clickObject.parentElement) || (s.clickObject.parentNode))) {
            /*
             * Safeguard tracking a flood of clicks from fake or real events to the same object (s.lastClickObject checked above)
             * Only track a click to the same object after a 10 second timeout
             */
            var lastClickObject = s.lastClickObject = s.clickObject;
            if (s.lastClickObjectTimeout) {
              clearTimeout(s.lastClickObjectTimeout);
              s.lastClickObjectTimeout = 0;
            }
            s.lastClickObjectTimeout = setTimeout(function () {
              // Only clear if we are still dealing with the samek object
              if (s.lastClickObject == lastClickObject) {
                s.lastClickObject = 0;
              }
            },10000);

            requestCount = s.getPendingRequestCount();
            s.track();

            /* If we just tracked the click, have forced body click support, it's turned on, and we have a DOM element that can dispatch events... */
            if ((requestCount < s.getPendingRequestCount()) && (s.useForcedLinkTracking) && (e.target)) {
              /*
               We only do the automatic forced link tracking for
               1. A and AREA tags
               2. href that is not #*, about:*, opera:*, or javascript:*
               3. link-target attribute that is the current window
               */
              anchor = e.target;
              while ((anchor) && (anchor != s.b) && (anchor.tagName.toUpperCase() != "A") && (anchor.tagName.toUpperCase() != "AREA")) {
                anchor = anchor.parentNode;
              }
              if (anchor) {
                href = anchor.href;
                if (!s.hrefSupportsLinkTracking(href)) {
                  href = 0;
                }
                target = anchor.target;
                if ((e.target.dispatchEvent) && (href) && ((!target) || (target == '_self') || (target == '_top') || (target == '_parent') || ((w.name) && (target == w.name)))) {
                  /* Create the click event */
                  try {
                    newEvent = s.d.createEvent("MouseEvents");
                  } catch (e) {
                    newEvent = new w['MouseEvent'];
                  }
                  if (newEvent) {
                    try {
                      newEvent.initMouseEvent(
                          "click",
                          e.bubbles,
                          e.cancelable,
                          e.view,
                          e.detail,
                          e.screenX,
                          e.screenY,
                          e.clientX,
                          e.clientY,
                          e.ctrlKey,
                          e.altKey,
                          e.shiftKey,
                          e.metaKey,
                          e.button,
                          e.relatedTarget
                      );
                    } catch (e) {
                      newEvent = 0;
                    }
                    if (newEvent) {
                      /* Flag as a fake event that we should not handle when it's repropagated */
                      newEvent['s_fe_' + s._in] = newEvent['s_fe'] = 1;

                      /* Kill the event propagation */
                      e.stopPropagation();
                      if (e.stopImmediatePropagation) {
                        e.stopImmediatePropagation();
                      }
                      e.preventDefault();

                      /* Store the target and cloned event to use later to repropagate the click */
                      s.bodyClickTarget = e.target;
                      s.bodyClickEvent = newEvent;
                    }
                  }
                }
              }
            }
          } else {
            s.clickObject = 0;
          }
        } catch (x) {
          s.clickObject = 0;
        }
      };

      // Add event handlers
      if ((s.b) && (s.b.attachEvent)) {
        s.b.attachEvent('onclick',s.bodyClick);
      } else if ((s.b) && (s.b.addEventListener)) {
        /* Setup forced link tracking event handler if supported */
        if ((navigator) && (
            ((navigator.userAgent.indexOf('WebKit') >= 0) && (s.d.createEvent)) ||
            ((navigator.userAgent.indexOf('Firefox/2') >= 0) && (w['MouseEvent']))
            )) {
          s.blockingBodyClick     = 1;
          s.useForcedLinkTracking = 1;
          s.b.addEventListener('click',s.bodyClick,true)
        }
        s.b.addEventListener('click',s.bodyClick,false);
      }
    } else {
      setTimeout(s.setupBody,30);
    }
  }
  s.setupBody();
}

/*********************************************************************
 * Function getInstance(account): Finds instance for an account
 *     account = Account for instance
 * Returns:
 *     Instance
 *
 * @constructor
 * @noalias
 *********************************************************************/
function s_gi(account) {
  /**
   * @type {AppMeasurement}
   * @noalias
   */
  var s;
  var
      instanceList = window.s_c_il,
      instanceNum,
      accountSet,
      accountList = account.split(","),
      allAccounts,
      accountNum,subAccountNum,
      found = 0;
  if (instanceList) {
    instanceNum = 0;
    while ((!found) && (instanceNum < instanceList.length)) {
      s = instanceList[instanceNum];
      if (s._c == "s_c") {
        if ((s.account) || (s.oun)) {
          if ((s.account) && (s.account == account)) {
            found = 1;
          } else {
            accountSet = (s.account ? s.account : s.oun);
            allAccounts = (s.allAccounts ? s.allAccounts : accountSet.split(","));
            for (accountNum = 0;accountNum < accountList.length;accountNum++) {
              for (subAccountNum = 0;subAccountNum < allAccounts.length;subAccountNum++) {
                if (accountList[accountNum] == allAccounts[subAccountNum]) {
                  found = 1;
                }
              }
            }
          }
        }
      }
      instanceNum++;
    }
  }
  if (!found) {
    s = new AppMeasurement();
  }
  if (s.setAccount) {
    s.setAccount(account);
  } else if (s.sa) {
    s.sa(account);
  }
  return s;
}
AppMeasurement['getInstance'] = s_gi;

/*********************************************************************
 * Globals
 *********************************************************************/
if (!window['s_objectID']) {
  window['s_objectID'] = 0;
}

/*********************************************************************
 * Function processGetInstanceCallQueue(): Process the s_gi call queue
 *     that was recorded by Tag Management prior to library being loaded.
 * Returns:
 *     Nothing
 *********************************************************************/
function s_pgicq() {
  var w = window,
      callQueue = w.s_giq,
      ia,
      callInfo,
      s;
  if(callQueue) {
    for(ia=0; ia<callQueue.length; ia++) {
      callInfo = callQueue[ia];
      s = s_gi(callInfo['oun']);
      s.setAccount(callInfo['un']);
      s.setTagContainer(callInfo['tagContainerName']);
    }
  }
  w.s_giq = 0;
}

s_pgicq();
