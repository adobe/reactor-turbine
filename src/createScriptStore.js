/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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
var loadScript = require('@adobe/reactor-load-script');
var Promise = require('@adobe/reactor-promise');

var loadScriptPromiseStore = {};
var codeBySourceUrl = {};

// TODO: i don't think we need to decorate here, in case it might actually be a bug.
//  at this point, the script should already be loading...?
module.exports = function (decorateWithDynamicHost) {
  var loadScriptOnlyOnce = function (sourceUrl) {
    if (!loadScriptPromiseStore[sourceUrl]) {
      loadScriptPromiseStore[sourceUrl] = loadScript(sourceUrl);
    }

    return loadScriptPromiseStore[sourceUrl];
  };

  var registerScript = function (sourceUrl, code) {
    codeBySourceUrl[decorateWithDynamicHost(sourceUrl)] = code;
  };

  var retrieveScript = function (u) {
    var decoratedUrl = decorateWithDynamicHost(u);
    if (codeBySourceUrl[decoratedUrl]) {
      return Promise.resolve(codeBySourceUrl[decoratedUrl]);
    } else {
      return new Promise(function (resolve) {
        loadScriptOnlyOnce(decoratedUrl).then(
          function () {
            resolve(codeBySourceUrl[decoratedUrl]);
          },
          function () {
            resolve();
          }
        );
      });
    }
  };

  return {
    registerScript: registerScript,
    retrieveScript: retrieveScript
  };
};
