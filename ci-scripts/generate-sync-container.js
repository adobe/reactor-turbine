#!/usr/bin/env node
/**
 * Generate sync container for integration testing
 *
 * This script handles sync container generation for testing purposes.
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
      ruleId,
      coreExtensionId
    } = await ReactorApi.prepareNewPropertyForDelegates({
      ruleComponentSequencingEnabled: false
    });

    /*** make delegates ***/
    /*const clickEvent = */
    await ReactorApi.createClickEvent({
      propertyId,
      coreExtensionId,
      ruleId
    });
    console.log('✅ created a click event');
    // const clickEventId = clickEvent.data.id;

    /*const browserCondition = */
    await ReactorApi.createBrowserCondition({
      propertyId,
      coreExtensionId,
      ruleId
    });
    console.log('✅ created a browser condition');
    // const browserConditionId = browserCondition.data.id;
    console.log('✅ finished rules/conditions/actions creations');
    /*** make delegates ***/

    /*** create Library ***/
    const library = await ReactorApi.createLibrary({
      name: 'API Build Library',
      propertyId,
      environmentId,
      extensionIdsUsed: [coreExtensionId],
      ruleIds: [ruleId]
    });
    const libraryId = library.data.id;
    console.log('✅ made a library');

    const completedBuild = await ReactorApi.buildLibrary({ libraryId });
    console.log('✅ create sync build', completedBuild.data.id);
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
        console.log('Sync container generated successfully!');
        console.log(propertyName);
        console.log('Property Link:', propertyLink);
        console.log('Library Build:', libraryLink);
        process.exit(0);
      } else {
        console.error('Failed to generate sync container:', error);
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Unexpected error:', err);
      process.exit(1);
    });
}

module.exports = generateContainer;
