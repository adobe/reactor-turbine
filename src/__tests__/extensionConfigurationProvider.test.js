'use strict';

var extensionConfigurationProvider = require('../extensionConfigurationProvider');

describe('extension configuration provider', function() {
  it('should return a collection of setting for an extension name', function() {
    var configuration = { settings: { settingKey: 'value' } };
    extensionConfigurationProvider.addConfiguration('extensionName', 'id', configuration);

    expect(extensionConfigurationProvider.getSettingsCollection('extensionName'))
      .toEqual({id: { settingKey: 'value' }});
  });
});
