var settingsCollection = {};

module.exports = {
  addConfiguration: function(extensionName, id, configuration) {
    settingsCollection[extensionName] =
      settingsCollection[extensionName] || {};

    settingsCollection[extensionName][id] = configuration.settings;
  },
  getSettingsCollection: function(extensionName) {
    return settingsCollection[extensionName] || {};
  }
};
