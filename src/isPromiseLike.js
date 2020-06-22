module.exports = function (value) {
  return Boolean(
    value && typeof value === 'object' && typeof value.then === 'function'
  );
};
