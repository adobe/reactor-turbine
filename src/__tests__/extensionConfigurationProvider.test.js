'use strict';

var extensionConfigurationProvider = require('../extensionConfigurationProvider');

describe('extension configuration provider', function() {
  it('should return a collection of setting for an extension name', function() {
    var configuration = { settings: { settingKey: 'value' } };
    extensionConfigurationProvider.addConfiguration('extensionName', 'id', configuration);

    expect(extensionConfigurationProvider.getSettingsCollectionByExtensionName('extensionName'))
      .toEqual([{ settingKey: 'value' }]);
  });

  it('should return the settings for a specific configuration', function() {
    var configuration = { settings: { settingKey: 'value' } };
    extensionConfigurationProvider.addConfiguration('extensionName', 'id', configuration);

    expect(extensionConfigurationProvider.getSettingsByConfigurationId('id'))
      .toEqual({ settingKey: 'value' });
  });
});
