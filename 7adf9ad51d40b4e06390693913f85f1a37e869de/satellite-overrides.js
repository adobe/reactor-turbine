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
