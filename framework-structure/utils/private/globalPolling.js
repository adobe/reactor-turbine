var poll = require('../public/poll');
var each = require('../public/each');

var pollList = [];


module.exports = {
  add: function add(name ,callback){
    pollList.push({
      name:name,
      callback:callback
    });
  },
  init: function init(){
    poll(function polling(){
      var start = +new Date()
      each(pollList,function (pollItem){
        pollItem.callback();
      });
      var end = +new Date()
      // We want to keep an eye on the execution time here.
      // If it gets to around 50ms for any customer site,
      // we want to either optimize or start using a task queue
      // console.log('Background tasks executed in ' + (end - start) + 'ms')
    },3000);
  }
  // remove: function remove(name){
  //
  // }
};
