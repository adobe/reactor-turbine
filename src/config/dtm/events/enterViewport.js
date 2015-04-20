
function initBindings(eventSettingsCollection) {
  dtmUtils.addEventListener(window, 'scroll', checkForDomChanges.bind(this, eventSettingsCollection));
  dtmUtils.addEventListener(window, 'load', checkForDomChanges.bind(this, eventSettingsCollection));
  dtmUtils.globalPolling.add('inviewevents', checkForDomChanges.bind(this, eventSettingsCollection));
}

// Util functions needed by `InViewEventEmitter`
var offset = function(elem) {
  var box;

  try {
    box = elem.getBoundingClientRect();
  } catch (e) {}

  var doc = document,
    docElem = doc.documentElement;

  var body = doc.body,
    win = window,
    clientTop = docElem.clientTop || body.clientTop || 0,
    clientLeft = docElem.clientLeft || body.clientLeft || 0,
    scrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop,
    scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
    top = box.top + scrollTop - clientTop,
    left = box.left + scrollLeft - clientLeft;

  return {
    top: top,
    left: left
  };
};

var getViewportHeight = function() {
  var height = window.innerHeight; // Safari, Opera
  var mode = document.compatMode;

  if (mode) { // IE, Gecko
    height = (mode == 'CSS1Compat') ?
      document.documentElement.clientHeight : // Standards
      document.body.clientHeight; // Quirks
  }

  return height;
};

var getScrollTop = function() {
  return (document.documentElement.scrollTop ?
    document.documentElement.scrollTop :
    document.body.scrollTop);
};

var elementIsInView = function(el) {
  var vpH = getViewportHeight(),
    scrolltop = getScrollTop(),
    top = offset(el).top,
    height = el.offsetHeight;
  return !(scrolltop > (top + height) || scrolltop + vpH < top);
};

var checkForDomChanges = function(eventSettingsCollection) {

  dtmUtils.each(eventSettingsCollection, function(eventSettings) {
    var elms = dtmUtils.querySelectorAll(eventSettings.selector);
    dtmUtils.each(elms, function(elm) {
      var hasBeenInView = dtmUtils.dataOnElement(elm, 'inview');
      if (elementIsInView(elm)) {
        if(!hasBeenInView){
          dtmUtils.dataOnElement(elm, 'inview', true);
          callback(eventSettings);
        }
      }else if(hasBeenInView){
        dtmUtils.dataOnElement(elm, 'inview', false);
      }
    });
  });
};


initBindings(eventSettingsCollection);
