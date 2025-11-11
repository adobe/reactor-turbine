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
      libraryVariantName: 'ACTION_SEQUENCE_DISABLED',
      attributes: {
        // eslint-disable-next-line camelcase
        rule_component_sequencing_enabled: false
      }
    });

    const rulesUsed = [];

    try {
      /**
       * creating actions 1,2,3,4
       * 1: timeout 1000ms
       * 2: no timeout
       * 3: timeout 2000ms
       * 4: no timeout
       * expected flow through turbine: 2,4,1,3
       */
      /**** rule 1, ActionSequencingDisabled mixing timeouts, page-bottom ****/
      const rule1 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'ActionSequencingDisabled - mixing in timeouts'
      });
      const rule1Id = rule1.data.id;
      rulesUsed.push(rule1Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId: 'core::events::page-bottom',
        ruleComponentName: 'page bottom'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId:
          'launch-validation::actions::action-promise-timeout-no-dom-element',
        settings: {
          testIdentifier:
            'ActionSequencingDisabled::with-timeout::sequence-action-js-1-pass',
          timeout: 1000
        },
        ruleComponentName: '(0) Action Promise No Dom El Timeout 1000ms',
        order: 0
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId:
          'launch-validation::actions::action-direct-no-dom-element',
        settings: {
          testIdentifier:
            'ActionSequencingDisabled::no-timeout::sequence-action-js-2-pass'
        },
        ruleComponentName: '(1) Action Direct No Dom El',
        order: 1
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId:
          'launch-validation::actions::action-promise-timeout-no-dom-element',
        settings: {
          testIdentifier:
            'ActionSequencingDisabled::with-timeout::sequence-action-js-3-pass',
          timeout: 2000
        },
        ruleComponentName: '(2) Action Promise No Dom El Timeout 1000ms',
        order: 2
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId:
          'launch-validation::actions::action-direct-no-dom-element',
        settings: {
          testIdentifier:
            'ActionSequencingDisabled::no-timeout::sequence-action-js-4-pass'
        },
        ruleComponentName: '(3) Action Direct No Dom El',
        order: 3
      });
      /**** rule 1, ActionSequencingDisabled mixing timeouts, page-bottom ****/
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
        console.log('Action_Sequence_Disabled library generated successfully!');
        console.log(propertyName);
        console.log('Property Link:', propertyLink);
        console.log('Library Build:', libraryLink);
        process.exit(0);
      } else {
        console.error(
          'Failed to generate Action_Sequence_Disabled library:',
          error
        );
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = generateContainer;
