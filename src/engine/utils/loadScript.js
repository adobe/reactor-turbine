var onLoad = function(url, script, callback) {
  function cb(error){
    // TODO: Add logging.
    //if (error) SL.logError(error)
    if (callback) callback(error)
  }
  if ('onload' in script){
    script.onload = function(){
      cb()
    };
    script.onerror = function(){
      cb(new Error('Failed to load script ' + url))
    };
  }else if ('readyState' in script){
    script.onreadystatechange = function(){
      var rs = script.readyState;
      if (rs === 'loaded' || rs === 'complete'){
        script.onreadystatechange = null;
        cb();
      }
    }
  }
}

module.exports = function(url, callback) {
  var script = document.createElement('script');
  onLoad(url, script, callback);
  script.src = url;
  script.async = true;
  document.getElementsByTagName('head')[0].appendChild(script);
  return script;
};
