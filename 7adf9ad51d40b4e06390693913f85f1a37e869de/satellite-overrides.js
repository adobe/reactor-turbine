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
