module.exports = function(args) {
  _satellite.io.get('http://target.adobe.com/getoffer', {offer: args.offer}, function(response){
    var el = _satellite.dom.querySelector(params.container);

    if (el) {
      el.innerHTML = response;
    }
  });
};
