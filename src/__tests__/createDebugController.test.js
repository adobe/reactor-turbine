/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

var createDebugController = require('../createDebugController');

describe('function returned by createDebugController', function () {
  var localStorage;
  var logger;

  beforeEach(function () {
    localStorage = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    logger = {
      outputEnabled: false
    };
  });

  it('returns whether debug is enabled', function () {
    localStorage.getItem.and.returnValue('true');
    var debugController = createDebugController(localStorage, logger);
    expect(debugController.getDebugEnabled()).toBe(true);
    localStorage.getItem.and.returnValue('false');
    expect(debugController.getDebugEnabled()).toBe(false);
  });

  it('persists debug changes', function () {
    var debugController = createDebugController(localStorage, logger);
    localStorage.getItem.and.returnValue('false');
    debugController.setDebugEnabled(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('debug', true);
    localStorage.getItem.and.returnValue('true');
    debugController.setDebugEnabled(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('debug', false);
  });

  it('calls onDebugChanged callbacks when debugging is toggled', function () {
    var debugController = createDebugController(localStorage, logger);
    var callback1 = jasmine.createSpy('callback1');

    debugController.onDebugChanged(callback1);
    debugController.setDebugEnabled(true);
    localStorage.getItem.and.returnValue('true');
    expect(callback1).toHaveBeenCalledWith(true);

    var callback2 = jasmine.createSpy('callback2');
    debugController.onDebugChanged(callback2);
    debugController.setDebugEnabled(false);
    localStorage.getItem.and.returnValue('false');
    expect(callback1).toHaveBeenCalledWith(false);
    expect(callback2).toHaveBeenCalledWith(false);
    expect(callback1).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(1);

    // Shouldn't call the callbacks again since debug
    // hasn't actually changed.
    debugController.setDebugEnabled(false);
    expect(callback1).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
