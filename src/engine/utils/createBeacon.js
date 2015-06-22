var encodeObjectToURI = require('./uri/encodeObjectToURI');
var clientInfo = require('./clientInfo');

var getBeaconIframesContainer = function() {
  if (this.containerIframe) {
    return this.containerIframe;
  }
  this.containerIframe = document.createElement('iframe');
  this.containerIframe.style.display = 'none';
  document.body.appendChild(this.containerIframe);
  return this.containerIframe;
};

var createIframeBeacon = function(url, data, callback) {
  var childFrame = document.createElement('iframe');
  var form = document.createElement('form');
  var input = document.createElement('input');
  input.name = 'data';
  input.value = data;
  form.action = url;
  form.method = 'POST';

  form.appendChild(input);
  getBeaconIframesContainer().contentDocument.body.appendChild(childFrame);
  childFrame.contentDocument.body.appendChild(form);

  childFrame.onload = function() {
    childFrame.remove();
    if (callback) {
      callback();
    }
  };
  form.submit();
};

var createBeacon = function(config, successCallback, failCallback) {
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
      request += '?' + encodeObjectToURI(config.beaconData);
    }
    if (clientInfo.browser === 'IE') {
      request = request.substring(0, 2047);
    }
    connection = new Image;
    connection.alt = "";
  }

  if (config.type === 'form') {
    createIframeBeacon(config.url, JSON.stringify(config.beaconData), successCallback);
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
    connection.send(JSON.stringify(config.beaconData));
  } else if (config.type === 'image') {
    connection.src = request;
  }
};

module.exports = createBeacon;
