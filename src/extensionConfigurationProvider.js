var settingsCollectionByExtensionName = {};
var settingsByConfigurationId = {};

module.exports = {
  addConfiguration: function(extensionName, id, configuration) {
    settingsByConfigurationId[id] = configuration.settings;

    settingsCollectionByExtensionName[extensionName] =
      settingsCollectionByExtensionName[extensionName] || [];

    settingsCollectionByExtensionName[extensionName].push(configuration.settings);
  },
  getSettingsCollectionByExtensionName: function(extensionName) {
    return settingsCollectionByExtensionName[extensionName] || [];
  },
  getSettingsByConfigurationId: function(configurationId) {
    return settingsByConfigurationId[configurationId];
  }
};
