module.exports = function(toolSettings, ruleSettings) {
  var url = 'http://target.adobe.com/' + toolSettings.accountId + '/getoffer';
  _satellite.io.jsonp(url, {offer: ruleSettings.offer}, function(response){
    var el = _satellite.dom.querySelector(ruleSettings.container);

    if (el) {
      el.innerHTML = response;
    }
  });
};
