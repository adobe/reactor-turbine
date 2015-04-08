// TODO Does this belong here? Does it need a different name?
function hasClass(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

var hideStyleAdded = false;
var callsOutstanding = 0;

var headElement = document.getElementsByTagName('head')[0];
var htmlElement = document.getElementsByTagName('html')[0];

module.exports = function() {
  if (!hideStyleAdded) {
    headElement.insertAdjacentHTML('beforeend', '<style>.dtm-hide-page{visibility:hidden}</style>');
    hideStyleAdded = true;
  }

  addClass(htmlElement, 'dtm-hide-page');
  callsOutstanding++;

  var callbackCalled = false;
  return function() {
    if (!callbackCalled) {
      callsOutstanding--;

      if (callsOutstanding === 0) {
        removeClass(htmlElement, 'dtm-hide-page');
      }

      callbackCalled = true;
    }
  };
};
