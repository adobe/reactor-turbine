#!/usr/bin/env node

/***************************************************************************************
 * (c) 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

/* eslint-disable camelcase */

const supportedCompanyTypes = require('../setup/supportedCompanyTypes.json');
const createWrappedReactorApi = require('../reactor-sdk-wrapper');
const ReactorApi = createWrappedReactorApi({
  companyType: supportedCompanyTypes.DEFAULT_COMPANY
});

async function generateContainer() {
  try {
    const {
      propertyId,
      propertyName,
      propertyLink /* /CO.../properties/PR... */,
      libraryLink /* assets.adobedtm.com/.../.min.js */,
      environmentId,
      coreExtensionId,
      launchValidationExtensionId
    } = await ReactorApi.prepareNewPropertyForDelegates({
      ruleComponentSequencingEnabled: true,
      undefinedVarsReturnsEmpty: true,
      libraryVariantName: 'TURBINE_CHECKS_PREM_CDN_ENABLED'
    });

    const dataElementsUsed = [];
    const dataElement1 = await ReactorApi.createCustomCodeDataElement({
      propertyId,
      coreExtensionId,
      attributes: {
        name: 'turbine-dataElement-Custom_Code',
        settings: {
          source:
          // eslint-disable-next-line max-len
            "try {var t = turbine;} catch(err) { markTurbineTestExecuted('TurbineFreeVars::turbine_cc_data_element-pass::thrownError', new Date().toISOString()); }"
        },
        storage_duration: 'pageview'
      }
    });
    dataElementsUsed.push(dataElement1.data.id);

    const rulesUsed = [];
    try {
      /**** rule 1, Turbine DE Custom Code Rule, dom-ready ****/
      const rule1 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'Turbine DataElement Custom Code Rule'
      });
      const rule1Id = rule1.data.id;
      rulesUsed.push(rule1Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId: 'core::events::dom-ready',
        ruleComponentName: 'dom ready'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'javascript',
          // eslint-disable-next-line max-len
          source: '_satellite.getVar("turbine-dataElement-Custom_Code");' // will produce a result of "TurbineFreeVars::turbine_cc_data_element-pass"
        },
        ruleComponentName: '(0) getVar Turbine-DataElement-CustomCode',
        order: 0
      });
      /**** end rule 1, Turbine DE Custom Code Rule, dom-ready ****/
    } catch (err) {
      console.log('Error creating rule 1');
      throw err;
    }

    try {
      /**** rule 2, Turbine Custom Event Code Rule, custom event ****/
      const rule2 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'Turbine Not Available Custom Code Event'
      });
      const rule2Id = rule2.data.id;
      rulesUsed.push(rule2Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule2Id,
        delegateDescriptorId: 'core::events::custom-code',
        settings: {
          source:
          // eslint-disable-next-line max-len
            'try {var t = turbine;} catch(err) { markTurbineTestExecuted("TurbineNotAvailableCustomCodeEvent::sequence-event-js-1::thrownError::pass", new Date().toISOString()); trigger(); }'
        },
        ruleComponentName: 'Custom Code Event'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule2Id,
        delegateDescriptorId:
          'launch-validation::actions::action-direct-no-dom-element',
        settings: {
          testIdentifier:
            'TurbineNotAvailableCustomCodeEvent::sequence-action-js-2-pass'
        },
        ruleComponentName: '(0) Action Direct No DOM Element Verify',
        order: 0
      });
      /**** end rule 2, Turbine Custom Event Code Rule, custom event ****/
    } catch (err) {
      console.log('Error creating rule 2');
      throw err;
    }

    console.log('✅ finished rules/conditions/actions creations');

    /*** create Library ***/
    const library = await ReactorApi.createLibrary({
      name: 'API Build Library',
      propertyId,
      environmentId,
      extensionIdsUsed: [coreExtensionId, launchValidationExtensionId],
      dataElementIds: dataElementsUsed,
      ruleIds: rulesUsed
    });
    const libraryId = library.data.id;
    console.log('✅ made a library');

    const completedBuild = await ReactorApi.buildLibrary({ libraryId });
    console.log('✅ create build', completedBuild.data.id);
    /*** create Library ***/

    return {
      success: true,
      propertyLink,
      libraryLink,
      propertyName
    };
  } catch (error) {
    return { success: false, error };
  }
}

// If this script is run directly, execute the function
if (require.main === module) {
  generateContainer()
    .then(({ success, propertyLink, libraryLink, propertyName, error }) => {
      if (success) {
        console.log('Turbine_Free_Vars container generated successfully!');
        console.log(propertyName);
        console.log('Property Link:', propertyLink);
        console.log('Library Build:', libraryLink);
        process.exit(0);
      } else {
        console.error('Failed to generate Turbine_Free_Vars container:', error);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = generateContainer;
