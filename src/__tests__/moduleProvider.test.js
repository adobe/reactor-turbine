/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var moduleProvider = require('../moduleProvider');

describe('moduleProvider', function () {
  it('registers and provides modules', function () {
    var clickDefinition = {
      displayName: 'Click',
      getExports: jasmine.createSpy().and.callFake(function () {
        return 'click exports';
      })
    };
    var sendBeaconDefinition = {
      displayName: 'Send Beacon',
      getExports: jasmine.createSpy().and.callFake(function () {
        return 'send beacon exports';
      })
    };

    moduleProvider.registerModules({
      'core::events::click': clickDefinition,
      'analytics::actions::send-beacon': sendBeaconDefinition
    });

    expect(clickDefinition.getExports).toHaveBeenCalled();
    expect(sendBeaconDefinition.getExports).toHaveBeenCalled();
    expect(moduleProvider.getModuleDefinition('core', 'events', 'click')).toBe(
      clickDefinition
    );
    expect(
      moduleProvider.getModuleExports('analytics', 'actions', 'send-beacon')
    ).toBe('send beacon exports');
  });
});
