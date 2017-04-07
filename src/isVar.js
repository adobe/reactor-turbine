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

var state = require('./state');

// isVar(variableName)
// ==========================
//
// Determines if the provided name is a valid variable, where the variable
// can be a data element, defined in the "data" section
// of the initial config, or reference properties on
// an element, event, or target of the event in question,
// a query parameter, or a random number.
//
// - `variableName` - the name of the variable to get
module.exports = function(variableName) {
  var nameBeforeDot = variableName.split('.')[0];

  return Boolean(
    variableName === 'URI' ||
    variableName === 'uri' ||
    variableName === 'protocol' ||
    variableName === 'hostname' ||
    state.getDataElementDefinition(variableName) ||
    nameBeforeDot === 'this' ||
    nameBeforeDot === 'event' ||
    nameBeforeDot === 'target' ||
    nameBeforeDot === 'window' ||
    nameBeforeDot === 'param' ||
    nameBeforeDot.match(/^rand([0-9]+)$/) ||
    state.customVars.hasOwnProperty(nameBeforeDot)
  );
};
