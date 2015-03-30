// Dynamic Tag Management Library
// Property: dtm.aaronhardy.com
// All code and conventions are protected by copyright
// Adobe Systems Incorporated

(function(window, document, undefined) {
// Satellite
// =========
//
// Satellite *core*. Yeah, you want it.
//
// In this first section, we have a some useful utility functions.
  var ToString = Object.prototype.toString

  var Overrides = window._satellite && window._satellite.override

  function assert(cond, msg){
    if (!cond){
      throw new Error(msg || "Assertion Failure")
    }
  }

  var SL = {
    initialized: false,

    // `$data(elm, prop, [val])`
    // ----------------------------
    //
    // Our own `$data()` method, [a la jQuery](http://api.jquery.com/jQuery.data/)
    // , used to get or set
    // properties on DOM elements without going insane.
    // `uuid` and `dataCache` are used by `$data()`
    //
    // Parameters:
    //
    // - `elm` - the element to get or set a property to
    // - `prop` - the property name
    // - `val` - the value of the property, if omitted, the method will
    //      return the existing value of the property, if any
    $data: function(elm, prop, val){
      var __satellite__ = '__satellite__'
      var cache = SL.dataCache
      var uuid = elm[__satellite__]
      if (!uuid) uuid = elm[__satellite__] = SL.uuid++
      var datas = cache[uuid]
      if (!datas) datas = cache[uuid] = {}
      if (val === undefined)
        return datas[prop]
      else
        datas[prop] = val
    },
    uuid: 1,
    dataCache: {},

    // `keys(object)`
    // --------------
    //
    // Return all keys of an object in an array.
    keys: function(obj){
      var ret = []
      for (var key in obj) ret.push(key)
      return ret
    },

    // `values(object)`
    // ----------------
    //
    // Return all values of an object in an array.
    values: function(obj){
      var ret = []
      for (var key in obj) ret.push(obj[key])
      return ret
    },

    // `isArray(thing)`
    // --------------
    //
    // Returns whether the given thing is an array.
    isArray: Array.isArray || function(thing){
      return ToString.apply(thing) === "[object Array]"
    },

    // `isObject(thing)`
    // -----------------
    //
    // Returns whether the given thing is a plain object.
    isObject: function(thing){
      return thing != null && !SL.isArray(thing) &&
          typeof thing === 'object'
    },

    // `isString(thing)`
    // -----------------
    //
    // Returns whether thing is a string
    isString: function(thing){
      return typeof thing === 'string'
    },

    // `isNumber(thing)`
    // -----------------
    //
    // Returns whether thing is a number
    isNumber: function(thing){
      return ToString.apply(thing) === '[object Number]' && !SL.isNaN(thing)
    },

    // `isNaN(thing)`
    // --------------
    //
    // Return whether thing is NaN
    isNaN: function(thing){
      return thing !== thing
    },

    // `isRegex(thing)`
    // ----------------
    //
    // Returns whether thing is a RegExp object
    isRegex: function(thing){
      return thing instanceof RegExp
    },

    // `isLinkTag(thing)`
    // ----------------
    //
    // Returns whether thing is a DOM link element
    isLinkTag: function(thing){
      return !!(thing && thing.nodeName &&
      thing.nodeName.toLowerCase() === 'a')
    },

    // `each(arr, func, [context])`
    // ------------------
    //
    // A handy method for array iteration wo having to write a for-loop.
    //
    // Parameters:
    //
    // - `arr` - an array
    // - `func(item, index, arr)` - a function which accepts each item in the array
    //      once. I takes these arguments
    //      * `item` - an item
    //      * `index` - the array index of said item
    //      * `arr` - the array
    // - `context` - the context to be bound to `func` when it is invoked
    each: function(arr, func, context){
      for (var i = 0, len = arr.length; i < len; i++)
        func.call(context, arr[i], i, arr)
    },

    // `map(arr, func)`
    // ----------------
    //
    // A handy method for mapping an array to another array using a 1-to-1 mapping
    // for each element
    //
    // Parameters:
    //
    // Parameters are the same as `SL.each`, except that `func` is expected to return
    // a the value you want in the corresponding index of the returned array.
    map: function(arr, func, context){
      var ret = []
      for (var i = 0, len = arr.length; i < len; i++)
        ret.push(func.call(context, arr[i], i, arr))
      return ret
    },

    // `filter(arr, cond)`
    // -------------------
    //
    // Handy method for take an array and filtering down to a subset of the elements.
    //
    // Parameters:
    //
    // Parameters are the same as `SL.each` except the second argument is `cond`
    // instead of `func` and it is expected to return a truthy value respresenting
    // whether to include this item in the return array or not.
    filter: function(arr, cond, context){
      var ret = []
      for (var i = 0, len = arr.length; i < len; i++){
        var item = arr[i]
        if (cond.call(context, item, i, arr))
          ret.push(item)
      }
      return ret
    },

    // `any(arr, cond, context)`
    // -------------------------
    //
    // Another array helper function. Returns true if `cond(item)` returns true
    // for any item in the array.
    any: function(arr, cond, context){
      for (var i = 0, len = arr.length; i < len; i++){
        var item = arr[i]
        if (cond.call(context, item, i, arr))
          return true
      }
      return false
    },

    // `every(arr, cond, context)`
    // ---------------------------
    //
    // Another array helper function. Returns true if `cond(item)` returns true
    // for every item in the array.
    every: function(arr, cond, context){
      var retval = true
      for (var i = 0, len = arr.length; i < len; i++){
        var item = arr[i]
        retval = retval && cond.call(context, item, i, arr)
      }
      return retval
    },

    // `contains(arr, obj)`
    // -----------------------
    //
    // Tells you whether an array contains an object.
    //
    // Parameters:
    //
    // - `arr` - said array
    // - `obj` - said object
    contains: function(arr, obj){
      return SL.indexOf(arr, obj) !== -1
    },

    // `indexOf(arr, obj)`
    // -------------------
    //
    // Return the index of an object within an array.
    //
    // Parameters;
    //
    // - `arr` - said array
    // - `obj` - said object
    indexOf: function(arr, obj){
      if (arr.indexOf)
        return arr.indexOf(obj)
      for (var i = arr.length; i--;)
        if (obj === arr[i])
          return i
      return -1
    },


    // `find(arr, obj)`
    // -------------------
    //
    // Return the index of an object within an array.
    //
    // Parameters;
    //
    // - `arr` - said array
    // - `obj` - said object
    find: function(arr, cond, context){
      var ret = []
      if (!arr) return null
      for (var i = 0, len = arr.length; i < len; i++){
        var item = arr[i]
        if (cond.call(context, item, i, arr))
          return item
      }
      return null
    },

    // `textMatch(str, str_or_regex)`
    // ------------------------------
    //
    // Perform a string match based on another string or a regex.
    //
    // Parameters:
    //
    // `str` - the input string to be matched
    // `str_or_regex` - the pattern to match against, if this is a string, it requires exact match, if
    //      it's a regex, then it will do regex match
    textMatch: function(str, pattern){
      if (pattern == null) throw new Error('Illegal Argument: Pattern is not present')
      if (str == null) return false
      if (typeof pattern === 'string') return str === pattern
      else if (pattern instanceof RegExp) return pattern.test(str)
      else return false
    },

    // `stringify(obj, [seenValues])`
    // ------------------------------
    //
    // Stringify any type of object.
    //
    // Parameters:
    //
    // `obj` - the object that needs to be stringified
    // `seenValues` - pool of parsed resources; used to avoid circular references;
    stringify: function(obj, seenValues){
      seenValues = seenValues || [];
      if (SL.isObject(obj)) {
        if (SL.contains(seenValues, obj)) {
          return '<Cycle>';
        } else {
          seenValues.push(obj);
        }
      }

      if (SL.isArray(obj)) {
        return '[' + SL.map(obj, function(value){
              return SL.stringify(value, seenValues)
            }).join(',') + ']';
      } else if (SL.isString(obj)) {
        return '"' + String(obj) + '"';
      } if (SL.isObject(obj)) {
        var data = [];
        for (var prop in obj) {
          data.push(prop + ': ' + SL.stringify(obj[prop], seenValues));
        }
        return '{' + data.join(', ') + '}';
      } else {
        return String(obj);
      }
    },

    // `trim(str)`
    // -----------
    //
    // Trims a string.
    //
    // Parameters:
    //
    // `str` - the input string to be trimmed.
    trim: function(str){
      if (str == null) return null
      if (str.trim){
        return str.trim()
      }else{
        return str.replace(/^ */, '').replace(/ *$/, '')
      }
    },

    // `bind(func, context)`
    // ---------------------
    //
    // Binds a context permanently to a context. The returned function is a new function
    // which - when called - will call the passed in function with `context` bound to it.
    //
    // Parameters:
    //
    // `func` - a function
    // `context` - an object to be bound as the context of this function
    bind: function(func, context) {
      return function() {
        return func.apply(context, arguments)
      }
    },

    // `throttle(fn, delay)`
    // ---------------------
    //
    // *Throttles* a function `fn` to be called no more than once during the interval
    // specified by `delay`.
    //
    // Parameters:
    //
    // - `fn` - a function
    // - `delay` - delay in milliseconds
    //
    // *Throttle function stolen from
    //     <http://remysharp.com/2010/07/21/throttling-function-calls/>*
    throttle: function(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    },

    // `domReady(callback)`
    // --------------------
    //
    // Registers a callback to be called when the DOM is fully parsed and loaded.
    //
    // Parameters:
    //
    // - `callback` - a function to be called at `domready`
    //
    // *domReady is borrowed from <https://github.com/ded/domready>*
    domReady: (function (ready) {

      var fns = [], fn, f = false
          , doc = document
          , testEl = doc.documentElement
          , hack = testEl.doScroll
          , domContentLoaded = 'DOMContentLoaded'
          , addEventListener = 'addEventListener'
          , onreadystatechange = 'onreadystatechange'
          , loaded = /^loade|^c/.test(doc.readyState)

      function flush(f) {
        loaded = 1
        while (f = fns.shift()) f()
      }

      doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
        doc.removeEventListener(domContentLoaded, fn, f)
        flush()
      }, f)


      hack && doc.attachEvent(onreadystatechange, (fn = function () {
        if (/^c/.test(doc.readyState)) {
          doc.detachEvent(onreadystatechange, fn)
          flush()
        }
      }))

      return (ready = hack ?
          function (fn) {
            self != top ?
                loaded ? fn() : fns.push(fn) :
                function () {
                  try {
                    testEl.doScroll('left')
                  } catch (e) {
                    return setTimeout(function() { ready(fn) }, 50)
                  }
                  fn()
                }()
          } :
          function (fn) {
            loaded ? fn() : fns.push(fn)
          })
    }()),

    // `loadScript(url, [callback])`
    // -----------------------------
    //
    // Load an external script.
    //
    // Parameters:
    //
    // - `url` - the URL of the script
    // - `callback`(optional) - the function to be called after the script has loaded.
    loadScript: function(url, callback){
      var script = document.createElement('script')
      SL.scriptOnLoad(url, script, callback)
      script.src = url
      document.getElementsByTagName('head')[0]
          .appendChild(script)
    },

    scriptOnLoad: function(url, script, callback){
      function cb(err){
        if (err) SL.logError(err)
        if (callback) callback(err)
      }
      if ('onload' in script){
        script.onload = function(){
          cb()
        }
        script.onerror = function(){
          cb(new Error('Failed to load script ' + url))
        }
      }else if ('readyState' in script){
        script.onreadystatechange = function(){
          var rs = script.readyState
          if (rs === 'loaded' || rs === 'complete'){
            script.onreadystatechange = null
            cb()
          }
        }
      }
    },

    // `loadScriptOnce(url, [callback])`
    // -----------------------------
    //
    // Load an external script only if it hasn't been loaded until now.
    //
    // Parameters:
    //
    // - `url` - the URL of the script
    // - `callback`(optional) - the function to be called after the script has loaded.
    loadScriptOnce: function(url, callback){
      if (SL.loadedScriptRegistry[url]) return

      SL.loadScript(url, function(err) {
        if (!err) {
          SL.loadedScriptRegistry[url] = true
        }

        if (callback) callback(err)
      })
    },

    loadedScriptRegistry: {},

    // `loadScriptSync(url)`
    // -----------------------------
    //
    // Load an external script using document.write.
    //
    // Parameters:
    //
    // - `url` - the URL of the script
    loadScriptSync: function(url){
      if (!document.write) {
        SL.notify('Cannot load sync the "' + url + '" script because "document.write" is not available', 1)
        return
      }

      if (SL.domReadyFired){
        SL.notify('Cannot load sync the "' + url + '" script after DOM Ready.', 1)
        return
      }

      document.write('<script src="' + url + '"></scr' + 'ipt>');
    },

    // `pushAsyncScript(callback)`
    // -------------------
    //
    // Called by an async custom user script.
    pushAsyncScript: function(cb){
      SL.tools['default'].pushAsyncScript(cb)
    },

    // `pushBlockingScript(callback)`
    // ------------------------------
    //
    // Called by a blocking custom user script.
    pushBlockingScript: function(cb){
      SL.tools['default'].pushBlockingScript(cb)
    },

    // `addEventHandler(elm, evt, callback)`
    // -------------------------------------
    //
    // Register an event handler for a element
    //
    // Parameters:
    //
    // - `elm` - the element in question
    // - `evt` - the event type to listen to
    // - `callback` - callback function
    addEventHandler: window.addEventListener ?
        function(node, evt, cb){ node.addEventListener(evt, cb, false) } :
        function(node, evt, cb){ node.attachEvent('on' + evt, cb) },

    // `preventDefault(evt)`
    // ---------------------
    //
    // Prevent the default browser behavior for this event
    //
    // Parameters:
    //
    // `evt` - the event triggered
    preventDefault: window.addEventListener ?
        function(e){ e.preventDefault() } :
        function(e){ e.returnValue = false },

    // `stopPropagation(evt)`
    // ----------------------
    //
    // Cross-browser `stopPropagation`
    //
    // Parameters:
    //
    // `evt` - the event triggered
    stopPropagation: function(e){
      e.cancelBubble = true
      if (e.stopPropagation) e.stopPropagation()
    },

    // `containsElement(elm1, elm2)`
    // ----------------------
    //
    // Given DOM elements `elm1` and `elm2`, returns whether `elm1` contains `elm2`.
    //
    // Parameters:
    //
    // `elm1` - the possible parent
    // `elm2` - the possible child
    //
    // *Ripped from <http://stackoverflow.com/questions/6130737/mouseenter-without-jquery>*
    containsElement: function(container, maybe) {
      return container.contains ? container.contains(maybe) :
          !!(container.compareDocumentPosition(maybe) & 16);
    },

    // `matchesCss(css, elm)`
    // ----------------------
    //
    // Returns whether a DOM element matches a given css selector
    //
    // Parameters:
    //
    // - `css` - the CSS selector
    // - `elm` - the element
    matchesCss: (function(docEl){

      function simpleTagMatch(selector, elm){
        var tagName = elm.tagName
        if (!tagName) return false
        return selector.toLowerCase() === tagName.toLowerCase()
      }

      var matches =
          docEl.matchesSelector ||
          docEl.mozMatchesSelector ||
          docEl.webkitMatchesSelector ||
          docEl.oMatchesSelector ||
          docEl.msMatchesSelector
      if (matches) {
        return function(selector, elm){
          if (elm === document || elm === window) return false
          try{
            return matches.call(elm, selector)
          }catch(e){
            return false
          }
        }
      } else if(docEl.querySelectorAll) {
        return function(selector, elm) {
          var parent = elm.parentNode
          if (!parent) return false
          if (selector.match(/^[a-z]+$/i)){
            return simpleTagMatch(selector, elm)
          }
          try{
            var nodeList = elm.parentNode.querySelectorAll(selector)
            for (var i = nodeList.length; i--;)
              if (nodeList[i] === elm) return true
          }catch(e){
            //
          }
          return false
        }
      }else{
        return function(selector, elm){
          if (selector.match(/^[a-z]+$/i)){
            return simpleTagMatch(selector, elm)
          }
          try{
            return SL.Sizzle.matches(selector, [elm]).length > 0
          }catch(e){
            return false
          }
        }
      }
    }(document.documentElement)),

    // `cssQuery(css)`
    // ---------------
    //
    // Return a list of element matching the given css selector
    //
    // Parameters:
    //
    // - `css` - the CSS selector
    cssQuery: (function(doc){
      if (doc.querySelectorAll) {
        return function(css, cb){
          var results
          try{
            results = doc.querySelectorAll(css)
          }catch(e){
            results = []
          }
          cb(results)
        }
      }else{
        return function(css, cb){
          if (SL.Sizzle){
            var results
            try{
              results = SL.Sizzle(css)
            }catch(e){
              results = []
            }
            cb(results)
          }else
            SL.sizzleQueue.push([css, cb])
        }
      }
    })(document),

    // `hasAttr(elem, attrName)`
    // ---------------
    //
    // Check if attribute is defined on element
    //
    // Parameters:
    //
    // - `elem` - the DOM element
    // - `attrName` - attribute name
    hasAttr: function(elem, attrName) {
      return elem.hasAttribute ? elem.hasAttribute(attrName) : elem[attrName] !== undefined;
    },

    // `inherit(subClass, superClass)`
    // -------------------------------
    //
    // Make `subClass` inherit `superClass`.
    //
    // Parameters:
    //
    // - `subClass` - a Javascript function representing a constructor - the inheritor
    // - `superClass` - another constructor - the one to inherit from
    inherit: function(subClass, superClass){
      var f = function() {}
      f.prototype = superClass.prototype
      subClass.prototype = new f()
      subClass.prototype.constructor = subClass
    },

    // `extend(dst, src)`
    // ----------------
    //
    // Extend an object with the properties of another.
    //
    // Parameters:
    //
    // - `dst` - object to copy to
    // - `src` - object to copy from
    extend: function(dst, src){
      for (var prop in src)
        if (src.hasOwnProperty(prop))
          dst[prop] = src[prop]
    },

    // `toArray(arrayLike)`
    // --------------------
    //
    // Converts an array-like object to an array.
    //
    // Parameters:
    //
    // - `arrayLike` - an array-like object, meaning it has a length property
    //   which is a number
    toArray: (function(){
      try {
        var slice = Array.prototype.slice
        slice.call( document.documentElement.childNodes, 0 )[0].nodeType;
        return function(thing){
          return slice.call(thing, 0)
        }
        // Provide a fallback method if it does not work
      } catch( e ) {
        return function(thing){
          var ret = []
          for (var i = 0, len = thing.length; i < len; i++)
            ret.push(thing[i])
          return ret
        }
      }
    })(),

    // `equalsIgnoreCase(str1, str2)`
    // ------------------------------
    //
    // Returns true iff str1 and str2 are equal ignoring case.
    //
    // Parameters:
    //
    // * `str1` - the first string
    // * `str2` - the second string
    equalsIgnoreCase: function(str1, str2){
      if (str1 == null) return str2 == null
      if (str2 == null) return false
      return String(str1).toLowerCase() === String(str2).toLowerCase()
    },

    // `poll(fn, [freq], [max_retries])`
    // ------------------
    //
    // Runs `fn` for every `freq` ms. `freq` defaults to 1000. If any
    // invocation of `fn()` returns true, polling will stop.
    // The polling will stop if the number or retries exceeds the
    // provided `max_retries`.
    //
    // Parameters:
    //
    // * `fn` - function to be called repeatedly
    // * `freq` - frequency to call the function
    // * `max_retries` - number of times to retry
    poll: function(fn, freq, max_retries){
      var retries = 0

      freq = freq || 1000
      check()

      function check(){
        if (SL.isNumber(max_retries) && retries++ >= max_retries) {
          return;
        }

        if (!fn()){
          setTimeout(check, freq)
        }
      }
    },
    // `escapeForHtml(str)`
    // --------------------
    //
    // Escapes a string for being used in an HTML context. Returns
    // the escaped version of the string. Replaces the characters
    // `&` `<` `>` `"` `'` and `/`.
    //
    // Parameters:
    //
    // * `str` - the string to be escaped
    escapeForHtml: function(str){
      if (!str) return str
      return str
          .replace(/\&/g, '&amp;')
          .replace(/\</g, '&lt;')
          .replace(/\>/g, '&gt;')
          .replace(/\"/g, '&quot;')
          .replace(/\'/g, '&#x27;')
          .replace(/\//g, '&#x2F;')
    }
  }

// The available tools to use.
  SL.availableTools = {}

// The avaliable event emitters to use.
  SL.availableEventEmitters = []

// The names of the events which can only fire once.
  SL.fireOnceEvents = ['condition', 'elementexists']

// Initialize all event emitters.
  SL.initEventEmitters = function(){
    SL.eventEmitters = SL.map(SL.availableEventEmitters, function(ee){
      return new ee()
    })
  }

// Call `registerElements` on all event emitters.
  SL.eventEmitterBackgroundTasks = function(){
    SL.each(SL.eventEmitters, function(ee){
      if ('backgroundTasks' in ee)
        ee.backgroundTasks()
    })
  }

// Initialize all tools.
  SL.initTools = function(toolSpecs){
    var tools = { 'default': new DefaultTool() }
    var euCookieName = SL.settings.euCookieName || 'sat_track'
    for (var id in toolSpecs){
      var toolSpec, ctr, tool
      toolSpec = toolSpecs[id]
      if (toolSpec.euCookie){
        var cookieSet = SL.readCookie(euCookieName) !== 'true'
        if (cookieSet) continue
      }
      ctr = SL.availableTools[toolSpec.engine]
      if (!ctr){
        var available = []
        for (var key in SL.availableTools){
          available.push(key)
        }
        throw new Error('No tool engine named ' + toolSpec.engine +
        ', available: ' + available.join(',') + '.')
      }
      tool = new ctr(toolSpec)
      tool.id = id
      tools[id] = tool
    }
    return tools
  }

// Pre-process arguments (variable substitutions and lower-casing) before
// feeding them to the tools.
  SL.preprocessArguments = function(args, elm, evt, forceLowerCase){
    if (!args) return args
    return preprocessArray(args, forceLowerCase)
    function forceLowerCaseIfNeeded(value) {
      return forceLowerCase && SL.isString(value) ? value.toLowerCase() : value
    }

    function preprocessObject(obj){
      var ret = {}
      for (var key in obj){
        if (obj.hasOwnProperty(key)){
          var value = obj[key]
          if (SL.isObject(value)){
            ret[key] = preprocessObject(value)
          }else if (SL.isArray(value)){
            ret[key] = preprocessArray(value)
          }else{
            ret[key] = forceLowerCaseIfNeeded(SL.replace(value, elm, evt))
          }
        }
      }
      return ret
    }

    function preprocessArray(args, forceLowerCase){
      var ret = []
      for (var i = 0, len = args.length; i < len; i++){
        var value = args[i]
        if (SL.isString(value)){
          value = forceLowerCaseIfNeeded(SL.replace(value, elm, evt))
        }else if (value && value.constructor === Object){
          value = preprocessObject(value)
        }
        ret.push(value)
      }
      return ret
    }

  }

// Execute a command.
  SL.execute = function(trig, elm, evt, tools){
    if (_satellite.settings.hideActivity) return
    tools = tools || SL.tools

    function doit(toolName){
      var tool = tools[toolName || 'default']
      if (!tool)
        return
      try{
        tool.triggerCommand(trig, elm, evt)
      }catch(e){
        SL.logError(e)
      }
    }
    if (trig.engine){
      var engine = trig.engine
      for (var toolName in tools){
        var tool = tools[toolName]
        if (tool.settings && tool.settings.engine === engine)
          doit(toolName)
      }
    }else if (trig.tool instanceof Array)
      SL.each(trig.tool, function(toolName){
        doit(toolName)
      })
    else
      doit(trig.tool)
  }

// `notify(msg, pty)`
// ------------------
//
// Notify the user of things happening in Satellite using `console.log`
//
// - msg - message to print
// - pty - priority
  SL.notify = window.console ? function(msg, pty) {
    if (SL.settings.notifications) {
      switch (pty) {
        case 1:
        case 2:
        case 3:
          console['log']("SATELLITE: " + msg);
          break;
        case 4:
          console.warn("SATELLITE: " + msg);
          break;
        case 5:
          console.error("SATELLITE: " + msg);
          break;
        default:
          console['log']("SATELLITE: Notify called with incorrect priority.");
      }
    }
  } : function(){}

// `cleanText(str)`
// ================
//
// "Cleans" the text from an element's innerText. This is used directly by the
// @cleanText special property.
  SL.cleanText = function(str){
    if (str == null) return null
    return SL.trim(str).replace(/\s{2,}/g, ' ')
        .replace(/[^\000-\177]*/g, '')
  }

  SL.text = function(obj){
    return obj.textContent || obj.innerText
  }

// Special Properties for DOM elements. You use special properties using
// the @ prefix. Example:
//
//     this.@text
  SL.specialProperties = {
    text: SL.text,
    cleanText: function(obj){
      return SL.cleanText(SL.text(obj))
    }
  }

// `getObjectProperty(obj, property)`
// ============================
//
// Get property(potentially nested) from an object.
  SL.getObjectProperty = function(obj, property, supportSpecial){
    var propChain = property.split('.')
    var currValue = obj
    var special = SL.specialProperties
    var attrMatch
    for (var i = 0, len = propChain.length; i < len; i++){
      if (currValue == null) return undefined
      var prop = propChain[i]
      if (supportSpecial && prop.charAt(0) === '@'){
        var specialProp = prop.slice(1)
        currValue = special[specialProp](currValue)
        continue
      }
      if (currValue.getAttribute &&
          (attrMatch = prop.match(/^getAttribute\((.+)\)$/))){
        var attr = attrMatch[1]
        currValue = currValue.getAttribute(attr)
        continue
      }
      currValue = currValue[prop]
    }
    return currValue
  }

// `getToolsByType(type)`
// ------------------------------------------------
//
// Returns an array containing all the tools whose engine property match
// the provided type.
//
// - `type` - The searched tool type
  SL.getToolsByType = function(type){
    if (!type) {
      throw new Error('Tool type is missing')
    }

    var result = []
    for (var t in SL.tools) {
      var tool = SL.tools[t]
      if (tool.settings && tool.settings.engine === type) {
        result.push(tool)
      }
    }

    return result
  }

// `setVar(name, value)` or `setVar(mapping)`
// ==========================================
//
// Set a customer variable. Can be either called like this
//
//     _satellite.setVar('name', 'value')
//
// Or by passing in a mapping(object literall) which allows setting multiple variables at
// the same time.
//
//     _satellite.setVar({name: 'value', foo: 'bar'})
  SL.setVar = function(){
    var customVars = SL.data.customVars
    if(customVars == null) SL.data.customVars = {}, customVars = SL.data.customVars
    if (typeof arguments[0] === 'string'){
      var prop = arguments[0]
      customVars[prop] = arguments[1]
    }else if (arguments[0]){ // assume an object literal
      var mapping = arguments[0]
      for (var key in mapping)
        customVars[key] = mapping[key]
    }
  }

  SL.dataElementSafe = function(key, length){
    if (arguments.length > 2){
      // setter
      var value = arguments[2]
      if (length === 'pageview'){
        SL.dataElementSafe.pageviewCache[key] = value
      }else if (length === 'session'){
        SL.setCookie('_sdsat_' + key, value)
      }else if (length === 'visitor') {
        SL.setCookie('_sdsat_' + key, value, 365 * 2)
      }
    }else{
      // getter
      if (length === 'pageview'){
        return SL.dataElementSafe.pageviewCache[key]
      }else if (length === 'session' || length === 'visitor'){
        return SL.readCookie('_sdsat_' + key)
      }
    }
  }
  SL.dataElementSafe.pageviewCache = {}

  SL.realGetDataElement = function(dataDef){
    var ret
    if (dataDef.selector) {
      if (SL.hasSelector) {
        SL.cssQuery(dataDef.selector, function(elms) {
          if (elms.length > 0) {
            var elm = elms[0]
            if (dataDef.property === 'text') {
              ret = elm.innerText || elm.textContent
            }else if (SL.hasAttr(elm, dataDef.property)) {
              ret = elm[dataDef.property] || elm.getAttribute(dataDef.property)
            }
          }
        })
      }
    }else if (dataDef.queryParam) {
      if (dataDef.ignoreCase){
        ret = SL.getQueryParamCaseInsensitive(dataDef.queryParam)
      }else{
        ret = SL.getQueryParam(dataDef.queryParam)
      }
    }else if (dataDef.cookie) {
      ret = SL.readCookie(dataDef.cookie)
    }else if (dataDef.jsVariable) {
      ret = SL.getObjectProperty(window, dataDef.jsVariable)
    }else if (dataDef.customJS) {
      ret = dataDef.customJS()
    }
    if (dataDef.cleanText){
      ret = SL.cleanText(ret)
    }
    return ret
  }

  SL.getDataElement = function(variable, suppressDefault, dataDef) {
    dataDef = dataDef || SL.dataElements[variable]
    var ret = SL.realGetDataElement(dataDef)
    if (ret === undefined && dataDef.storeLength) {
      ret = SL.dataElementSafe(variable, dataDef.storeLength)
    }else if (ret !== undefined && dataDef.storeLength) {
      SL.dataElementSafe(variable, dataDef.storeLength, ret)
    }
    if (ret === undefined && !suppressDefault) {
      ret = dataDef['default'] || ''
    }

    if (dataDef.forceLowerCase) {
      ret = ret.toLowerCase()
    }
    return ret
  }

// getVar(variable, elm, evt)
// ==========================
//
// Return the value of a variable, where the variable
// can be a data element, defined in the "data" section
// of the initial settings, or reference properties on
// an element, event, or target of the event in question,
// a query parameter, or a random number.
//
// - `variable` - the name of the variable to get
// - `[elm]` - the associated element, if any
// - `[evt]` - the associated event, if any
  SL.getVar = function(variable, elm, evt){
    var custVars = SL.data.customVars
        , target = evt ? (evt.target || evt.srcElement) : null
        , randMatch
        , value
    var map = {
      URI: SL.data.URI,
      uri: SL.data.URI,
      protocol: document.location.protocol,
      hostname: document.location.hostname
    }
    if (SL.dataElements && variable in SL.dataElements){
      return SL.getDataElement(variable)
    }
    value = map[variable]
    if (value === undefined){
      if (variable.substring(0, 5) === 'this.'){
        variable = variable.slice(5)
        value = SL.getObjectProperty(elm, variable, true)
      }else if(variable.substring(0, 6) === 'event.'){
        variable = variable.slice(6)
        value = SL.getObjectProperty(evt, variable)
      }else if(variable.substring(0, 7) === 'target.'){
        variable = variable.slice(7)
        value = SL.getObjectProperty(target, variable)
      }else if(variable.substring(0, 7) === 'window.'){
        variable = variable.slice(7)
        value = SL.getObjectProperty(window, variable)
      }else if (variable.substring(0, 6) === 'param.'){
        variable = variable.slice(6)
        value = SL.getQueryParam(variable)
      }else if(randMatch = variable.match(/^rand([0-9]+)$/)){
        var len = Number(randMatch[1])
            , s = (Math.random() * (Math.pow(10, len) - 1)).toFixed(0)
        value = Array(len - s.length + 1).join('0') + s
      }else{
        value = SL.getObjectProperty(custVars, variable)
      }
    }
    return value
  }

  SL.getVars = function(variables, elm, evt){
    var ret = {}
    SL.each(variables, function(variable){
      ret[variable] = SL.getVar(variable, elm, evt)
    })
    return ret
  }

// `replace(str, [elm], [target])`
// ---------------------
//
// Perform variable subtitutions substitute to a string where subtitions are
// specified in the form `"%foo%"`. Variables are lookup either in `SL.data.customVars`, or
// if the `elm` parameter is passed it, and the variable spec is of the form `"%this.tagName%"`, it
// is subsituted with the properties on `elm`, *i.e. `elm.tagName`.
//
// Parameters:
//
// - `str` - string to apply substitutions to
// - `elm`(optional) - object or element to use for substitutions of the form `%this.property%`
// - `target`(optional) - element to use for subsitution of the form `%target.property%`
  SL.replace = function(str, elm, evt) {
    if (typeof str !== 'string') return str
    return str
        .replace(/%(.*?)%/g, function(m, variable){
          var val = SL.getVar(variable, elm, evt)
          if (val == null)
            return m
          else
            return val
        })
  }



// From a object literal of variable, generate a query string.
  SL.searchVariables = function(vars, elm, evt){
    if (!vars || vars.length === 0) return ''
    var qsParts = []
    for (var i = 0, len = vars.length; i < len; i++){
      var varr = vars[i]
          , value = SL.getVar(varr, elm, evt)
      qsParts.push(varr + '=' + escape(value))
    }
    return '?' + qsParts.join('&')
  }

// Fire all the trigger actions associated with a rule.
  SL.fireRule = function(rule, elm, evt){
    var triggers = rule.trigger
    if (!triggers) return
    for (var i = 0, len = triggers.length; i < len; i++){
      var trig = triggers[i]
      SL.execute(trig, elm, evt)
    }
    if (SL.contains(SL.fireOnceEvents, rule.event))
      rule.expired = true
  }

// `isLinked(elm)`
// ---------------
//
// Returns whether the element is either an anchor or a descendant of an anchor or contains an anchor.
//
// `elm` - the element to test
  SL.isLinked = function(elm){
    for (var cur = elm; cur; cur = cur.parentNode) {
      if (SL.isLinkTag(cur))
        return true
    }
    return false
  }

// Fire a page load event. `type` is one of `pagetop`, `pagebottom`, `domready` and
// `windowload`.
  SL.firePageLoadEvent = function(type) {
    var location = document.location
        , evt = {type: type, target: location}
    var rules = SL.pageLoadRules
    for (var i = rules.length; i--;){
      var rule = rules[i]
      if (SL.ruleMatches(rule, evt, location)){
        SL.notify('Rule "' + rule.name + '" fired.', 1)
        SL.fireRule(rule, location, evt)
        rules.splice(i, 1) // remove this page-load rule once fired
      }
    }
    for (var id in SL.tools){
      var tool = SL.tools[id]
      if (tool.endPLPhase) {
        tool.endPLPhase(type)
      }
    }
  }

// `track(id)`
// -----------
//
// Directly fire a direct call rule by id.
  SL.track = function(ruleName) {
    // trim extra spaces that may exist at beginning or end of string
    ruleName = ruleName.replace(/^\s*/,"").replace(/\s*$/,"")
    for (var i = 0; i < SL.directCallRules.length; i++){
      var rule = SL.directCallRules[i]
      if (rule.name === ruleName){
        SL.notify('Direct call Rule "' + ruleName + '" fired.', 1)
        SL.fireRule(rule, location, {type: ruleName})
        return
      }
    }
    SL.notify('Direct call Rule "' + ruleName + '" not found.', 1)
  }

// `basePath()`
// ------------
//
// Returns the base path of all Satellite generated assets.
  SL.basePath = function(){
    if (SL.data.host)
      return (document.location.protocol === 'https:' ?
          'https://' + SL.data.host.https :
          'http://' + SL.data.host.http) + '/'
    else
      return this.settings.basePath
  }

// `setLocation(url)`
// ------------------
//
// Set the current URL
//
// - `url` - the URL to set to
  SL.setLocation = function(url){
    window.location = url
  }

  SL.parseQueryParams = function(str){
    var URIDecode = function (str) {
      var result = str
      try {
        result = decodeURIComponent(str)
      } catch(err) {}

      return result
    }

    if (str === '' || SL.isString(str) === false) return {}
    if (str.indexOf('?') === 0) {
      str = str.substring(1)
    }
    var ret = {}
        , pairs = str.split('&')
    SL.each(pairs, function(pair){
      pair = pair.split('=')
      if (!pair[1]) {
        return
      }
      ret[URIDecode(pair[0])] = SL.escapeForHtml(URIDecode(pair[1]))
    })
    return ret
  }

  SL.getCaseSensitivityQueryParamsMap = function (str) {
    var normal = SL.parseQueryParams(str)
    var insensitive = {}

    for (var prop in normal)
      if (normal.hasOwnProperty(prop))
        insensitive[prop.toLowerCase()] = normal[prop]

    return {
      normal: normal,
      caseInsensitive: insensitive
    }
  }

  SL.QueryParams = SL.getCaseSensitivityQueryParamsMap(window.location.search)

  SL.getQueryParam = function(key){
    return SL.QueryParams.normal[key]
  }

  SL.getQueryParamCaseInsensitive = function(key){
    return SL.QueryParams.caseInsensitive[key.toLowerCase()]
  }

  SL.encodeObjectToURI = function(obj) {
    if (SL.isObject(obj) === false) {
      return ''
    }

    var uri = []
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        uri.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      }
    }

    return uri.join('&')
  }

  SL.readCookie = function(name) {
    var nameEQ = name + "="
    var parts = document.cookie.split(';')
    for(var i=0;i < parts.length;i++) {
      var c = parts[i]
      while (c.charAt(0)==' '){
        c = c.substring(1,c.length)
      }
      if (c.indexOf(nameEQ) === 0){
        return c.substring(nameEQ.length,c.length)
      }
    }
    return undefined
  }

  SL.setCookie = function(name,value,days) {
    var expires
    if (days) {
      var date = new Date()
      date.setTime(date.getTime()+(days*24*60*60*1000))
      expires = "; expires="+date.toGMTString()
    }
    else{
      expires = ""
    }
    document.cookie = name+"="+value+expires+"; path=/"
  }

  SL.removeCookie = function(name) {
    SL.setCookie(name,"",-1);
  }


  SL.getElementProperty = function(elm, prop){
    if (prop.charAt(0) === '@'){
      var special = SL.specialProperties[prop.substring(1)]
      if (special){
        return special(elm)
      }
    }
    if (prop === 'innerText'){
      return SL.text(elm)
    }
    if (prop in elm)
      return elm[prop]
    return elm.getAttribute ? elm.getAttribute(prop) : undefined
  }

  SL.propertiesMatch = function(property, elm){
    if (property){
      for (var prop in property){
        var target = property[prop]
        var value = SL.getElementProperty(elm, prop)
        if (typeof target === 'string' && target !== value) return false
        if (target instanceof RegExp && !target.test(value)) return false
      }
    }
    return true
  }

// from http://www.quirksmode.org/js/events_properties.html
  SL.isRightClick = function(e){
    var ret
    if (e.which){
      ret = e.which == 3
    }else if (e.button){
      ret = e.button == 2
    }
    return ret
  }

// `ruleMatches(rule, evt, elm, eventEntriesFound)`
// ------------------------------------------------
//
// - `rule` - the rules to match
// - `evt` - the event triggered
// - `elm` - the element the event was on
// - `eventEntriesFound` - number of rules matched so far
  SL.ruleMatches = function(rule, evt, elm, eventEntriesFound){
    var location = document.location
        , cnd = rule.condition
        , cnds = rule.conditions
        , property = rule.property
        , eventType = evt.type
        , matchValue = rule.value
        , target = evt.target || evt.srcElement
        , initialTarget = elm === target
    if (rule.event !== eventType) return false
    // ignore all right-clicks
    if (rule.event === 'click' && SL.isRightClick(evt)){
      return false
    }
    if (rule.isDefault && eventEntriesFound > 0)
      return false
    if (rule.expired) return false
    if (eventType === 'inview' && evt.inviewDelay !== rule.inviewDelay){
      return false
    }
    if (!(initialTarget ||
        ((rule.bubbleFireIfParent !== false) && (eventEntriesFound === 0 || (rule.bubbleFireIfChildFired !== false))))) return false

    if (rule.selector && !SL.matchesCss(rule.selector, elm)) return false
    if (!SL.propertiesMatch(property, elm)) return false
    if (matchValue != null){
      if (typeof matchValue === 'string'){
        if (matchValue !== elm.value)
          return false
      }else if (!matchValue.test(elm.value))
        return false
    }
    if (cnd){
      try{
        if (!cnd.call(elm, evt, target)){
          SL.notify('Condition for rule "' + rule.name + '" not met.', 1)
          return false
        }
      }catch(e){
        SL.notify('Condition for rule "' + rule.name + '" not met. Error: ' + e.message, 1)
        return false
      }
    }
    if (cnds){
      var failed = SL.find(cnds, function(cnd){
        try{
          return !cnd.call(elm, evt, target)
        }catch(e){
          SL.notify('Condition for rule "' + rule.name + '" not met. Error: ' + e.message, 1)
          return true
        }
      })
      if (failed){
        SL.notify('Condition ' + failed.toString() + ' for rule "' + rule.name + '" not met.', 1)
        return false
      }
    }
    return true
  }


  SL.evtHandlers = {}
// `bindEvent(evtName, callback)`
// ------------------------------
//
// Register for an event by name. Alias: `whenEvent`.
//
// `evtName` - the name of the event
// `callback` - the function to be called when even fires
  SL.bindEvent = function(evtName, callback){
    var handlers = SL.evtHandlers
    if (!handlers[evtName])
      handlers[evtName] = []
    handlers[evtName].push(callback)
  }
  SL.whenEvent = SL.bindEvent

// `unbindEvent(evtName, callback)
// -------------------------------
//
// Unregister for an event by name.
//
// `evtName` - the name of the event
// `callback` - the function to unregister
  SL.unbindEvent = function(evtName, callback){
    var handlers = SL.evtHandlers
    if (!handlers[evtName]) return
    var idx = SL.indexOf(handlers[evtName], callback)
    handlers[evtName].splice(idx, 1)
  }

  SL.bindEventOnce = function(evtName, callback){
    var wrapped = function(){
      SL.unbindEvent(evtName, wrapped)
      callback.apply(null, arguments)
    }
    SL.bindEvent(evtName, wrapped)
  }

// See <http://tobyho.com/2014/02/26/attribute-only-valid-on-v-image/>
  SL.isVMLPoisoned = function(elm){
    if (!elm) return false
    try{
      elm.nodeName
    }catch(e){
      if (e.message === 'Attribute only valid on v:image'){
        return true
      }
    }
    return false
  }

  SL.handleEvent = function(evt) {
    // Don't process an event twice.
    if (SL.$data(evt, 'eventProcessed')) return

    var eventType = evt.type.toLowerCase()
        , target = evt.target || evt.srcElement
        , rulesMatched = 0
        , rules = SL.rules
        , tools = SL.tools
        , handlers = SL.evtHandlers[evt.type]

    if (SL.isVMLPoisoned(target)){
      SL.notify('detected ' + eventType + ' on poisoned VML element, skipping.', 1)
      return
    }

    if (handlers){
      SL.each(handlers, function(cb){
        cb(evt)
      })
    }

    var nodeName = target && target.nodeName;
    if (nodeName)
      SL.notify("detected " + eventType + " on " + target.nodeName, 1)
    else
      SL.notify("detected " + eventType, 1)

    for (var curr = target; curr; curr = curr.parentNode) {
      var bubbleStop = false
      SL.each(rules, function(rule){
        if (SL.ruleMatches(rule, evt, curr, rulesMatched)){
          SL.notify('Rule "' + rule.name + '" fired.', 1)
          SL.fireRule(rule, curr, evt)
          rulesMatched++
          if (rule.bubbleStop)
            bubbleStop = true
        }
      })
      if (bubbleStop) break
    }


    SL.$data(evt, 'eventProcessed', true)
  }

// `onEvent(evt)`
// ------------
//
// Handle an event, whether it is a DOM event or a synthetic event.
//
// - `evt` - the event triggered
  SL.onEvent = document.querySelectorAll ?
      function(evt){ SL.handleEvent(evt) } :
      (function(){
        var q = []
        var onEvent = function(evt) {
          if (evt.selector)
            q.push(evt)
          else
            SL.handleEvent(evt)
        }
        onEvent.pendingEvents = q
        return onEvent
      })()

// `fireEvent(eventType, eventTarget)`
// ------------
//
// Conviniently programmatically fire an event.
//
// - `eventType` - the type of event
// - `eventTarget` - the target object that fired the event
  SL.fireEvent = function(type, target){
    SL.onEvent({type: type, target: target})
  }

// `registerEvents(elm, events)`
// -----------------------------
//
// Register events for an element using `track` as the callback
//
// - `elm` - the element to listen for events on
// - `events` - an array of event types (strings)
  SL.registerEvents = function(elm, events){
    for (var i = events.length - 1; i >= 0; i--){
      var event = events[i]
      if (!SL.$data(elm, event + '.tracked')){
        SL.addEventHandler(elm, event, SL.onEvent)
        SL.$data(elm, event + '.tracked', true)
      }
    }
  }

// `registerEventsForTags(tags, events)`
// -------------------------------------
//
// Register events for all element that have the specified tags
//
// - `tags` - an array of tags to match for (strings)
// - `events` - an array of event types (strings)
  SL.registerEventsForTags = function(tags, events){
    for (var i = tags.length - 1; i >= 0; i--){
      var tag = tags[i]
      var elms = document.getElementsByTagName(tag);
      for (var j = elms.length - 1; j >= 0; j--)
        SL.registerEvents(elms[j], events)
    }
  }

// `setListeners()`
// ----------------
//
// Set events for `document`
  SL.setListeners = function() {
    SL.registerEvents(document, ["click","submit"]);
  };

// `setFormListeners()`
// --------------------
//
// Listen for events on form elements.
  SL.setFormListeners = function() {
    SL.registerEventsForTags(
        ['input', 'select', 'textarea', 'button'],
        ["select","change","focus","blur","keypress"]);
  };

// `setVideoListeners()`
// ---------------------
//
// Listen for events on video elements.
  SL.setVideoListeners = function() {
    SL.registerEventsForTags(['video'],
        ["play","pause","ended","volumechange","stalled","timeupdate","loadeddata"])
  }

// `readStoredSetting(name)`
// ==================
//
// Reads the cookie of the given name.
// Stolen from <http://www.quirksmode.org/js/cookies.html>
  SL.readStoredSetting = function(name) {
    if (!window.localStorage) return null
    name = 'sdsat_' + name
    try{
      return window.localStorage.getItem(name)
    }catch(e){
      SL.notify('Cannot read stored setting from localStorage: ' + e.message, 2)
      return null
    }
  }

// Read satelliteUtilsCookie values to see about getting bookmarklet running / settings
  SL.loadStoredSettings = function () {
    var debug = SL.readStoredSetting('debug')
        , hideActivity = SL.readStoredSetting('hide_activity')
    if (debug)
      SL.settings.notifications = debug === 'true'
    if (hideActivity)
      SL.settings.hideActivity = hideActivity === 'true'
  }

  SL.isRuleActive = function(rule, date){
    var schd = rule.schedule
    if (!schd) return true

    var utc = schd.utc
        , getDate = utc ? 'getUTCDate' : 'getDate'
        , getDay = utc ? 'getUTCDay' : 'getDay'
        , getFullYear = utc ? 'getUTCFullYear' : 'getFullYear'
        , getMonth = utc ? 'getUTCMonth' : 'getMonth'
        , getHours = utc ? 'getUTCHours' : 'getHours'
        , getMinutes = utc ? 'getUTCMinutes' : 'getMinutes'
        , setHours = utc ? 'setUTCHours' : 'setHours'
        , setMinutes = utc ? 'setUTCMinutes' : 'setMinutes'
        , setDate = utc ? 'setUTCDate' : 'setDate'

    date = date || new Date()

    function dayDiff(one, other){
      other = modifyDate(other, {
        hour: one[getHours](),
        minute: one[getMinutes]()
      })
      return Math.floor(Math.abs((one.getTime() - other.getTime()) / (1000 * 60 * 60 * 24)))
    }
    function monthDiff(one, other){
      function months(date){
        return date[getFullYear]() * 12 + date[getMonth]()
      }
      return Math.abs(months(one) - months(other))
    }
    function modifyDate(date, fields){
      var retval = new Date(date.getTime())
      for (var field in fields){
        var val = fields[field]
        switch(field){
          case 'hour':
            retval[setHours](val)
            break
          case 'minute':
            retval[setMinutes](val)
            break
          case 'date':
            retval[setDate](val)
            break
        }
      }
      return retval
    }
    function timeGreaterThan(one, other){
      var h1 = one[getHours]()
          , m1 = one[getMinutes]()
          , h2 = other[getHours]()
          , m2 = other[getMinutes]()
      return (h1 * 60 + m1) > (h2 * 60 + m2)
    }
    function timeLessThan(one, other){
      var h1 = one[getHours]()
          , m1 = one[getMinutes]()
          , h2 = other[getHours]()
          , m2 = other[getMinutes]()
      return (h1 * 60 + m1) < (h2 * 60 + m2)
    }


    if (schd.repeat){
      if (timeGreaterThan(schd.start, date)) return false
      if (timeLessThan(schd.end, date)) return false
      if (date < schd.start) return false
      if (schd.endRepeat && date >= schd.endRepeat) return false
      if (schd.repeat === 'daily'){
        if (schd.repeatEvery){
          var dd = dayDiff(schd.start, date)
          if (dd % schd.repeatEvery !== 0) return false
        }
      }else if (schd.repeat === 'weekly'){
        if (schd.days){
          if (!SL.contains(schd.days, date[getDay]())) return false
        }else
        if (schd.start[getDay]() !== date[getDay]()) return false
        if (schd.repeatEvery){
          var diff = dayDiff(schd.start, date)
          if (diff % (7 * schd.repeatEvery) !== 0)
            return false
        }
      }else if (schd.repeat === 'monthly'){
        if (schd.repeatEvery){
          var md = monthDiff(schd.start, date)
          if (md % schd.repeatEvery !== 0) return false
        }
        if (schd.nthWeek && schd.mthDay){
          if (schd.mthDay !== date[getDay]()) return false
          var nthWeek = Math.floor((date[getDate]() - date[getDay]() + 1) / 7)
          if (schd.nthWeek !== nthWeek) return false
        }else
        if (schd.start[getDate]() !== date[getDate]()) return false
      }else if (schd.repeat === 'yearly'){
        if (schd.start[getMonth]() !== date[getMonth]()) return false
        if (schd.start[getDate]() !== date[getDate]()) return false
        if (schd.repeatEvery){
          var diff = Math.abs(schd.start[getFullYear]() - date[getFullYear]())
          if (diff % schd.repeatEvery !== 0) return false
        }
      }
    }else{
      if (schd.start > date) return false
      if (schd.end < date) return false
    }
    return true
  }

  SL.isOutboundLink = function(elm){
    if (!elm.getAttribute('href')) return false
    var hostname = elm.hostname
    var href = elm.href
    var protocol = elm.protocol
    if (protocol !== 'http:' && protocol !== 'https:') return false
    var isMyDomain = SL.any(SL.settings.domainList, function(domain){
      return SL.isSubdomainOf(hostname, domain)
    })
    if (isMyDomain) return false
    return hostname !== location.hostname
  }

  SL.isLinkerLink = function(elm){
    if (!elm.getAttribute || !elm.getAttribute('href')) return false
    return SL.hasMultipleDomains() &&
        elm.hostname != location.hostname &&
        !elm.href.match(/^javascript/i) &&
        !SL.isOutboundLink(elm)
  }

  SL.isSubdomainOf = function(sub, root){
    if (sub === root) return true
    var idx = sub.length - root.length
    if (idx > 0)
      return SL.equalsIgnoreCase(sub.substring(idx), root)
    return false
  }

// `getVisitorId()`
// ------------------------------------------------
//
// Returns the library instance associated to a VisitorId tool if the tool exists
//
  SL.getVisitorId = function(){
    var visitorIdTools = SL.getToolsByType('visitor_id')
    if (visitorIdTools.length === 0) {
      return null;
    }

    return visitorIdTools[0].getInstance()
  }

// Filter `SL.rules` down to only the once relevant for the current page.
  SL.filterRules = function(){
    var locationData = {
      hostname: location.hostname
      , protocol: location.protocol
      , URI: SL.data.URI
    }

    function matches(rule){
      if (!SL.ruleInScope(rule, locationData)) return false
      if (!SL.isRuleActive(rule)) return false
      return true
    }

    SL.rules = SL.filter(SL.rules, matches)
    SL.pageLoadRules = SL.filter(SL.pageLoadRules, matches)

  }

  SL.ruleInScope = function(rule, location){
    var scope = rule.scope
    if (!scope) return true
    var URI = scope.URI
    var subdomains = scope.subdomains
    var domains = scope.domains
    var protocols = scope.protocols

    if (URI && includeExcludeFails(URI, location.URI)) return false
    if (subdomains && includeExcludeFails(subdomains, location.hostname)) return false
    if (domains && matchFails(domains, location.hostname)) return false
    if (protocols && matchFails(protocols, location.protocol)) return false

    function includeExcludeFails(matcher, matchee){
      var include = matcher.include
      var exclude = matcher.exclude
      if (include && matchFails(include, matchee)) return true
      if (exclude){
        if (SL.isString(exclude) && exclude === matchee)
          return true
        if (SL.isArray(exclude) && SL.any(exclude, matches))
          return true
        if (SL.isRegex(exclude) && matches(exclude))
          return true
      }

      return false

      function matches(regex){
        return matchee.match(regex)
      }
    }

    function matchFails(matcher, matchee){
      if (SL.isString(matcher) && matcher !== matchee)
        return true
      if (SL.isArray(matcher) && !SL.any(matcher, matches))
        return true
      if (SL.isRegex(matcher) && !matches(matcher))
        return true
      return false

      function matches(regex){
        return matchee.match(regex)
      }

    }

    return true
  }


// Run background tasks once. This will get invoked periodically.
  SL.backgroundTasks = function(){
    var start = +new Date()
    SL.setFormListeners()
    SL.setVideoListeners()
    SL.loadStoredSettings()
    SL.registerNewElementsForDynamicRules()
    SL.eventEmitterBackgroundTasks()

    // Trigger condition events
    //SL.onEvent({type: 'condition', target: 'document'})
    var end = +new Date()
    // We want to keep an eye on the execution time here.
    // If it gets to around 50ms for any customer site,
    // we want to either optimize or start using a task queue
    //SL.notify('Background tasks executed in ' + (end - start) + 'ms', 3)
  }



// For rules that poll for dynamically injected elements on the page,
// find them and register events for them.
  SL.registerNewElementsForDynamicRules = function(){
    function cssQuery(selector, callback){
      var hit = cssQuery.cache[selector]
      if (hit){
        return callback(hit)
      }else{
        SL.cssQuery(selector, function(elms){
          cssQuery.cache[selector] = elms
          callback(elms)
        })
      }
    }
    cssQuery.cache = {}


    SL.each(SL.dynamicRules, function(rule){
      cssQuery(rule.selector, function(elms){
        SL.each(elms, function(elm){
          if (SL.$data(elm, 'dynamicRules.seen')) return
          SL.$data(elm, 'dynamicRules.seen', true)
          if (SL.propertiesMatch(rule.property, elm)){
            SL.registerEvents(elm, [rule.event])
          }
        })
      })
    })
  }

// If the browser doesn't support CSS selector queries, we have to include one.
  SL.ensureCSSSelector = function(){
    if (document.querySelectorAll){
      SL.hasSelector = true
      return
    }
    SL.loadingSizzle = true
    SL.sizzleQueue = []
    SL.loadScript(SL.basePath() + 'selector.js', function(){
      if (!SL.Sizzle){
        SL.logError(new Error('Failed to load selector.js'))
        return
      }
      var pending = SL.onEvent.pendingEvents
      SL.each(pending, function(evt){
        SL.handleEvent(evt)
      }, this)
      SL.onEvent = SL.handleEvent
      SL.hasSelector = true
      ;delete SL.loadingSizzle
      SL.each(SL.sizzleQueue, function(item){
        SL.cssQuery(item[0], item[1])
      })
      ;delete SL.sizzleQueue

    })
  }

// Error Handling

  SL.errors = []
  SL.logError = function(err){
    SL.errors.push(err)
    SL.notify(err.name + ' - ' + err.message, 5)
  }

// `pageBottom()`
// --------------
//
// The function is to be called by the web page using an script tag like so:
//
//     <script>_satellite.pageBottom()</script>
//
// just before the `</body>` tag.
  SL.pageBottom = function(){
    if (!SL.initialized) return
    SL.pageBottomFired = true
    SL.firePageLoadEvent('pagebottom')
  }

// This allows Rover to configure the browser to use the staging library instead.
  SL.stagingLibraryOverride = function(){
    /*jshint evil:true */
    var libraryOverride = SL.readStoredSetting('stagingLibrary') === 'true'
    if (libraryOverride){ // allow Rover to override the library to staging
      var scripts = document.getElementsByTagName('script')
          , regex = /^(.*)satelliteLib-(.*)\.js$/
          , regexStaging = /^(.*)satelliteLib-(.*)-staging\.js$/
          , match
          , matchStaging
          , src
      for (var i = 0, len = scripts.length; i < len; i++){
        src = scripts[i].getAttribute('src')
        if (!src) continue
        if (!match) match = src.match(regex)
        if (!matchStaging) matchStaging = src.match(regexStaging)
        if (matchStaging) break
      }
      if (match && !matchStaging){
        var stagingURL = match[1] + 'satelliteLib-' + match[2] + '-staging.js'
        if (document.write) {
          document.write('<script src="' + stagingURL + '"></script>')
        } else {
          var s = document.createElement('script')
          s.src = stagingURL
          document.head.appendChild(s)
        }
        return true
      }
    }
    return false
  }

  SL.checkAsyncInclude = function(){
    if (window.satellite_asyncLoad)
      SL.notify('You may be using the async installation of Satellite. In-page HTML and the "pagebottom" event will not work. Please update your Satellite installation for these features.', 5)
  }

  SL.hasMultipleDomains = function(){
    return !!SL.settings.domainList && SL.settings.domainList.length > 1
  }

  SL.handleOverrides = function(){
    if (Overrides){
      for (var key in Overrides){
        if (Overrides.hasOwnProperty(key)){
          SL.data[key] = Overrides[key]
        }
      }
    }
  }

  SL.privacyManagerParams = function(){
    var params = {}
    SL.extend(params, SL.settings.privacyManagement)
    var analyticsTools = []
    for (var key in SL.tools){
      var tool = SL.tools[key]
      var settings = tool.settings
      if (!settings) continue
      if (settings.engine === 'sc'){
        analyticsTools.push(tool)
      }
    }
    var analyticsTrackingServers = SL.filter(SL.map(analyticsTools, function(tool){
      return tool.getTrackingServer()
    }), function(s){ return s != null })
    params.adobeAnalyticsTrackingServers = analyticsTrackingServers
    var substitutable = [
      'bannerText',
      'headline',
      'introductoryText',
      'customCSS'
    ]
    for (var i = 0; i < substitutable.length; i++){
      var prop = substitutable[i]
      var spec = params[prop]
      if (!spec) continue
      if (spec.type === 'text'){
        params[prop] = spec.value
      }else if (spec.type === 'data'){
        params[prop] = SL.getVar(spec.value)
      }else{
        throw new Error('Invalid type: ' + spec.type)
      }
    }
    return params
  }

  SL.prepareLoadPrivacyManager = function(){
    SL.addEventHandler(window, 'load', function(){
      loadWhenAllSCToolsLoaded(SL.loadPrivacyManager)
    })

    function loadWhenAllSCToolsLoaded(callback){
      var scTools = SL.filter(SL.values(SL.tools), function(tool){
        return tool.settings && tool.settings.engine === 'sc'
      })
      if (scTools.length === 0){
        return callback()
      }
      var numLoaded = 0
      SL.each(scTools, function(tool){
        SL.bindEvent(tool.id + '.load', onLoad)
      })
      var tid = setTimeout(onTimeout, 5000)

      function onLoad(){
        numLoaded++
        if (numLoaded === scTools.length){
          cleanUp()
          clearTimeout(tid)
          callback()
        }
      }

      function cleanUp(){
        SL.each(scTools, function(tool){
          SL.unbindEvent(tool.id + '.load', onLoad)
        })
      }

      function onTimeout(){
        cleanUp()
        callback()
      }
    }

  }

// `loadPrivacyManager()`
// ----------------------
//
// Initialize privacy manager
  SL.loadPrivacyManager = function(){
    var scriptUrl = SL.basePath() + 'privacy_manager.js'
    SL.loadScript(scriptUrl, function(){
      var pm = SL.privacyManager
      pm.configure(SL.privacyManagerParams())
      pm.openIfRequired()
    })
  }

// `init()`
// --------
//
// Initialize Satellite.
//
// - `settings` - all the settings that comprising a library.
  SL.init = function(settings) {
    if (SL.stagingLibraryOverride())
      return

    SL.configurationSettings = settings
    var tools = settings.tools
        ;delete settings.tools
    for (var key in settings){
      SL[key] = settings[key]
    }

    if(SL.data.customVars === undefined)
      SL.data.customVars = {}

    SL.data.queryParams = SL.QueryParams.normal

    SL.handleOverrides()

    SL.detectBrowserInfo()

    if (SL.trackVisitorInfo)
      SL.trackVisitorInfo()

    SL.loadStoredSettings()

    SL.checkAsyncInclude()

    SL.ensureCSSSelector()

    SL.filterRules()
    SL.dynamicRules = SL.filter(SL.rules, function(rule){
      return rule.eventHandlerOnElement
    })

    SL.tools = SL.initTools(tools)
    SL.initEventEmitters()

    SL.firePageLoadEvent('aftertoolinit')

    if (SL.settings.forceLowerCase)
      SL.data.URI = SL.data.URI.toLowerCase()

    if (SL.settings.privacyManagement){
      SL.prepareLoadPrivacyManager()
    }

    if (SL.hasSelector)
      SL.domReady(SL.eventEmitterBackgroundTasks)

    SL.setListeners()

    // Setup background tasks
    SL.domReady(function() {
      SL.poll(
          function() { SL.backgroundTasks() },
          SL.settings.recheckEvery || 3000
      )
    })

    // Setup page load events
    SL.domReady(function(){
      SL.domReadyFired = true
      if (!SL.pageBottomFired)
        SL.pageBottom()

      SL.firePageLoadEvent('domready')
    })

    SL.addEventHandler(window, 'load', function(){
      SL.firePageLoadEvent('windowload')
    })

    SL.firePageLoadEvent('pagetop')
    SL.initialized = true

    // TODO: This is temporary.
    // Oh look an event occurred!
    setTimeout(function() {
      SL.executeRule(settings.extensions, settings.newRules[1]);
    }, 2000);
  }

  SL.executeRule = function(extensions, rule) {
    for (var k = 0; k < rule.actions.length; k++) {
      var action = rule.actions[k];
      for (var m = 0; m < action.extensionInstanceIds.length; m++) {
        var extensionInstanceId = action.extensionInstanceIds[m];
        var extensionInstance = extensions[extensionInstanceId];
        // TODO: Pass an options object instead?
        action.script(
            this.settings.settings,
            extensionInstance.settings,
            action.settings,
            extensionInstanceId);
      }
    }
  };

  SL.pageLoadPhases = ['aftertoolinit', 'pagetop', 'pagebottom', 'domready', 'windowload']

  SL.loadEventBefore = function(one, other){
    return SL.indexOf(SL.pageLoadPhases, one) <= SL.indexOf(SL.pageLoadPhases, other)
  }

  SL.flushPendingCalls = function(tool){
    if (tool.pending){
      SL.each(tool.pending, function(call){
        var cmd = call[0]
            , elm = call[1]
            , evt = call[2]
            , args = call[3]
        if (cmd in tool)
          tool[cmd].apply(tool, [elm, evt].concat(args))
        else if (tool.emit)
          tool.emit(cmd, elm, evt, args)
        else
          SL.notify('Failed to trigger ' + cmd +
          ' for tool ' + tool.id, 1)
      })
      ;delete tool.pending
    }
  }

// setDebug(debug)
// --------------
//
// Activate or deactivate debug mode - within which
// log statements will be printed to the JS console.
//
// - `debug` - a boolean indicating whether debug mode
//   should be turned on.
  SL.setDebug = function(debug){
    if (!window.localStorage) return
    window.localStorage.setItem('sdsat_debug', debug)
  }

  SL.detectBrowserInfo = function(){
    // Based on <http://jsbin.com/inubez/3/>
    function matcher(regexs){
      return function(userAgent){
        for (var key in regexs){
          var regex = regexs[key];
          var match = regex.test(userAgent);
          if (match) return key;
        }
        return "Unknown";
      };
    }

    var getBrowser = matcher({
      OmniWeb: /OmniWeb/,
      "Opera Mini": /Opera Mini/,
      "Opera Mobile": /Opera Mobi/,
      Opera: /Opera/,
      "Mobile Safari": /Mobile(\/[0-9A-z]+)? Safari/,
      Chrome: /Chrome/,
      Firefox: /Firefox/,
      "IE Mobile": /IEMobile/,
      IE: /MSIE|Trident/,
      Safari: /Safari/
    });

    var getOS = matcher({
      iOS: /iPhone|iPad|iPod/,
      Blackberry: /BlackBerry/,
      "Symbian OS": /SymbOS/,
      Maemo: /Maemo/,
      Android: /Android [0-9\.]+;/,
      Linux: / Linux /,
      Unix: /FreeBSD|OpenBSD|CrOS/,
      Windows: /[\( ]Windows /,
      MacOS: /Macintosh;/
    });

    var getDeviceType = matcher({
      iPhone: /iPhone/,
      iPad: /iPad/,
      iPod: /iPod/,
      Nokia: /SymbOS|Maemo/,
      "Windows Phone": /IEMobile/,
      Blackberry: /BlackBerry/,
      Android: /Android [0-9\.]+;/,
      Desktop: /.*/
    });

    var userAgent = navigator.userAgent

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
      return navigator.javaEnabled();
    };

    var getIsCookiesEnabled = function() {
      return window.navigator.cookieEnabled;
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
        return isHomePage ? isHomePage(getTopFrameSet().location) : false;
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

    SL.browserInfo = {
      browser: getBrowser(userAgent)
      , os: getOS(userAgent)
      , deviceType: getDeviceType(userAgent)
      , getBrowserWidth: getBrowserWidth
      , getBrowserHeight: getBrowserHeight
      , resolution: getResolution()
      , colorDepth: getColorDepth()
      , jsVersion: getJSVersion()
      , isJavaEnabled: getIsJavaEnabled()
      , isCookiesEnabled: getIsCookiesEnabled()
      , connectionType: getConnectionType()
      , isHomePage: getIsHomePage()
    }
  };

  SL.isHttps = function(){
    return 'https:' == document.location.protocol
  }

  SL.BaseTool = function(settings){
    this.settings = settings || {}

    this.forceLowerCase = SL.settings.forceLowerCase
    if ('forceLowerCase' in this.settings){
      this.forceLowerCase = this.settings.forceLowerCase
    }
  }
  SL.BaseTool.prototype = {
    triggerCommand: function(trig, elm, evt){
      var settings = this.settings || {}

      if (this.initialize && this.isQueueAvailable()){
        if (this.isQueueable(trig) && evt && SL.loadEventBefore(evt.type, settings.loadOn)){
          this.queueCommand(trig, elm, evt)
          return
        }
      }

      var args = SL.preprocessArguments(trig['arguments'], elm, evt, this.forceLowerCase)
          , cmd = trig.command
          , method = this['$' + cmd]

      if (method){
        method.apply(this, [elm, evt].concat(args))
      }else if (this.$missing$){
        this.$missing$(cmd, elm, evt, args)
      }else
        SL.notify('Failed to trigger ' + cmd +
        ' for tool ' + this.id, 1)

    },
    endPLPhase: function(pageLoadEvent){
      // override to handle end initialization
    },
    isQueueable: function(trig){
      // everything is queueable except `cancelToolInit`
      return trig.command !== 'cancelToolInit'
    },
    isQueueAvailable: function(){
      return !this.initialized && !this.initializing
    },
    flushQueue: function(){
      if (this.pending){
        SL.each(this.pending, function(args){
          this.triggerCommand.apply(this, args)
        }, this)
        this.pending = []
      }
    },
    queueCommand: function(trig, elm, evt){
      if (!this.pending)
        this.pending = []
      this.pending.push([trig, elm, evt])
    },
    $cancelToolInit: function(){
      this._cancelToolInit = true
    }
  }

// Set Satellite to the global variable `_satellite`.
  window._satellite = SL

// Site Catalyst Tool
// ---------------------
//
// The SiteCatalystTool allows to set variables, add events, track link, etc.
// Example:
//
//      trigger: [
//          {
//              tool: "sc",
//              command: "trackLink"
//          }
//      ]
//
  function SiteCatalystTool(settings){
    SL.BaseTool.call(this, settings)

    this.varBindings = {}
    this.events = []
    this.products = []
    this.customSetupFuns = []
  }
  SL.inherit(SiteCatalystTool, SL.BaseTool)
  SL.extend(SiteCatalystTool.prototype, {
    name: 'SC',
    initialize: function(pageLoadEvent){

      if (this._cancelToolInit) return
      this.settings.initVars = this.substituteVariables(
          this.settings.initVars, { type: pageLoadEvent }
      )

      if (this.settings.initTool !== false){
        var url = this.settings.sCodeURL || SL.basePath() + 's_code.js'
        if (typeof url === 'object'){
          if (window.location.protocol === 'https:')
            url = url.https
          else
            url = url.http
        }
        if (!url.match(/^https?:/))
          url = SL.basePath() + url
        if (this.settings.initVars){
          this.$setVars(null, null, this.settings.initVars)
        }
        SL.loadScript(url, SL.bind(this.onSCodeLoaded, this))
        this.initializing = true
      }else{
        // set to initializing because we are
        // waiting on the s_code.js loaded by
        // the site to potentially load
        // and we'll detect the completion of the load
        // in a background task
        this.initializing = true
        this.pollForSC()
      }
    },
    onSCodeLoaded: function(){
      this.initialized = true
      this.initializing = false
      SL.notify('Adobe Analytics: loaded.', 1)
      SL.fireEvent(this.id + '.load', this.getS())
      this.flushQueueExceptTrackLink()
      this.sendBeacon()
      this.flushQueue()
    },
    pollForSC: function(){
      SL.poll(SL.bind(function(){
        if (typeof window.s_gi === 'function'){
          this.initialized = true
          this.initializing = false
          SL.notify('Adobe Analytics: loaded (manual).', 1)
          SL.fireEvent(this.id + '.load', this.getS())
          this.flushQueue()
          return true
        }
      }, this))
    },
    flushQueueExceptTrackLink: function(){
      // because we always s.tl() after the first s.t()
      // that way the variables set by s.tl() will not
      // contaminate the s.t() call
      if (!this.pending) return
      var left = []
      for (var i = 0; i < this.pending.length; i++){
        var args = this.pending[i]
        var trig = args[0]
        if (trig.command === 'trackLink'){
          left.push(args)
        }else{
          this.triggerCommand.apply(this, args)
        }
      }
      this.pending = left
    },
    isQueueAvailable: function(){
      return !this.initialized
    },
    substituteVariables: function(obj, evt){
      var ret = {}
      for (var key in obj){
        var value = obj[key]
        ret[key] = SL.replace(value, location, evt)
      }
      return ret
    },
    endPLPhase: function(pageLoadEvent){
      var loadOn = this.settings.loadOn
      if (pageLoadEvent === loadOn){
        this.initialize(pageLoadEvent)
      }
    },
    $setVars: function(elm, evt, vars){
      for (var v in vars){
        var val = vars[v]
        if (typeof val === 'function')
          val = val()
        this.varBindings[v] = val
      }
      SL.notify('Adobe Analytics: set variables.', 2)
    },
    $customSetup: function(elm, evt, setup){
      this.customSetupFuns.push(function(s){
        setup.call(elm, evt, s)
      })
    },
    getAccount: function(hostname){
      if (window.s_account){
        return window.s_account
      }
      if (hostname && this.settings.accountByHost){
        return this.settings.accountByHost[hostname] || this.settings.account
      }else{
        return this.settings.account
      }
    },
    isValidSCInstance: function(s) {
      return !!s && typeof s.t === 'function' && typeof s.tl === 'function'
    },
    getS: function(s, options){
      var hostname = options && options.hostname || window.location.hostname
      var varBindings = this.concatWithToolVarBindings(
          options && options.setVars || this.varBindings
      )
      var events = options && options.addEvent || this.events
      var acct = this.getAccount(hostname)
      var s_gi = window.s_gi
      if (!s_gi) return null
      if (!this.isValidSCInstance(s)) s = null
      if (!acct && !s) {
        SL.notify('Adobe Analytics: tracker not initialized because account was not found', 1)
        return null
      }
      var s = s || s_gi(acct)

      var DTMversion = 'D' + SL.appVersion;
      if(typeof s.tagContainerMarker !== 'undefined') {
        s.tagContainerMarker = DTMversion
      } else {
        if (typeof s.version === 'string' &&
            s.version.substring(s.version.length - 5) !==
            ('-' + DTMversion)){
          s.version += '-' + DTMversion
        }
      }

      if (s.sa && this.settings.skipSetAccount !== true && this.settings.initTool !== false) s.sa(this.settings.account)
      this.applyVarBindingsOnTracker(s, varBindings)
      if (events.length > 0)
        s.events = events.join(',')

      var visitorIdInstance = SL.getVisitorId()
      if (visitorIdInstance) {
        s.visitor = SL.getVisitorId()
      }

      return s
    },
    concatWithToolVarBindings: function(varBindings){
      var settingsInitVars = this.settings.initVars || {}

      SL.map(['trackingServer', 'trackingServerSecure'], function (item) {
        if (settingsInitVars[item] && !varBindings[item]) {
          varBindings[item] = settingsInitVars[item]
        }
      });

      return varBindings
    },
    applyVarBindingsOnTracker: function (s, varBindings) {
      for (var v in varBindings){
        s[v] = varBindings[v]
      }
    },
    clearVarBindings: function(){
      this.varBindings = {}
    },
    clearCustomSetup: function(){
      this.customSetupFuns = []
    },
    sendBeacon: function(){
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
    },
    executeCustomSetupFuns: function(s){
      SL.each(this.customSetupFuns, function(fun){
        fun.call(window, s)
      })
    },
    $trackLink: function(elm, evt, params){
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
    },
    mergeTrackLinkVars: function(newVarsStr, varsArr){
      if (newVarsStr) {
        varsArr = newVarsStr.split(',').concat(varsArr)
      }

      return varsArr
    },
    getCustomLinkVarsList: function (keysArr) {
      var noneIndex = SL.indexOf(keysArr, 'None');
      if (noneIndex > -1 && keysArr.length > 1) {
        keysArr.splice(noneIndex, 1)
      }

      return keysArr.join(',');
    },
    definedVarNames: function(vars){
      vars = vars || this.varBindings
      var ret = []
      for (var varname in vars){
        if (/^(eVar[0-9]+)|(prop[0-9]+)|(hier[0-9]+)|campaign|purchaseID|channel|server|state|zip|pageType$/.test(varname))
          ret.push(varname)
      }
      return ret
    },
    getTrackingServer: function(){
      var tool = this
      var s = tool.getS()
      if (s && s.trackingServer) return s.trackingServer
      var account = tool.getAccount(window.location.hostname)
      if (!account) return null
      // based on code in app measurement
      var w
      var c = ''
      var d = s && s.dc
      var e
      var f
      w = account
      e = w.indexOf(",")
      e >= 0 && (w = w.gb(0, e))
      w = w.replace(/[^A-Za-z0-9]/g, "")
      c || (c = "2o7.net")
      d = d ? ("" + d).toLowerCase() : "d1"
      c == "2o7.net" && (d == "d1" ? d = "112" : d == "d2" && (d = "122"), f = "")
      e = w + "." + d + "." + f + c
      return e
    },
    $trackPageView: function(elm, evt, params){
      var vars = params && params.setVars
      var events = (params && params.addEvent) || []

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
    },
    $postTransaction: function(elm, evt, varname){
      var trans = SL.data.transaction = window[varname]
          , s = this.varBindings
          , mapping = this.settings.fieldVarMapping

      SL.each(trans.items, function(item){
        this.products.push(item)
      }, this)

      s.products = SL.map(this.products, function(item){
        var vars = []
        if (mapping && mapping.item){
          for (var field in mapping.item){
            var varname = mapping.item[field]
            vars.push(varname + '=' + item[field])
            if (varname.substring(0, 5) === 'event')
              this.events.push(varname)
          }
        }
        var arr = ['', item.product, item.quantity, item.unitPrice * item.quantity]
        if (vars.length > 0)
          arr.push(vars.join('|'))
        return arr.join(';')
      }, this).join(',')

      if (mapping && mapping.transaction){
        // Add top-level events/eVars to products string
        var topLevelVars = []
        for (var field in mapping.transaction){
          var varname = mapping.transaction[field]
          topLevelVars.push(varname + '=' + trans[field])
          if (varname.substring(0, 5) === 'event')
            this.events.push(varname)
        }
        if (s.products.length > 0)
          s.products += ','
        s.products += ';;;;' + topLevelVars.join('|')
      }


    },
    $addEvent: function(elm, evt){
      for (var i = 2, len = arguments.length; i < len; i++){
        this.events.push(arguments[i])
      }
    },
    $addProduct: function(elm, evt){
      for (var i = 2, len = arguments.length; i < len; i++){
        this.products.push(arguments[i])
      }
    }
  })
  SL.availableTools.sc = SiteCatalystTool

// Test & Target Tool
// ==================
//
// This tool lets you use Test & Target with Satellite.
//
//

  function Tnt(settings){
    SL.BaseTool.call(this, settings)

    this.styleElements = {}
    this.targetPageParamsStore = {}
  }
  SL.inherit(Tnt, SL.BaseTool)
  SL.extend(Tnt.prototype, {
    name: 'tnt',

    endPLPhase: function(pageLoadEvent) {
      if (pageLoadEvent === 'aftertoolinit') {
        this.initialize();
      }
    },

    initialize: function() {
      SL.notify('Test & Target: Initializing', 1)
      this.initializeTargetPageParams()
      this.load()
    },

    initializeTargetPageParams: function() {
      if (window.targetPageParams) {
        this.updateTargetPageParams(
            this.parseTargetPageParamsResult(
                window.targetPageParams()
            )
        )
      }

      this.updateTargetPageParams(this.settings.pageParams)

      this.setTargetPageParamsFunction()
    },

    load: function(){
      var url = this.getMboxURL(this.settings.mboxURL)
      if (this.settings.initTool !== false){
        if (this.settings.loadSync) {
          SL.loadScriptSync(url)
          this.onScriptLoaded()
        } else {
          SL.loadScript(url, SL.bind(this.onScriptLoaded, this))
          this.initializing = true
        }
      } else {
        this.initialized = true
      }
    },

    getMboxURL: function(urlData) {
      var url = urlData
      if (SL.isObject(urlData)) {
        if (window.location.protocol === 'https:')
          url = urlData.https
        else
          url = urlData.http
      }
      if (!url.match(/^https?:/))
        return SL.basePath() + url
      else
        return url
    },

    onScriptLoaded: function(){
      SL.notify('Test & Target: loaded.', 1)

      this.flushQueue()

      this.initialized = true
      this.initializing = false
    },

    $addMbox: function(elm, evt, settings){
      var mboxGoesAround = settings.mboxGoesAround
      var styleText = mboxGoesAround + '{visibility: hidden;}'
      var styleElm = this.appendStyle(styleText)
      if (!(mboxGoesAround in this.styleElements)){
        this.styleElements[mboxGoesAround] = styleElm
      }

      if (this.initialized){
        this.$addMBoxStep2(null, null, settings)
      }else if (this.initializing){
        this.queueCommand({
          command: 'addMBoxStep2'
          , "arguments": [settings]
        }, elm, evt)
      }
    },
    $addMBoxStep2: function(elm, evt, settings){
      var mboxID = this.generateID()
      var self = this
      SL.addEventHandler(window, 'load', SL.bind(function(){
        SL.cssQuery(settings.mboxGoesAround, function(elms){
          var elem = elms[0]
          if (!elem) return
          var newDiv = document.createElement("div")
          newDiv.id = mboxID
          elem.parentNode.replaceChild(newDiv, elem)
          newDiv.appendChild(elem)
          window.mboxDefine(mboxID, settings.mboxName)
          var args = [settings.mboxName]
          if (settings.arguments){
            args = args.concat(settings.arguments)
          }
          window.mboxUpdate.apply(null, args)
          self.reappearWhenCallComesBack(elem, mboxID, settings.timeout, settings)
        });
      }, this))
      this.lastMboxID = mboxID // leave this here for easier testing
    },

    $addTargetPageParams: function(elm, evt, pageParams) {
      this.updateTargetPageParams(pageParams)
    },

    generateID: function(){
      var id = '_sdsat_mbox_' + String(Math.random()).substring(2) + '_'
      return id
    },
    appendStyle: function(css){
      // <http://stackoverflow.com/a/524721/5304>
      var head = document.getElementsByTagName('head')[0]
          , style = document.createElement('style')
      style.type = 'text/css'
      if(style.styleSheet){
        style.styleSheet.cssText = css
      }else{
        style.appendChild(document.createTextNode(css))
      }
      head.appendChild(style)
      return style
    },
    reappearWhenCallComesBack: function(elmGoesAround, mboxID, timeout, settings){
      var self = this

      function reappear(){
        var styleElm = self.styleElements[settings.mboxGoesAround]
        if (styleElm){
          styleElm.parentNode.removeChild(styleElm)
          ;delete self.styleElements[settings.mboxGoesAround]
        }
      }

      SL.cssQuery('script[src*="omtrdc.net"]', function(results){
        var script = results[0]
        if (script){
          SL.scriptOnLoad(script.src, script, function(){
            SL.notify('Test & Target: request complete', 1)
            reappear()
            clearTimeout(timeoutID)
          })
          var timeoutID = setTimeout(function(){
            SL.notify('Test & Target: bailing after ' + timeout + 'ms', 1)
            reappear()
          }, timeout)
        }else{
          SL.notify('Test & Target: failed to find T&T ajax call, bailing', 1)
          reappear()
        }
      })
    },

    updateTargetPageParams: function(obj) {
      var o = {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          o[SL.replace(key)] = SL.replace(obj[key])
        }
      }
      SL.extend(
          this.targetPageParamsStore,
          o
      )
    },

    getTargetPageParams: function() {
      return this.targetPageParamsStore
    },

    setTargetPageParamsFunction: function() {
      window.targetPageParams = SL.bind(this.getTargetPageParams, this)
    },

    parseTargetPageParamsResult: function(data) {
      var result = data

      if(SL.isArray(data)) {
        data = data.join('&')
      }

      if (SL.isString(data)) {
        result = SL.parseQueryParams(data)
      }

      return result
    }
  })
  SL.availableTools.tnt = Tnt

// The Default Tool
// ================
//
// The default tool comes with several handy utilities.

  function DefaultTool(){
    SL.BaseTool.call(this)

    this.asyncScriptCallbackQueue = []
    this.argsForBlockingScripts = []
  }
  SL.inherit(DefaultTool, SL.BaseTool)
  SL.extend(DefaultTool.prototype, {
    name: 'Default',

    // `loadIframe(src, variables)`
    // ----------------------------
    //
    // Dynamically create an iframe to load a URL.
    //
    // - src - the URL to load
    // - variables - an object literal of which the key/value pairs will be used
    //      to create the query string to use in the src URL
    $loadIframe: function(elm, evt, options){
      var pages = options.pages
          , loadOn = options.loadOn
      var doit = SL.bind(function(){
        SL.each(pages, function(page){
          this.loadIframe(elm, evt, page)
        }, this)
      }, this)
      if (!loadOn) doit()
      if (loadOn === 'domready') SL.domReady(doit)
      if (loadOn === 'load') SL.addEventHandler(window, 'load', doit)
    },

    loadIframe: function(elm, evt, page){
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      var host = SL.data.host
          , data = page.data
          , src = this.scriptURL(page.src)
          , search = SL.searchVariables(data, elm, evt)
      if (host)
        src = SL.basePath() + src
      src += search
      iframe.src = src
      var body = document.getElementsByTagName('body')[0]
      if (body)
        body.appendChild(iframe)
      else
        SL.domReady(function(){
          document.getElementsByTagName('body')[0].appendChild(iframe)
        })
    },

    scriptURL: function(url){
      var scriptDir = SL.settings.scriptDir || ''
      return scriptDir + url
    },

    // `loadScript(options)
    // ------------------------------
    //
    // Load any number of Javascript files using dynamically generated script tags.
    // If you provide multiple file URLs, they will be loaded sequentially.
    $loadScript: function(elm, evt, options){
      var scripts = options.scripts
          , sequential = options.sequential
          , loadOn = options.loadOn
      var doit = SL.bind(function(){
        if (sequential){
          this.loadScripts(elm, evt, scripts)
        }else{
          SL.each(scripts, function(script){
            this.loadScripts(elm, evt, [script])
          }, this)
        }
      }, this)

      if (!loadOn) doit()
      else if (loadOn === 'domready') SL.domReady(doit)
      else if (loadOn === 'load') SL.addEventHandler(window, 'load', doit)
    },

    loadScripts: function(elm, evt, scripts) {
      try{
        var scripts = scripts.slice(0)
            , q = this.asyncScriptCallbackQueue
            , lastScript
            , target = evt.target || evt.srcElement
            , self = this
      }catch(e){
        console.error('scripts is', SL.stringify(scripts))
      }
      function loadNext(){
        if (q.length > 0 && lastScript){
          var callback = q.shift()
          callback.call(elm, evt, target)
        }
        var script = scripts.shift()
        if (script){
          var host = SL.data.host
              , src = self.scriptURL(script.src)
          if (host)
            src = SL.basePath() + src
          lastScript = script
          SL.loadScript(src, loadNext)
        }
      }
      loadNext()
    },

    $loadBlockingScript: function(elm, evt, options){
      var scripts = options.scripts
          , loadOn = options.loadOn
      var doit = SL.bind(function(){
        SL.each(scripts, function(script){
          this.loadBlockingScript(elm, evt, script)
        }, this)
      }, this)
      //if (!loadOn || loadOn === evt.type) doit()
      doit()
    },

    loadBlockingScript: function(elm, evt, script){
      /*jshint evil:true */
      var src = this.scriptURL(script.src)
          , host = SL.data.host
          , target = evt.target || evt.srcElement
      if (host)
        src = SL.basePath() + src
      this.argsForBlockingScripts.push([elm, evt, target])
      SL.loadScriptSync(src)
    },

    pushAsyncScript: function(callback){
      this.asyncScriptCallbackQueue.push(callback)
    },

    pushBlockingScript: function(callback){
      var args = this.argsForBlockingScripts.shift()
      var element = args[0]
      callback.apply(element, args.slice(1))
    },

    // `writeHTML(html)`
    // -----------------
    //
    // Write an HTML fragment onto the page using `document.write()`.
    //
    // - `html` - the HTML fragment
    $writeHTML: function(elm, evt){
      /*jshint evil:true */
      if (SL.domReadyFired || !document.write){
        SL.notify('Command writeHTML failed. You should try appending HTML using the async option.', 1)
        return
      }
      if (evt.type !== 'pagebottom' && evt.type !== 'pagetop'){
        SL.notify('You can only use writeHTML on the `pagetop` and `pagebottom` events.', 1)
        return
      }
      for (var i = 2, len = arguments.length; i < len; i++){
        var html = arguments[i].html
        html = SL.replace(html, elm, evt)
        document.write(html)
      }
    },

    linkNeedsDelayActivate: function(a, win){
      win = win || window
      var tagName = a.tagName
          , target = a.getAttribute('target')
          , location = a.getAttribute('href')
      if (tagName && tagName.toLowerCase() !== 'a')
        return false
      if (!location)
        return false
      else if (!target)
        return true
      else if (target === '_blank')
        return false
      else if (target === '_top')
        return win.top === win
      else if (target === '_parent')
        return false
      else if (target === '_self')
        return true
      else if (win.name)
        return target === win.name
      else
        return true
    },

    // `delayActivateLink()`
    // ---------------------
    //
    // Delay the activation of an anchor link by first using `evt.preventDefault()` on
    // the click event, and then setting the window location to the destination after
    // a small delay. The default delay is 100 milliseconds, which can be configured in
    // `_satellite.settings.linkDelay`
    $delayActivateLink: function(elm, evt){
      if (!this.linkNeedsDelayActivate(elm)) return
      SL.preventDefault(evt)
      var linkDelay = SL.settings.linkDelay || 100
      setTimeout(function(){
        SL.setLocation(elm.href)
      }, linkDelay)
    },

    isQueueable: function(trig){
      return trig.command !== 'writeHTML'
    }
  })
  SL.availableTools['default'] = DefaultTool

// The Google Analytics Universal Tool
// ================
//
// This tool interacts with the [GAU library](https://developers.google.com/analytics/devguides/collection/analyticsjs/).
//
// From a high end perspective the following steps will happen. A `ga` dummy
// object will be initialized. Until the `analytics.js` file will be loaded in
// the browser, any triggered command will be queued in the `ga` object. Once
// the `analytics.js` will finish to load, all the queued commands will be
// executed.
//
// The tool is initialized during one of the following page load phases:
// top, bottom. Find out more info about the initializing sequence by clicking
// [here](#-endplphase-).
//
// Beside the settings that are processed by the BaseTool code, this tool uses
// the following extra settings:
//
// - `engine` - The engine identifier (ga_universal)
// - `loadOn` - The PL phase when this tool will be initialized (top | bottom)
// - `url` - Custom URL of the `analytics.js` URL location. If none is provided
//      the Google default URL will be used.
// - `initTool` - Boolean flag that can suppress the tool initialization phase.
//      When set to `false` no JS library will be loaded and no initial command
//      will be executed. All the later commands triggered by this tool will
//      piggy back on any availble `ga` function from the page.
// - `trackerSettings` - Object containing properties that will be added on the
//      command that will create the GAU tracker. For a list of all supported
//      properties please click [here](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#create)
// - `initCommands` - It's an array containing commands. A command example:
//      `["set", "anonymizeIp", true]`. For a list of all supported commands
//      please click [here](https://developers.google.com/analytics/devguides/collection/analyticsjs/method-reference#tracker)
//      The commands defined here will be executed after the tracker is created.
// - `allowLinker` - Flag that will make the GAU library load the cross domain
//      linking plugin.
// - `customInit` - JS code that will be executed immediately after the tool is
//      initialized. The boolean result from `customInit` will affect the
//      initial page view call.

  function GAUniversalTool(settings) {
    SL.BaseTool.call(this, settings)
  }

  SL.inherit(GAUniversalTool, SL.BaseTool);

  SL.extend(GAUniversalTool.prototype, {
    // Public
    // ------------------------------------------------
    name: 'GAUniversal',

    // `endPLPhase()`
    // ------------------------------------------------
    //
    // Method that starts the tool initialization when the page load phase is
    // matched and only if the tool initialization has not been previously
    // cancelled. Find out more info about the initializing sequence by clicking
    // [here](#-initialize-).
    //
    // After the tool is initialized a page view call is triggered if
    // `suppressInitialPageView` flag is not set to `true`.
    endPLPhase: function(pageLoadEvent) {
      var settings = this.settings;
      var loadOn = settings.loadOn;

      if (this.isPageCodeLoadSuppressed()) {
        SL.notify('GAU: Page code not loaded(suppressed).', 1);
        return;
      }

      if (pageLoadEvent === loadOn) {
        SL.notify('GAU: Initializing at ' + pageLoadEvent, 1);
        this.initialize();
        this.flushQueue();

        if (this.suppressInitialPageView)
          return;

        this.call('send', 'pageview');
      }
    },

    // `getTrackerName()`
    // ------------------------------------------------
    //
    // Returns the name of the GA tracker initialized by this tool.
    getTrackerName: function () {
      return this.settings.trackerSettings.name || '';
    },

    // Private
    // ------------------------------------------------
    isPageCodeLoadSuppressed: function() {
      return this.settings.initTool === false || this._cancelToolInit === true;
    },

    // `initialize()`
    // ------------------------------------------------
    //
    // The method first creates the GA scaffolding objects (the `ga` object and
    // the `GoogleAnalyticsObject` object.
    //
    // Then it loads the `analytics.js` library and append the command that will
    // create the GAU tracker object to the `ga` object.
    //
    // Next, the commands from the `initCommands` array will be appended to
    // the `ga` object. Finally the JS code defined in the `customInit` setting
    // variable will be called.
    initialize: function() {
      var gaName = 'ga';

      window[gaName] = window[gaName] || this.createGAObject();
      window.GoogleAnalyticsObject = gaName;

      SL.notify('GAU: Page code loaded.', 1);
      SL.loadScriptOnce(this.getToolUrl());

      var settings = this.settings;

      if (GAUtils.allowLinker() && settings.allowLinker !== false) {
        this.createAccountForLinker();
      } else {
        this.createAccount();
      }

      this.executeInitCommands();

      if (settings.customInit){
        var customInit = settings.customInit
        var result = customInit(window[gaName], this.getTrackerName())
        if (result === false){
          this.suppressInitialPageView = true;
        }
      }

      this.initialized = true;
    },

    createGAObject: function() {
      var ga = function() {
        ga.q.push(arguments);
      };

      ga.q = [];
      ga.l = 1 * new Date();
      return ga;
    },

    createAccount: function() {
      this.create();
    },

    createAccountForLinker: function() {
      var options = {};
      if (GAUtils.allowLinker())
        options.allowLinker = true;

      this.create(options);
      this.call('require', 'linker');
      this.call('linker:autoLink', this.autoLinkDomains(), false, true);
    },

    create: function(extra){
      var options = this.settings.trackerSettings;

      if (!options.cookieDomain) {
        options.cookieDomain = GAUtils.cookieDomain();
      }

      SL.extend(options, extra || {});
      this.call('create', options);
    },

    autoLinkDomains: function() {
      var ourDomain = location.hostname;
      return SL.filter(SL.settings.domainList, function(domain) {
        return domain !== ourDomain;
      });
    },

    executeInitCommands: function() {
      var settings = this.settings;

      if (settings.initCommands) {
        SL.each(settings.initCommands, function(command) {
          this.call.apply(this, command);
        }, this);
      }
    },

    call: function() {
      if (typeof ga !== 'function') {
        SL.notify('GA Universal function not found!', 4);
        return;
      }

      if (this.isCallSuppressed()) {
        return;
      }

      arguments[0] = this.cmd(arguments[0]);
      this.log(SL.toArray(arguments));
      ga.apply(window, arguments);
    },

    isCallSuppressed: function() {
      return this._cancelToolInit === true;
    },

    $missing$: function(command, elm, evt, args) {
      args = args || [];

      args = [command].concat(args);
      this.call.apply(this, args);
    },

    getToolUrl: function() {
      var settings = this.settings;
      var isHttps = SL.isHttps();

      if (settings.url) {
        return isHttps ? settings.url.https : settings.url.http;
      }

      return (isHttps ? 'https://ssl' : 'http://www') + '.google-analytics.com/analytics.js';
    },

    cmd: function(command) {
      var trackerCommands = ['send', 'set', 'get'];
      var trackerName = this.getTrackerName();

      if (!trackerName || SL.indexOf(trackerCommands, command) === -1) {
        return command;
      }

      return trackerName + '.' + command;
    },

    log: function(args) {
      var cmd = args[0];
      var tracker = this.getTrackerName() || 'default';

      var msg = 'GA Universal: sent command ' + cmd + ' to tracker ' + tracker;
      if (args.length > 1) {
        var parameters = SL.stringify(args.slice(1));
        msg += ' with parameters ' + SL.stringify(args.slice(1));
      }
      msg += '.';
      SL.notify(msg, 1);
    }
  });

  SL.availableTools.ga_universal = GAUniversalTool;

// Google Analytics Tool
// ---------------------
//
// The GATool allows you to use any Google Analytics command.
// Example:
//
//      trigger: [
//          {
//              tool: "ga",
//              command: "trackEvent",
//              arguments: [
//                  "video",
//                  "video 10% complete"
//              ]
//          }
//      ]
//
// This trigger will call the `trackEvent` method, which is equivalent to
//
//     _gaq.push(['_trackEvent', 'video', 'video 10% complete'])
  function GATool(settings){
    SL.BaseTool.call(this, settings)
  }
  SL.inherit(GATool, SL.BaseTool)
  SL.extend(GATool.prototype, {
    name: 'GA',
    initialize: function(){
      var settings = this.settings
      var before = window._gaq
          , initCommands = settings.initCommands || []
          , customInit = settings.customInit

      if (!before){
        // And yes, I *do* mean to set a global variable
        // of `_gaq` here
        _gaq = []
      }

      if (!this.isSuppressed()){
        if (!before && !GATool.scriptLoaded){
          var https = SL.isHttps()
          var url =
              (https ? 'https://ssl' : 'http://www') +
              '.google-analytics.com/ga.js'
          if (settings.url){
            url = https ? settings.url.https : settings.url.http
          }
          SL.loadScript(url)
          GATool.scriptLoaded = true
          SL.notify('GA: page code loaded.', 1)
        }
        var domain = settings.domain
            , trackerName = settings.trackerName
            , allowLinker = GAUtils.allowLinker()
            , account = settings.account
            , domainList = SL.settings.domainList || []
        _gaq.push([this.cmd('setAccount'), account])
        if (allowLinker)
          _gaq.push([this.cmd('setAllowLinker'), allowLinker])
        _gaq.push([this.cmd('setDomainName'), GAUtils.cookieDomain()])
        SL.each(initCommands, function(cmd){
          var arr = [this.cmd(cmd[0])].concat(cmd.slice(1))
          _gaq.push(arr)
        }, this)
        if (customInit)
          this.suppressInitialPageView = false === customInit(_gaq, trackerName)
        if (settings.pageName)
          this.$overrideInitialPageView(null, null, settings.pageName)
      }else{
        SL.notify('GA: page code not loaded(suppressed).', 1)
      }

      this.initialized = true
      SL.fireEvent(this.id + '.configure', _gaq, trackerName)

    },
    isSuppressed: function(){
      return this._cancelToolInit || this.settings.initTool === false
    },
    tracker: function(){
      return this.settings.trackerName
    },
    cmd: function(cmd){
      var tracker = this.tracker()
      return tracker ? tracker + '._' + cmd : '_' + cmd
    },
    $overrideInitialPageView: function(elm, evt, url){
      this.urlOverride = url
    },
    trackInitialPageView: function(){
      if (this.isSuppressed()) return
      if (this.suppressInitialPageView) return
      if (this.urlOverride){
        var args = SL.preprocessArguments([this.urlOverride], location, null, this.forceLowerCase)
        this.$missing$('trackPageview', null, null, args)
      }else{
        this.$missing$('trackPageview')
      }
    },
    endPLPhase: function(pageLoadEvent){
      var loadOn = this.settings.loadOn
      if (pageLoadEvent === loadOn){
        SL.notify('GA: Initializing at ' + pageLoadEvent, 1)
        this.initialize()
        this.flushQueue()
        this.trackInitialPageView()
      }
    },
    call: function(cmd, elm, evt, args){
      if (this._cancelToolInit) return
      var settings = this.settings
          , tracker = this.tracker()
          , fullCmd = this.cmd(cmd)
          , args = args ? [fullCmd].concat(args) : [fullCmd]
      _gaq.push(args)
      if (tracker)
        SL.notify("GA: sent command " + cmd + " to tracker " + tracker +
        (args.length > 1 ?
        " with parameters [" + args.slice(1).join(', ') + "]" :
            '') + ".", 1)
      else
        SL.notify("GA: sent command " + cmd +
        (args.length > 1 ?
        " with parameters [" + args.slice(1).join(', ') + "]":
            '') + ".", 1)
    },
    $missing$: function(cmd, elm, evt, args){
      this.call(cmd, elm, evt, args)
    },
    // individual command methods
    $postTransaction: function(elm, evt, varname){
      var trans = SL.data.customVars.transaction = window[varname]
      this.call('addTrans', elm, evt, [
        trans.orderID,
        trans.affiliation,
        trans.total,
        trans.tax,
        trans.shipping,
        trans.city,
        trans.state,
        trans.country
      ])
      SL.each(trans.items, function(item){
        this.call('addItem', elm, evt, [
          item.orderID,
          item.sku,
          item.product,
          item.category,
          item.unitPrice,
          item.quantity
        ])
      }, this)
      this.call('trackTrans', elm, evt)
    },
    delayLink: function(elm, evt){
      var ga = this
      if (!GAUtils.allowLinker()) return
      if (!elm.hostname.match(this.settings.linkerDomains)) return
      if (SL.isSubdomainOf(elm.hostname, location.hostname)) return
      SL.preventDefault(evt)
      var linkDelay = SL.settings.linkDelay || 100
      setTimeout(function(){
        ga.call('link', elm, evt, [elm.href])
      }, linkDelay)
    },
    popupLink: function(elm, evt){
      if (!window._gat) return
      SL.preventDefault(evt)
      var account = this.settings.account
      var tracker = window._gat._createTracker(account)
      var url = tracker._getLinkerUrl(elm.href)
      window.open(url)
    },
    $link: function(elm, evt){
      if (elm.getAttribute('target') === '_blank'){
        this.popupLink(elm, evt)
      }else{
        this.delayLink(elm, evt)
      }
    },
    $trackEvent: function(elm, evt){
      var args = Array.prototype.slice.call(arguments, 2)
      if (args.length >= 4 && args[3] != null){
        // acertain that the 4th element is a number, falling back to 1
        var value = parseInt(args[3], 10)
        if (SL.isNaN(value)){
          value = 1
        }
        args[3] = value
      }
      this.call('trackEvent', elm, evt, args)
    }
  })
  SL.availableTools.ga = GATool

  var GAUtils = {
    allowLinker: function() {
      return SL.hasMultipleDomains();
    },
    cookieDomain: function() {
      var domainList = SL.settings.domainList;
      var domainName = SL.find(domainList, function(domain) {
        var hostname = window.location.hostname;
        return SL.equalsIgnoreCase(
            hostname.slice(hostname.length - domain.length),
            domain);
      });
      var cookieDomain = domainName ? ('.' + domainName) : 'auto';

      return cookieDomain;
    }
  };

// Basic Tool
// ------------
//
// This is a generic tool that allows integrating with
// various simple tools.
//

  function BasicTool(settings){
    SL.BaseTool.call(this, settings)

    this.name = settings.name || 'Basic'
  }

  SL.inherit(BasicTool, SL.BaseTool)

  SL.extend(BasicTool.prototype, {
    initialize: function(){
      var settings = this.settings
      if (this.settings.initTool !== false){
        var url = settings.url
        if (typeof url === 'string'){
          url = SL.basePath() + url
        }else{
          url = SL.isHttps() ? url.https : url.http
        }
        SL.loadScript(url, SL.bind(this.onLoad, this))
        this.initializing = true
      }else{
        this.initialized = true
      }
    },
    isQueueAvailable: function(){
      return !this.initialized
    },
    onLoad: function(){
      this.initialized = true
      this.initializing = false
      if (this.settings.initialBeacon){
        this.settings.initialBeacon()
      }
      this.flushQueue()
    },
    endPLPhase: function(pageLoadEvent){
      var loadOn = this.settings.loadOn
      if (pageLoadEvent === loadOn){
        SL.notify(this.name + ': Initializing at ' + pageLoadEvent, 1)
        this.initialize()
      }
    },
    $fire: function(elm, evt, fun){
      if (this.initializing){
        this.queueCommand({
          command: 'fire',
          arguments: [fun]
        }, elm, evt)
        return
      }
      fun.call(this.settings, elm, evt)
    }
  })

  SL.availableTools.am = BasicTool
  SL.availableTools.adlens = BasicTool
  SL.availableTools.__basic = BasicTool

// The Marketing Cloud Visitor ID Service Tool
// ================
//
// This tool interacts with the [Visitor ID library](https://git.corp.adobe.com/mc-visitor/VisitorAPI/tree/master/js/src).
// The tool initilizes the Visitor ID library as soon as the tool itself is
// created, by calling the `initialize` method. Find out more info about the
// initializing sequence by clicking [here](#-initialize-).
//
// The tool accepts the following settings:
//
// - `mcOrgId` - The Adobe Marketing Cloud Organization ID (Required)
// - `namespace` - Namespace to migrate from (Optional)
// - `initVars` - Map containing properties that can be set on the Visitor ID
//      instance. The following keys can be set here:
//      * `trackingServer`,
//      * `trackingServerSecure`,
//      * `marketingCloudServer`
//      * `marketingCloudServerSecure`
// - `customerIDs` - Map containing Customer IDs values that will be set on the
//      instance
// - `autoRequest` - Flag that will read the Marketing Cloud Visitor ID by
//      calling `getMarketingCloudVisitorID` method
  function VisitorIdTool(settings) {
    SL.BaseTool.call(this, settings);
    this.name = settings.name || 'VisitorID';

    this.initialize();
  }

  SL.extend(VisitorIdTool.prototype, {
    // Public
    // ------------------------------------------------
    //
    // `getInstance()`
    // ------------------------------------------------
    //
    // Returns the Visitor ID instance that was created when the tool was
    // initialized.
    getInstance: function() {
      return this.instance;
    },

    // Private
    // ------------------------------------------------
    //
    // `initialize()`
    // ------------------------------------------------
    //
    // The method creates a Visitor ID instance if all the data provided is valid.
    // The instance will contain all the keys defined in the `initVar` setting.
    // Any `dataElement` present as a value in the initVars map will be replaced
    // with the correct value.
    //
    // It applies then a the map of Customer IDs by calling the `setCustomerIDs`
    // method from the newly created instance. Any `dataElement` present as a
    // value in the Customer IDs map will be replaced with the correct value.
    //
    // After that, the `getMarketingCloudVisitorID` method from the newly created
    // instance is called, provided that the `autoRequest` settings is set to true.
    initialize: function() {
      var settings = this.settings, visitor;

      SL.notify('Visitor ID: Initializing tool', 1);

      visitor = this.createInstance(
          settings.mcOrgId,
          settings.namespace,
          settings.initVars
      );
      if (visitor === null) {
        return;
      }

      if (settings.customerIDs) {
        this.applyCustomerIDs(visitor, settings.customerIDs);
      }

      if (settings.autoRequest) {
        visitor.getMarketingCloudVisitorID();
      }

      this.instance = visitor;
    },

    createInstance: function(mcOrgId, namespace, initVars) {
      if(!SL.isString(mcOrgId)) {
        SL.notify(
            'Visitor ID: Cannot create instance using mcOrgId: "' + mcOrgId + '"', 4);
        return null;
      }

      SL.notify(
          'Visitor ID: Create instance using mcOrgId: "' + mcOrgId + '"', 1);

      var instance = new Visitor(mcOrgId, namespace);
      this.applyInitVars(instance, initVars);

      return instance;
    },

    applyInitVars: function(obj, vars) {
      if (SL.isObject(vars) === false) {
        return;
      }
      vars = this.parseValues(vars);

      SL.extend(obj, vars);
      SL.notify('Visitor ID: Set variables: ' + SL.stringify(vars), 1);
    },

    applyCustomerIDs: function(instance, ids) {
      if (SL.isObject(ids) === false) {
        return;
      }
      ids = this.parseValues(ids);

      instance.setCustomerIDs(ids);
      SL.notify('Visitor ID: Set Customer IDs: ' + SL.stringify(ids), 1);
    },

    parseValues: function(hash) {
      var obj = {};

      for (var v in hash) {
        if (hash.hasOwnProperty(v)) {
          obj[v] = SL.replace(hash[v]);
        }
      }

      return obj;
    }
  });

  SL.availableTools.visitor_id = VisitorIdTool;

// E-Commerce APIs
// ---------------
//
// The ecommerce API allows web admins to integrate e-commerce tracking with Satellite.
// More details on the [GA E-Commerce API's](http://code.google.com/apis/analytics/docs/gaJS/gaJSApiEcommerce.html).
// Upon any of the methods on the API being called, they will fire an event, which
// in turn can be handled by a rule in the library.

  SL.ecommerce = {
    // `addItem(orderId, sku, name, category, price, quantity)`
    // -------------------------------------
    //
    // Add an item to the transaction.
    addItem: function(){
      var args = [].slice.call(arguments)
      SL.onEvent({type: 'ecommerce.additem', target: args})
    },

    // `addTrans(orderId, affiliation, total, tax, shipping, city, state, country)`
    // ----------------------------------------------------------------------------
    //
    // Add a new transaction.
    addTrans: function(){
      var args = [].slice.call(arguments)
      SL.data.saleData.sale = {
        orderId: args[0],
        revenue: args[2]
      }
      SL.onEvent({type: 'ecommerce.addtrans', target: args})
    },

    // `trackTrans()`
    // --------------
    //
    // Send the transaction data that's been set up using `addItem()` and `addTrans()`
    // to GA to be tracked.
    trackTrans: function(){
      SL.onEvent({type: 'ecommerce.tracktrans', target: []})
    }
  }

// ElementExistsEventEmitter
// ==================
//
// Emits the `elementexists` event. The `elementexists` event fires when an element
// of a specified selector becomes into existance - either because it's in the page
// markup or dynamically injected later on. *Each rule only fires once.*

  function ElementExistsEventEmitter(){
    this.rules = SL.filter(SL.rules, function(rule){
      return rule.event === 'elementexists'
    })
  }
  ElementExistsEventEmitter.prototype.backgroundTasks = function(){
    SL.each(this.rules, function(rule){
      SL.cssQuery(rule.selector, function(elms){
        if (elms.length > 0){
          var elm = elms[0]
          if (SL.$data(elm, 'elementexists.seen')) return
          SL.$data(elm, 'elementexists.seen', true)
          SL.onEvent({type: 'elementexists', target: elm})
        }
      })
    })
  }

  SL.availableEventEmitters.push(ElementExistsEventEmitter)

// VideoPlayedEventEmitter
// =======================
//
// Emits the `videoplayed` event, given a specified percentage or duration, i.e. `videoplayed`
// is a parameterized event. A rule looks like this
//
//      {
//          name: "Video 10% complete",
//          event: "videoplayed(10%)",
//          selector: "#video",
//          trigger: [
//              {
//                  tool: "ga",
//                  command: "trackEvent",
//                  arguments: [
//                      "video",
//                      "video 10% complete",
//                      "from: %URI%"
//                  ]
//              }
//          ]
//      }
//
// `10%` is in the paranthesis which indicates this rule will only fire when the 10%
// of the total length of the video has been played.
// You can also specifiy a duration in seconds, which looks like `videoplayed(8s)` - which
// stands for 8 seconds.

  function VideoPlayedEventEmitter(){
    this.rules = SL.filter(SL.rules, function(rule){
      return rule.event.substring(0, 11) === 'videoplayed'
    })
    this.eventHandler = SL.bind(this.onUpdateTime, this)
  }
  VideoPlayedEventEmitter.prototype = {
    backgroundTasks: function(){
      var eventHandler = this.eventHandler
      SL.each(this.rules, function(rule){
        SL.cssQuery(rule.selector || 'video', function(elms){
          SL.each(elms, function(elm){
            if (SL.$data(elm, 'videoplayed.tracked')) return
            SL.addEventHandler(elm, 'timeupdate', SL.throttle(eventHandler, 100))
            SL.$data(elm, 'videoplayed.tracked', true)
          })
        })
      })
    },
    evalRule: function(elm, rule){
      var eventType = rule.event
          , seekable = elm.seekable
          , startTime = seekable.start(0)
          , endTime = seekable.end(0)
          , currentTime = elm.currentTime
          , m = rule.event.match(/^videoplayed\(([0-9]+)([s%])\)$/)
      if (!m) return
      var unit = m[2]
          , amount = Number(m[1])
      var func = unit === '%' ?
          function(){
            return amount <=
                100 * (currentTime - startTime) / (endTime - startTime)
          } :
          function(){
            return amount <= currentTime - startTime
          }
      if (!SL.$data(elm, eventType) && func()){
        SL.$data(elm, eventType, true)
        SL.onEvent({type: eventType, target: elm})
      }
    },
    onUpdateTime: function(e){
      var rules = this.rules
          , elm = e.target
      if (!elm.seekable || elm.seekable.length === 0) return
      for (var i = 0, len = rules.length; i < len; i++)
        this.evalRule(elm, rules[i])
    }
  }
  SL.availableEventEmitters.push(VideoPlayedEventEmitter)

// InviewEventEmitter
// ==================
//
// Emits the `inview` event. The `inview` event fires on an element when the element
// first comes into the view of the user. If the element is in view immediately upon page
// load, it will be fired right away, if it only comes in view after some scrolling, it
// will fire then. An optional delay interval `inviewDelay` can be specified in the rule
// which determine how long the element has to be in view for before the event fires,
// of which the default value is 1 second.

  function InViewEventEmitter(rules){
    rules = rules || SL.rules
    this.rules = SL.filter(rules, function(rule){
      return rule.event === 'inview'
    })
    this.elements = []
    this.eventHandler = SL.bind(this.track, this)
    SL.addEventHandler(window, 'scroll', this.eventHandler)
    SL.addEventHandler(window, 'load', this.eventHandler)
  }

// Util functions needed by `InViewEventEmitter`
  InViewEventEmitter.offset = function(elem) {
    var box

    try {
      box = elem.getBoundingClientRect()
    } catch(e) {}

    var doc = document,
        docElem = doc.documentElement

    var body = doc.body,
        win = window,
        clientTop  = docElem.clientTop  || body.clientTop  || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop,
        scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        top  = box.top  + scrollTop  - clientTop,
        left = box.left + scrollLeft - clientLeft

    return { top: top, left: left }
  }
  InViewEventEmitter.getViewportHeight = function() {
    var height = window.innerHeight // Safari, Opera
    var mode = document.compatMode

    if (mode) { // IE, Gecko
      height = (mode == 'CSS1Compat') ?
          document.documentElement.clientHeight : // Standards
          document.body.clientHeight // Quirks
    }

    return height
  }
  InViewEventEmitter.getScrollTop = function(){
    return (document.documentElement.scrollTop ?
        document.documentElement.scrollTop :
        document.body.scrollTop)
  }

  InViewEventEmitter.prototype = {
    backgroundTasks: function(){
      var elements = this.elements
          , self = this
      SL.each(this.rules, function(rule){
        SL.cssQuery(rule.selector, function(elms){
          var addCount = 0
          SL.each(elms, function(elm){
            if (!SL.contains(elements, elm)){
              elements.push(elm)
              addCount++
            }
          })
          if (addCount){
            SL.notify(rule.selector + ' added ' + addCount + ' elements.', 1)
          }
        })
      })
      this.track()
    },
    elementIsInView: function(el){
      var vpH = InViewEventEmitter.getViewportHeight()
          , scrolltop = InViewEventEmitter.getScrollTop()
          , top = InViewEventEmitter.offset(el).top
          , height = el.offsetHeight
      return !(scrolltop > (top + height) || scrolltop + vpH < top)
    },
    checkInView: function(el, recheck){
      var inview = SL.$data(el, 'inview')
      if (this.elementIsInView(el)) {
        // it is in view now
        if (!inview)
          SL.$data(el, 'inview', true)
        var self = this
        this.processRules(el, function(rule, viewedProp, timeoutIdProp){
          if (recheck || !rule.inviewDelay){
            SL.$data(el, viewedProp, true)
            SL.onEvent({type: 'inview', target: el, inviewDelay: rule.inviewDelay})
          }else if(rule.inviewDelay){
            var timeout = SL.$data(el, timeoutIdProp)
            if (timeout)
              clearTimeout(timeout)
            timeout = setTimeout(function(){
              self.checkInView(el, true)
            }, rule.inviewDelay)
            SL.$data(el, timeoutIdProp, timeout)
          }
        })
      } else {
        // it is not in view now
        if (inview)
          SL.$data(el, 'inview', false)
        this.processRules(el, function(rule, viewedProp, timeoutIdProp){
          var timeout = SL.$data(el, timeoutIdProp)
          if (timeout){
            clearTimeout(timeout)
          }
        })
      }
    },
    track: function(){
      SL.each(this.elements, function(elm){
        this.checkInView(elm)
      }, this)
    },
    processRules: function(elm, callback){
      SL.each(this.rules, function(rule, i){
        // viewedProp: for rules that has a timeout, the definition for
        // "viewed" is rule dependent. But for all rules that do not have
        // a timeout, it is independent.
        var viewedProp = rule.inviewDelay ? 'viewed_' + rule.inviewDelay : 'viewed'
        var timeoutIdProp = 'inview_timeout_id_' + i
        if (SL.$data(elm, viewedProp)) return
        if (SL.matchesCss(rule.selector, elm)){
          callback(rule, viewedProp, timeoutIdProp)
        }
      })
    }
  }

  SL.availableEventEmitters.push(InViewEventEmitter)

// Twitter Event Emitter
// =====================
//
// Emits the `twitter.tweet` event in the event a user tweets from the site.
  function TwitterEventEmitter(twttr){
    SL.domReady(SL.bind(function () {
      this.twttr = twttr || window.twttr;
      this.initialize();
    }, this));
  }

  TwitterEventEmitter.prototype = {
    initialize: function(){
      var twttr = this.twttr;
      if (twttr && typeof twttr.ready === 'function') {
        twttr.ready(SL.bind(this.bind, this));
      }
    },

    bind: function(){
      this.twttr.events.bind('tweet', function(event) {
        if (event) {
          SL.notify("tracking a tweet button", 1);
          SL.onEvent({type: 'twitter.tweet', target: document});
        }
      });

    }
  }
  SL.availableEventEmitters.push(TwitterEventEmitter)

// Hover Event Emitter
// =====================
//
// Emits the `hover` event in the event. This is better than `mouseover` because you can introduce a certain delay.
//
//  {
//        name: "Hover for 1 second"
//        event: "hover(1000)",
//        ...
//  }
  function HoverEventEmitter(){
    var eventRegex = this.eventRegex = /^hover\(([0-9]+)\)$/
    var rules = this.rules = []
    SL.each(SL.rules, function(rule){
      var m = rule.event.match(eventRegex)
      if (m){
        rules.push([
          Number(rule.event.match(eventRegex)[1]),
          rule.selector
        ])
      }
    })
  }
  HoverEventEmitter.prototype = {
    backgroundTasks: function(){
      var self = this
      SL.each(this.rules, function(rule){
        var selector = rule[1]
            , delay = rule[0]
        SL.cssQuery(selector, function(newElms){
          SL.each(newElms, function(elm){
            self.trackElement(elm, delay)
          })
        })
      }, this)
    },
    trackElement: function(elm, delay){
      var self = this
          , trackDelays = SL.$data(elm, 'hover.delays')
      if (!trackDelays){
        SL.addEventHandler(elm, 'mouseover', function(e){
          self.onMouseOver(e, elm)
        })
        SL.addEventHandler(elm, 'mouseout', function(e){
          self.onMouseOut(e, elm)
        })
        SL.$data(elm, 'hover.delays', [delay])
      }
      else if (!SL.contains(trackDelays, delay)){
        trackDelays.push(delay)
      }
    },
    onMouseOver: function(e, elem){
      var target = e.target || e.srcElement
          , related = e.relatedTarget || e.fromElement
          , hit = (elem === target || SL.containsElement(elem, target)) &&
              !SL.containsElement(elem, related)
      if (hit)
        this.onMouseEnter(elem)
    },
    onMouseEnter: function(elm){
      var delays = SL.$data(elm, 'hover.delays')
      var delayTimers = SL.map(delays, function(delay){
        return setTimeout(function(){
          SL.onEvent({type: 'hover(' + delay + ')', target: elm})
        }, delay)
      })
      SL.$data(elm, 'hover.delayTimers', delayTimers)
    },
    onMouseOut: function(e, elem){
      var target = e.target || e.srcElement
          , related = e.relatedTarget || e.toElement
          , hit = (elem === target || SL.containsElement(elem, target)) &&
              !SL.containsElement(elem, related)
      if (hit)
        this.onMouseLeave(elem)
    },
    onMouseLeave: function(elm){
      var delayTimers = SL.$data(elm, 'hover.delayTimers')
      if (delayTimers)
        SL.each(delayTimers, function(timer){
          clearTimeout(timer)
        })
    }
  }
  SL.availableEventEmitters.push(HoverEventEmitter)

// Orientation Change Event Emitter
// ================================
//
// The `orientationchange` event on mobile devices fire when the devices switchs between
// portrait and landscape modes. You can use `%event.orientation%` in your command arguments
// to evaluate to either `portrait` or `landscape`.
  function OrientationChangeEventEmitter(){
    SL.addEventHandler(window, "orientationchange", OrientationChangeEventEmitter.orientationChange)
  }
  OrientationChangeEventEmitter.orientationChange = function (e) {
    var orientation = window.orientation === 0 ?
        'portrait' :
        'landscape'
    e.orientation = orientation
    SL.onEvent(e)
  }
  SL.availableEventEmitters.push(OrientationChangeEventEmitter)

// Facebook Event Emitter
// ======================
//
// Will track `edge.create`, `edge.remove` and `message.send` events from the Facebook
// Javascript API and emit `facebook.like`, `facebook.unlike` and `facebook.send` events
// respectively.

  function FacebookEventEmitter(FB){
    this.delay = 250;
    this.FB = FB;

    SL.domReady(SL.bind(function () {
      SL.poll(SL.bind(this.initialize, this), this.delay, 8);
    }, this));
  }

  FacebookEventEmitter.prototype = {
    initialize: function() {
      this.FB = this.FB || window.FB;

      if (this.FB && this.FB.Event && this.FB.Event.subscribe) {
        this.bind();
        return true;
      }
    },

    bind: function(){
      this.FB.Event.subscribe('edge.create', function() {
        SL.notify("tracking a facebook like", 1)
        SL.onEvent({type: 'facebook.like', target: document})
      });

      this.FB.Event.subscribe('edge.remove', function() {
        SL.notify("tracking a facebook unlike", 1)
        SL.onEvent({type: 'facebook.unlike', target: document})
      });

      this.FB.Event.subscribe('message.send', function() {
        SL.notify("tracking a facebook share", 1)
        SL.onEvent({type: 'facebook.send', target: document})
      });
    }
  }
  SL.availableEventEmitters.push(FacebookEventEmitter);

  var adobeAnalyticsAction = (function() {
    var instanceById = {};

    var trackTypeMethodMap = {
      pageView: 'trackPageView',
      link: 'trackLink'
    };

    // TODO: Handle canceling tool initialization (suppression?).
    // TODO: Handle custom setup functions (funs, as it were)?
    var AdobeAnalyticsExtension = function(extensionSettings) {
      this.extensionSettings = extensionSettings;
    };

    AdobeAnalyticsExtension.prototype.queryStringParamMap = {
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

    AdobeAnalyticsExtension.prototype.translateToQueryStringParam = function(queryStringObj, key, value) {
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
    };

    AdobeAnalyticsExtension.prototype.remodelDataToQueryString = function(data) {
      var queryStringParams = {};
      var key;

      queryStringParams.t = this.getTimestamp();

      var browserInfo = data.browserInfo;

      if (browserInfo) {
        for (key in browserInfo) {
          if (browserInfo.hasOwnProperty(key)) {
            var browserInfoValue = browserInfo[key];
            if (browserInfoValue) {
              this.translateToQueryStringParam(queryStringParams, key, browserInfoValue);
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
    };

    AdobeAnalyticsExtension.prototype.getTrackingURI = function(queryString) {
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
    };

    AdobeAnalyticsExtension.prototype.getTimestamp = function() {
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

    AdobeAnalyticsExtension.prototype.getTrackingServer = function() {
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
    };

    AdobeAnalyticsExtension.prototype.trackPageView = function(actionSettings) {
      var trackVars = {};
      SL.extend(trackVars, this.extensionSettings.trackVars);
      SL.extend(trackVars, actionSettings.trackVars);

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
    };

    AdobeAnalyticsExtension.prototype.doesExtensionVarApplyToLinkTracking = function(varName){
      return !/^(eVar[0-9]+)|(prop[0-9]+)|(hier[0-9]+)|campaign|purchaseID|channel|server|state|zip|pageType$/.test(varName);
    };

    AdobeAnalyticsExtension.prototype.trackLink = function(actionSettings) {
      var trackVars = {};

      for (var varName in this.extensionSettings.trackVars) {
        if (this.doesExtensionVarApplyToLinkTracking(varName)) {
          trackVars[varName] = this.extensionSettings.trackVars[varName];
        }
      }

      SL.extend(trackVars, actionSettings.trackVars);

      // Referrer is never sent for link tracking.
      delete trackVars.referrer;

      if (actionSettings.customSetup) {
        // TODO: Do we need to send the originating event into the custom setup function?
        actionSettings.customSetup();
      }

      this.track(trackVars, actionSettings.trackEvents);
    };

    AdobeAnalyticsExtension.prototype.track = function(trackVars, trackEvents) {
      var queryString = this.remodelDataToQueryString({
        vars: trackVars,
        events: trackEvents,
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

    return function(propertySettings, extensionSettings, actionSettings, extensionInstanceId) {
      var instance = instanceById[extensionInstanceId];

      if (!instance) {
        instance = instanceById[extensionInstanceId] = new AdobeAnalyticsExtension(extensionSettings);
      }

      var methodName = trackTypeMethodMap[actionSettings.trackType];
      instance[methodName](actionSettings);
    };
  })();

  _satellite.init({
    "tools": {
      "f489afdcde1a53ef58aec319401144f7": {
        "engine": "sc",
        "loadOn": "pagebottom",
        "account": "aaronhardyprod",
        "euCookie": false,
        "sCodeURL": "7adf9ad51d40b4e06390693913f85f1a37e869de/s-code-contents-22c7cbe13317f4c9e99900c0b530d66471196f02-staging.js",
        "initVars": {
          "charSet": "UTF-8",
          "currencyCode": "TND",
          //trackingServer: 'myTrackingServer.com',
          //trackingServerSecure: 'mySSLTrackingServer.com',
          "referrer": "myreferreroverride",
          "campaign": "MyToolCampaign",
          "pageURL": "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
          "trackInlineStats": true,
          "trackDownloadLinks": true,
          "linkDownloadFileTypes": "avi,css,csv,doc,docx,eps,exe,jpg,js,m4v,mov,mp3,pdf,png,ppt,pptx,rar,svg,tab,txt,vsd,vxd,wav,wma,wmv,xls,xlsx,xml,zip,fake",
          "trackExternalLinks": true,
          "linkInternalFilters": "javascript:,mailto:,tel:",
          "linkLeaveQueryString": false,
          "dynamicVariablePrefix": "$$",
          "eVar50": "toolevar50",
          "prop50": "toolprop50"
        }
      },
      "da8f823508d51bfe232b1a9609a426dcbfce8709": {
        "engine": "tnt",
        "mboxURL": "7adf9ad51d40b4e06390693913f85f1a37e869de/mbox-contents-da8f823508d51bfe232b1a9609a426dcbfce8709-staging.js",
        "loadSync": true,
        "pageParams": {
        }
      }
    },
    extensions: {
      'abcdef': {
        instanceId: 'abcdef',
        extensionId: 'adobeanalytics',
        settings: {
          account: 'aaronhardyprod',
          euCookie: false,
          //trackingServer: 'myTrackingServer.com',
          //trackingServerSecure: 'mySSLTrackingServer.com',
          trackVars: {
            charSet: 'UTF-8',
            currencyCode: 'TND',
            referrer: 'myreferreroverride',
            campaign: 'MyToolCampaign',
            pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
            trackInlineStats: true,
            trackDownloadLinks: true,
            linkDownloadFileTypes: "avi,css,csv,doc,docx,eps,exe,jpg,js,m4v,mov,mp3,pdf,png,ppt,pptx,rar,svg,tab,txt,vsd,vxd,wav,wma,wmv,xls,xlsx,xml,zip,fake",
            trackExternalLinks: true,
            linkInternalFilters: "javascript:,mailto:,tel:",
            linkLeaveQueryString: false,
            dynamicVariablePrefix: "$$",
            eVar50: "toolevar50",
            prop50: "toolprop50",
            // TODO: Why is this in the var list and not a direct child of settings? (currently follows Tool structure)
            dc: '122'
          }
        }
      }
    },
    newRules: [
      {
        // TODO Needs event stuff.
        name: 'Test Rule',
        actions: [
          {
            extensionInstanceIds: ['abcdef'],
            script: adobeAnalyticsAction,
            settings: {
              trackType: 'pageView',
              trackVars: {
                eVar10: 'MyEvar10',
                eVar11: 'MyEvar11',
                prop10: 'MyProp10',
                prop11: 'MyProp11',
                pageName: 'MyPageName',
                channel: 'MyChannel',
                pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
                campaign: 'MyRuleCampaign',
                hier1: "HierLev1|HierLev2|HierLev3|HierLev4"
              },
              trackEvents: [
                "event10:MyEvent10",
                "event11:MyEvent11",
                "prodView:MyProdView"
              ]
            }
          }
        ]
      },
      {
        // TODO Needs event stuff.
        name: 'Dead Header Rule',
        conditions: [
          function(event,target) { return !_satellite.isLinked(target) }
        ],
        actions: [
          {
            extensionInstanceIds: ['abcdef'],
            script: adobeAnalyticsAction,
            settings: {
              trackType: 'link',
              trackVars: {
                linkType: 'o',
                linkName: 'MyLink',
                pageName: 'MyPageName',
                eVar20: 'MyDeadHeaderEvar',
                prop20: 'D=v20',
                campaign: SL.getQueryParam('dead')
              },
              trackEvents: [
                  'event20:deadevent'
              ],
              customSetup: function(){
                console.log('I am a custom setup function from an extension.');
              }
            }
          }
        ]
      }
    ],

    "pageLoadRules": [{
      name: "KitchenSink",
      trigger: [{
        engine: "sc",
        command: "setVars",
        arguments: [{
          eVar10: "MyEvar10",
          eVar11: "MyEvar11",
          prop10: "MyProp10",
          prop11: "MyProp11",
          pageName: "MyPageName",
          channel: "MyChannel",
          pageURL: "http://reallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverridereallyreallyreallylongpageurloverride",
          campaign: "MyRuleCampaign",
          hier1: "HierLev1|HierLev2|HierLev3|HierLev4"
        }]
      }, {engine:"sc",command:"addEvent",arguments:["event10:MyEvent10","event11:MyEvent11","prodView:MyProdView"]}, {
        engine: "tnt",
        command: "addMbox",
        arguments: [{mboxGoesAround: "", mboxName: "", arguments: [], timeout: "1500"}]
      }],
      event: "pagebottom"
    }],
    "rules": [
      {"name":"Dead Header","trigger":[{"engine":"sc","command":"trackLink","arguments":[{"type":"o","linkName":"MyLink","setVars":{"eVar20":"MyDeadHeaderEvar","prop20":"D=v20","campaign":
          SL.getQueryParam('dead')
      },"customSetup":function(event,s){
        console.log('I am a custom setup function from a tool.');
      },"addEvent":["event20:deadevent"]}]}],"conditions":[function(event,target){
        return !_satellite.isLinked(target)
      }],"selector":"h1, h2, h3, h4, h5","event":"click","bubbleFireIfParent":true,"bubbleFireIfChildFired":true,"bubbleStop":false}
      //{"name":"Dead Header","trigger":[{"engine":"sc","command":"trackPageView","arguments":[{"type":"o","linkName":"MyLink","setVars":{"eVar20":"MyDeadHeaderEvar","prop20":"D=v20","campaign":
      //    SL.getQueryParam('dead')
      //},"addEvent":["event20:deadevent"]}]}],"conditions":[function(event,target){
      //  return !_satellite.isLinked(target)
      //}],"selector":"h1, h2, h3, h4, h5","event":"click","bubbleFireIfParent":true,"bubbleFireIfChildFired":true,"bubbleStop":false},
      //{"name":"Download Link","trigger":[{"engine":"sc","command":"trackLink","arguments":[{"type":"d","linkName":"%this.href%"}]},{"command":"delayActivateLink"}],"selector":"a","event":"click","bubbleFireIfParent":true,"bubbleFireIfChildFired":true,"bubbleStop":false,"property":{"href":/\.(?:doc|docx|eps|xls|ppt|pptx|pdf|xlsx|tab|csv|zip|txt|vsd|vxd|xml|js|css|rar|exe|wma|mov|avi|wmv|mp3|wav|m4v)($|\&|\?)/i}}
    ],
    "directCallRules": [

    ],
    "settings": {
      "trackInternalLinks": true,
      "libraryName": "satelliteLib-802733f55cb916def018044ee9a299e20898b26d",
      "isStaging": true,
      "allowGATTcalls": false,
      "downloadExtensions": /\.(?:doc|docx|eps|jpg|png|svg|xls|ppt|pptx|pdf|xlsx|tab|csv|zip|txt|vsd|vxd|xml|js|css|rar|exe|wma|mov|avi|wmv|mp3|wav|m4v)($|\&|\?)/i,
      "notifications": false,
      "utilVisible": false,
      "domainList": [
        "aaronhardy.com"
      ],
      "scriptDir": "7adf9ad51d40b4e06390693913f85f1a37e869de/scripts/",
      "tagTimeout": 3000
    },
    "data": {
      "URI":
      document.location.pathname + document.location.search
      ,
      "browser": {
      },
      "cartItems": [

      ],
      "revenue": "",
      "host": {
        "http": "dtm.aaronhardy.com",
        "https": "dtm.aaronhardy.com"
      }
    },
    "dataElements": {
    },
    "appVersion": "52A",
    "buildDate": "2015-03-16 20:55:42 UTC",
    "publishDate": "2015-03-16 14:43:44 -0600"
  });
})(window, document);
