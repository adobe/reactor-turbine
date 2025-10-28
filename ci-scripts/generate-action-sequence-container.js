#!/usr/bin/env node
/**
 * Generate async container for integration testing
 *
 * This script handles async container generation for testing purposes.
 */

const ReactorApi = require('./container-utils');

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
      containerType: 'ACTION_SEQUENCE_CONTAINER'
    });

    const rulesUsed = [];
    try {
      /**** rule 1, EPActionPromiseRule, dom-ready ****/
      const rule1 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'EP Action Promise Rule'
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
        extensionId: launchValidationExtensionId,
        ruleId: rule1Id,
        delegateDescriptorId:
          'launch-validation::actions::action-promise-no-dom-element',
        settings: {
          testIdentifier: 'EPActionPromiseRule::sequence-action-js-1-pass'
        },
        ruleComponentName: '(0) Action Promise No DOM Element',
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
          testIdentifier: 'EPActionPromiseRule::sequence-action-js-2-pass'
        },
        ruleComponentName: '(1) Action Direct No DOM Element',
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
          testIdentifier: 'EPActionPromiseRule::sequence-action-js-3-pass',
          timeout: 250
        },
        ruleComponentName: '(2) Action Promise Timeout No DOM Element',
        order: 2
      });
      /**** end rule 1, EPActionPromiseRule, dom-ready ****/
    } catch (err) {
      console.log('Error creating rule 1');
      throw err;
    }

    try {
      /**** rule 2, EPActionPromiseRuleFailure, page-bottom ****/
      const rule2 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'EP Action Promise Rule FAILURE'
      });
      const rule2Id = rule2.data.id;
      rulesUsed.push(rule2Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule2Id,
        delegateDescriptorId: 'core::events::page-bottom',
        ruleComponentName: 'page bottom'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule2Id,
        delegateDescriptorId:
          'launch-validation::actions::action-promise-no-dom-element',
        settings: {
          testIdentifier:
            'EPActionPromiseRuleFailure::sequence-action-js-1-pass'
        },
        ruleComponentName: '(0) Action Promise No DOM Element Fail',
        order: 0
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: launchValidationExtensionId,
        ruleId: rule2Id,
        delegateDescriptorId:
          'launch-validation::actions::action-promise-timeout-no-dom-element',
        settings: {
          testIdentifier: 'reject',
          timeout: 200
        },
        ruleComponentName: '(1) Action Promise Timeout Fail No DOM Element',
        order: 1
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
            'EPActionPromiseRuleFailure::sequence-action-js-3-fail'
        },
        ruleComponentName: '(2) Action Direct No DOM Element',
        order: 2
      });
      /**** end rule 2, EPActionPromiseRuleFailure, page-bottom ****/
    } catch (err) {
      console.log('Error creating rule 2');
      throw err;
    }

    try {
      /**** rule 3, JSActionCustomCodeRule, dom-ready ****/
      const rule3 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'JS Action Custom Code Rule'
      });
      const rule3Id = rule3.data.id;
      rulesUsed.push(rule3Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule3Id,
        delegateDescriptorId: 'core::events::dom-ready',
        ruleComponentName: 'dom ready'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule3Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'javascript',
          source:
            // eslint-disable-next-line max-len
            'return new Promise(function(resolve, reject) { setTimeout(function() { resolve(markTurbineTestExecuted("JSActionCustomCodeRule::sequence-action-js-1-pass", new Date().toISOString()));}, 250);});'
        },
        ruleComponentName: '(0) Custom Code Resolve',
        order: 0
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule3Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'javascript',
          source:
            'markTurbineTestExecuted("JSActionCustomCodeRule::sequence-action-js-2-pass", new Date().toISOString());'
        },
        ruleComponentName: '(1) Custom Code Immediate Call',
        order: 1
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule3Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'javascript',
          source:
            // eslint-disable-next-line max-len
            'return new Promise(function(resolve, reject) { setTimeout(function() { resolve(markTurbineTestExecuted("JSActionCustomCodeRule::sequence-action-js-3-pass", new Date().toISOString()));}, 250);});'
        },
        ruleComponentName: '(2) Custom Code Resolve Again',
        order: 2
      });
      /**** end rule 3, JSActionCustomCodeRule, dom-ready ****/
    } catch (err) {
      console.log('Error creating rule 3');
      throw err;
    }

    try {
      /**** rule 4, HTMLActionCustomCodeRuleOnSuccess, dom-ready ****/
      const rule4 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'HTML Action Custom Code Rule onCustomCodeSuccess'
      });
      const rule4Id = rule4.data.id;
      rulesUsed.push(rule4Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule4Id,
        delegateDescriptorId: 'core::events::dom-ready',
        ruleComponentName: 'dom ready'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule4Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'html',
          source:
            // eslint-disable-next-line max-len
            '<!-- Some comment -->\n<script>\n setTimeout(function() { \n\t markTurbineTestExecuted("HTMLActionCustomCodeRuleOnSuccess::sequence-action-html-1-pass", new Date().toISOString()); \n\t onCustomCodeSuccess(); \n }, 250);\n</script>'
        },
        ruleComponentName: '(0) Custom Code Resolve',
        order: 0
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule4Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'html',
          source:
            // eslint-disable-next-line max-len
            '<script>\n  markTurbineTestExecuted("HTMLActionCustomCodeRuleOnSuccess::sequence-action-html-2-pass", new Date().toISOString());\n</script>'
        },
        ruleComponentName: '(1) Custom Code Resolve',
        order: 1
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule4Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'html',
          source:
            // eslint-disable-next-line max-len
            '<script>\n setTimeout(function() { \n\t markTurbineTestExecuted("HTMLActionCustomCodeRuleOnSuccess::sequence-action-html-3-pass", new Date().toISOString()); \n\t onCustomCodeSuccess(); \n }, 250);\n</script>'
        },
        ruleComponentName: '(2) Custom Code Resolve again',
        order: 2
      });
      /**** end rule 4, HTMLActionCustomCodeRuleOnSuccess, dom-ready ****/
    } catch (err) {
      console.log('Error creating rule 4');
      throw err;
    }

    try {
      /**** rule 5, HTMLActionCustomCodeRuleOnFail, dom-ready ****/
      const rule5 = await ReactorApi.createRule({
        propertyId,
        ruleName: 'HTML Action Custom Code Rule onCustomCodeFailure'
      });
      const rule5Id = rule5.data.id;
      rulesUsed.push(rule5Id);
      // event
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule5Id,
        delegateDescriptorId: 'core::events::dom-ready',
        ruleComponentName: 'dom ready'
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule5Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'html',
          source:
            // eslint-disable-next-line max-len
            '<!-- Some comment -->\n<script>\n setTimeout(function() { \n\t markTurbineTestExecuted("HTMLActionCustomCodeRuleOnFail::sequence-action-html-1-pass", new Date().toISOString()); \n }, 250);\n</script>'
        },
        ruleComponentName: '(0) Custom Code Resolve',
        order: 0
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule5Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'html',
          source:
            // eslint-disable-next-line max-len
            '<script>\n setTimeout(function() { \n\t  onCustomCodeFailure("HTML Custom Code REJECTED"); \n }, 100);\n</script>'
        },
        ruleComponentName: '(1) Custom Code onCustomCodeFailure',
        order: 1
      });
      // action
      await ReactorApi.createRuleComponent({
        propertyId,
        extensionId: coreExtensionId,
        ruleId: rule5Id,
        delegateDescriptorId: 'core::actions::custom-code',
        settings: {
          language: 'html',
          source:
            // eslint-disable-next-line max-len
            '<!-- Some comment -->\n<script>\n setTimeout(function() { \n\t markTurbineTestExecuted("HTMLActionCustomCodeRuleOnFail::sequence-action-html-3-fail", new Date().toISOString()); \n }, 0);\n</script>'
        },
        ruleComponentName: '(2) Custom Code Resolve - do not run',
        order: 2
      });
      /**** end rule 5, HTMLActionCustomCodeRuleOnFail, dom-ready ****/
    } catch (err) {
      console.log('Error creating rule 5');
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
        console.log('Action_Sequence container generated successfully!');
        console.log(propertyName);
        console.log('Property Link:', propertyLink);
        console.log('Library Build:', libraryLink);
        process.exit(0);
      } else {
        console.error('Failed to generate Action_Sequence container:', error);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = generateContainer;
