module.exports = function(configurations) {
  // We pull in replaceVarTokens here and not at the top of the file to prevent a
  // circular reference since dependencies of replaceVarTokens requires state which requires
  // this module.
  var replaceVarTokens = require('./utils/dataElement/replaceVarTokens');

  return function() {
    var settingsByConfigurationId = {};

    Object.keys(configurations).forEach(function(id) {
      settingsByConfigurationId[id] = replaceVarTokens(configurations[id].settings);
    });

    return settingsByConfigurationId;
  };
};
