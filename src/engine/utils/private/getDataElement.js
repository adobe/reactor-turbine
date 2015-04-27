var dataElementDefinitions = require('../../stores/dataElementDefinitions');
var dataElementSafe = require('../../stores/dataElementSafe');
var querySelectorAll = require('../public/querySelectorAll');
var hasAttribute = require('../public/hasAttribute');
var getQueryParam = require('../public/getQueryParam');
var readCookie = require('../public/readCookie');
var getObjectProperty = require('./getObjectProperty');
var cleanText = require('./cleanText');

var accessors = {
  dom: function(settings) {
    var elms = querySelectorAll(settings.selector);
    if (elms.length > 0) {
      var elm = elms[0]

      // TODO Can we use getObjectProperty() here or at least getElementText()?
      if (settings.property === 'text') {
        return  elm.innerText || elm.textContent
      } else if (hasAttribute(elm, settings.property)) {
        return elm[settings.property] || elm.getAttribute(settings.property)
      }
    }
  },
  cookie: function(settings) {
    return readCookie(settings.name);
  },
  variable: function(settings) {
    return getObjectProperty(window, settings.path);
  },
  queryParam: function(settings) {
    return getQueryParam(settings.name, settings.ignoreCase);
  },
  custom: function(settings) {
    return settings.script();
  }
};

module.exports = function(variable, suppressDefault, dataDef) {
  dataDef = dataDef || dataElementDefinitions.getByName(variable);
  var storeLength = dataDef.settings.storeLength;

  var value = accessors[dataDef.type](dataDef.settings);

  if (dataDef.cleanText) {
    value = cleanText(value);
  }

  if (value === undefined && storeLength) {
    value = dataElementSafe(variable, storeLength)
  } else if (value !== undefined && storeLength) {
    dataElementSafe(variable, storeLength, value)
  }
  if (value === undefined && !suppressDefault) {
    value = dataDef.settings.default || ''
  }

  if (dataDef.forceLowerCase) {
    value = value.toLowerCase()
  }
  return value
}
