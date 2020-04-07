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
var DEBUG_LOCAL_STORAGE_NAME = 'debug';

module.exports = function(localStorage, logger) {
  var getPersistedDebugEnabled = function() {
    return localStorage.getItem(DEBUG_LOCAL_STORAGE_NAME) === 'true';
  };

  var setPersistedDebugEnabled = function(enabled) {
    localStorage.setItem(DEBUG_LOCAL_STORAGE_NAME, enabled);
  };

  var debugChangedCallbacks = [];
  var onDebugChanged = function(callback) {
    debugChangedCallbacks.push(callback);
  };

  logger.outputEnabled = getPersistedDebugEnabled();

  return {
    onDebugChanged: onDebugChanged,
    getDebugEnabled: getPersistedDebugEnabled,
    setDebugEnabled: function(enabled) {
      if (getPersistedDebugEnabled() !== enabled) {
        setPersistedDebugEnabled(enabled);
        logger.outputEnabled = enabled;
        debugChangedCallbacks.forEach(function(callback) {
          callback(enabled);
        });
      }
    }
  };
};
