module.exports = function autoValidate(fn) {
  return function (args = {}) {
    const missing = [];

    // Call fn with Proxy to detect what props it tries to access
    const proxy = new Proxy(args, {
      get(target, prop) {
        if (!(prop in target)) {
          missing.push(prop);
        }
        return target[prop];
      }
    });

    fn(proxy);

    if (missing.length > 0) {
      throw new Error(
        `${fn.name}: Missing required argument(s): ${missing.join(', ')}`
      );
    }

    // All required keys accessed successfully — call with original args
    return fn(args);
  };
};
