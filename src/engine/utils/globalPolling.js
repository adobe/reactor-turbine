var configs = [];

module.exports = {
  add: function(name, callback){
    var config = { name: name, callback: callback };
    configs.push(config);

    return function() {
      var index = configs.indexOf(callback);
      if (index > -1) {
        configs.splice(index, 1);
      }
    };
  },
  init: function init(){
    setInterval(function polling(){
      // This could be called a lot so for instead of forEach to squeak out a bit of speed
      for (var i = 0; i < configs.length; i++) {
        configs[i].callback();
      }
    }, 3000);
  }
};
