module.exports = function(conditionSettings) {
  return _satellite.utils.textMatch(
    _satellite.utils.getQueryParam(conditionSettings.name),
    conditionSettings.value);
};
