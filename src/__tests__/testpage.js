(function() {

  var domReady = (function (ready) {

    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , loaded = /^loade|^c/.test(doc.readyState);

    function flush(f) {
      loaded = 1;
      while (f = fns.shift()) f();
    }

    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f);
      flush();
    }, f);


    hack && doc.attachEvent(onreadystatechange, (fn = function () {
      if (/^c/.test(doc.readyState)) {
        doc.detachEvent(onreadystatechange, fn);
        flush();
      }
    }));

    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left');
            } catch (e) {
              return setTimeout(function () {
                ready(fn);
              }, 50);
            }
            fn();
          }();
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn);
      });
  }());

  var addEventListener = window.addEventListener ?
    function(node, evt, cb){ node.addEventListener(evt, cb, false); } :
    function(node, evt, cb){ node.attachEvent('on' + evt, cb); };

  var page = {
    queue: [],
    messages: takeOverConsole(),
    mergeConfig: mergeConfig,
    waitForDOMLoaded: waitForDOMLoaded,
    waitForContentLoaded: waitForContentLoaded,
    waitFor: waitFor,
    waitForLog: waitForLog,
    waitForCondition: waitForCondition,
    waitForImageRequest: waitForImageRequest,
    evaluate: evaluate,
    execute: evaluate,
    assertLogged: assertLogged,
    assertNotLogged: assertNotLogged,
    start: start
  };

  window.TestPage = page;

  function map(arr, func, context) {
    var ret = [];
    for (var i = 0, len = arr.length; i < len; i++)
      ret.push(func.call(context, arr[i], i, arr))
    return ret;
  }

  function waitForDOMLoaded() {
    page.queue.push(function (next) {
      domReady(function () {
        next();
      });
    });
    return page;
  }

  function waitForContentLoaded() {
    page.queue.push(function(next) {
      addEventListener(window, 'load', next);
    });
    return page;
  }

  function waitFor(timeout) {
    page.queue.push(function (next) {
      setTimeout(next, timeout);
    });
    return page;
  }

  function waitForCondition(fn, timeout) {
    timeout = timeout || 4000;
    var start;
    page.queue.push(check);
    function check(next) {
      start = start || +new Date;
      if (fn()) {
        next();
      } else {
        var now = +new Date;
        if (now - start > timeout) {
          throw new Error('Timed out waiting for condition ' + fn);
        }
        setTimeout(function () {
          check(next);
        }, 250);
      }
    }

    return page;
  }

  function hasLog(msg) {
    return indexOfLog(msg) !== -1;
  }

  function indexOfLog(msg) {
    var logs = page.messages.log;
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      if (typeof msg === 'string' && log.indexOf(msg) !== -1) {
        return i;
      } else if (msg instanceof RegExp && log.match(msg)) {
        return i;
      }
    }
    return -1;
  }

  function contains(arr, obj) {
    return indexOf(arr, obj) !== -1;
  }

  function indexOf(arr, obj) {
    if (arr.indexOf)
      return arr.indexOf(obj);
    for (var i = arr.length; i--;)
      if (obj === arr[i])
        return i;
    return -1;
  }

  function hasLogsInOrder(patterns) {
    var indices = map(patterns, function (pat) {
      return indexOfLog(pat);
    });
    if (contains(indices, -1)) return false;
    var sorted = indices.slice(0).sort(function (a, b) {
      return a - b;
    });
    return arrayEqual(indices, sorted);
  }

  function arrayEqual(one, other) {
    if (one.length !== other.length) return false;
    for (var i = 0; i < one.length; i++) {
      if (one[i] !== other[i]) return false;
    }
    return true;
  }

  function waitForLog(msg) {
    var start;
    page.queue.push(check);
    function check(next) {
      start = start || +new Date;
      if (hasLog(msg)) {
        next();
      } else {
        var now = +new Date;
        if (now - start > 4000) {
          throw new Error('Timed out waiting for ' + msg);
        }
        setTimeout(function () {
          check(next);
        }, 250);
      }
    }

    return page;
  }

  function assertLogged() {
    var msgs = Array.prototype.slice.apply(arguments);
    page.queue.push(function (next) {
      if (!hasLogsInOrder(msgs)) {
        throw new Error('Expected to have logs in this order ' + msgs.join(','));
      }
      next();
    });
    return page;
  }

  function assertNotLogged(msg) {
    page.queue.push(function (next) {
      if (hasLog(msg)) {
        throw new Error('Expected not to have logged: ' + msg);
      }
      next();
    });
    return page;
  }

  function evaluate(cb) {
    page.queue.push(function (next) {
      cb(page);
      next();
    });
    return page;
  }

  var queueStarted = false;

  function start() {
    if (queueStarted) {
      return;
    }

    queueStarted = true;

    var queue = page.queue;
    var idx = 0;

    function next() {
      var cb = queue[idx++];
      if (!cb) return done();
      cb(next);
    }

    next();
  }

  function takeOverConsole() {
    var consoleMessages = {
      log: [],
      error: [],
      warn: [],
      info: []
    };
    var console = window.console;
    if (!console) {
      console = window.console = {
        log: function () {
        }
        , warn: function () {
        }
        , error: function () {
        }
        , info: function () {
        }
      };
    }
    function intercept(method) {
      var original = console[method];
      console[method] = function () {
        var message = Array.prototype.slice.apply(arguments).join(' ');
        consoleMessages[method].push(message);
        if (original && original.apply) {
          // Do this for normal browsers
          original.apply(console, arguments);
        } else if (original) {
          // Do this for IE
          original(message);
        }
      };
    }

    var methods = ['log', 'warn', 'error', 'info'];
    for (var i = 0; i < methods.length; i++)
      intercept(methods[i])

    return consoleMessages;
  }

  function mergeConfig(configReplacements) {
    var config = window._satellite.getConfig();

    for (var key in configReplacements) {
      config[key] = configReplacements[key];
    }

    window._satellite.getConfig = function() {
      return config;
    };

    return page;
  }

  setupFakeImageObject();
  function setupFakeImageObject() {

    function ImageRequest(src) {
      if (src) {
        console.log('Image request:', src);
        this.parse(src);
      }
    }

    ImageRequest.prototype.parse = function (src) {
      var parts = src.split('?');
      this.href = parts[0];
      if (parts[1]) {
        this.params = this.parseParams(parts[1]);
      }
    };
    ImageRequest.prototype.parseParams = function (params) {
      var ret = {};
      params = params.split('&');
      for (var i = 0; i < params.length; i++) {
        var parts = params[i].split('=');
        ret[parts[0]] = parts[1];
      }
      return ret;
    };

    function FakeImage() {
      var image = this;
      this.style = {};
      // We are assuming that they are going to set the src
      // immediately after they call the image constructor
      setTimeout(function () {
        var imgReq = new ImageRequest(image.src);
        console.log("Fake Image Request:", image.src);
        FakeImage.requests.push(imgReq);
      }, 0);
    }

    FakeImage.requests = [];
    Image = FakeImage; // Yes, I am overriding the global variable
  }

  interceptDocumentCreateElement();
  function interceptDocumentCreateElement() {
    var original = document.createElement;

    document.createElement = function (tag) {
      if (tag === 'img') {
        return new Image();
      } else {
        return original.apply(document, arguments);
      }
    };
  }


  setupElementAppendChild();
  function setupElementAppendChild() {
    var Element = window.Element || window.HTMLElement;
    var org = Element.prototype.appendChild;
    Element.prototype.appendChild = function (elm) {
      try {
        return org.call(this, elm);
      } catch (e) {
        if (elm instanceof Image) {
          // it was the fake image :)
        } else {
          console.warn('You tried to appendChild an object thats not an element. ' + e);
        }
      }

    };
  }

  function hasImageRequest(fun) {
    if (!Image.requests) return false;
    for (var i = 0; i < Image.requests.length; i++) {
      var req = Image.requests[i];
      try {
        if (fun(req)) return true;
      } catch (e) {
      }
    }
    return false;
  }

  function log(obj) {
    if (parent) parent.console.log(obj);
  }

  function waitForImageRequest(fun, timeout) {
    timeout = timeout || 4000;
    var start;
    page.queue.push(check);
    function check(next) {
      start = start || +new Date;
      if (hasImageRequest(fun)) {
        next();
      } else {
        var now = +new Date;
        if (now - start > timeout) {
          throw new Error('Timed out waiting for image request ' + fun);
        }
        setTimeout(function () {
          check(next);
        }, 250);
      }
    }

    return page;
  }

  window.onerror = function (err, url, line) {
    fail(err + ' at ' + url + ' on line ' + line);
  };
})();
