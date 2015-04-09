var bus = {};
var subscriptions = {};
var nextSubscriptionId = -1;

bus.on = function(subscriptionName, func) {
  if (!subscriptions[subscriptionName]) {
    subscriptions[subscriptionName] = [];
  }
  var subscriptionId = (++nextSubscriptionId).toString();
  subscriptions[subscriptionName].push({
    subscriptionId: subscriptionId,
    func: func
  });
  return off.bind(this,subscriptionId);
};

bus.trigger = function(subscriptionName, args) {
  if (!subscriptions[subscriptionName]) {
    return false;
  }
  setTimeout(function() {
    var subscribers = subscriptions[subscriptionName],
      len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(subscriptionName, args);
    }
  }, 0);
  return true;
};

off = function(subscriptionId) {
  for (var subscriptionKey in subscriptions) {
    if (subscriptions[subscriptionKey]) {
      for (var i = 0, length = subscriptions[subscriptionKey].length; i < length; i++) {
        if (subscriptions[subscriptionKey][i].subscriptionId === subscriptionId) {
          subscriptions[subscriptionKey].splice(i, 1);
          return subscriptionId;
        }
      }
    }
  }
  return false;
};

module.exports = bus;
