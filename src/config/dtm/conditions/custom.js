module.exports = function(conditionSettings, eventDetail) {
  return conditionSettings.script(eventDetail, require);
};
