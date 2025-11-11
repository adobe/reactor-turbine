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

/**
 * Shared utilities for library generation scripts. Wraps the Reactor SDK to make
 * creating resources easier.
 */
const Reactor = require('@adobe/reactor-sdk').default;
const path = require('path');
const packageJson = require(path.resolve(__dirname, '..', 'package.json'));
const thisTurbineVersion = packageJson.version;
require('dotenv').config({ path: path.resolve(__dirname, 'setup', '.env') });
const supportedCompanyTypes = require('./setup/supportedCompanyTypes.json');

function createReactorSdk({ accessToken, reactorUrl, orgId }) {
  return new Reactor(accessToken, {
    reactorUrl: reactorUrl,
    customHeaders: { 'x-gw-ims-org-id': orgId },
    enableLogging: false
  });
}

/* eslint-disable camelcase */

module.exports = function createWrappedReactorApi({ companyType }) {
  if (!supportedCompanyTypes.hasOwnProperty(companyType)) {
    throw new Error(
      `The company type "${companyType}" is not any of the container types
      ${Object.keys(supportedCompanyTypes).join(', ')}`
    );
  }

  let companyId;
  let Reactor;
  if (companyType === supportedCompanyTypes.DEFAULT_COMPANY) {
    companyId = process.env.RSDK_ADOBE_REACTOR_DEFAULT_COMPANY_ID;
    require('dotenv').config({
      path: path.resolve(
        __dirname,
        'setup',
        '.env.access-token-default-company'
      )
    });
    Reactor = createReactorSdk({
      accessToken: process.env.RSDK_DEFAULT_COMPANY_ACCESS_TOKEN,
      reactorUrl: process.env.RSDK_ADOBE_REACTOR_URL,
      orgId: process.env.RSDK_ADOBE_DEFAULT_COMPANY_ORG_ID
    });
  } else {
    companyId = process.env.RSDK_ADOBE_REACTOR_PREMIUM_COMPANY_ID;
    require('dotenv').config({
      path: path.resolve(
        __dirname,
        'setup',
        '.env.access-token-premium-company'
      )
    });
    Reactor = createReactorSdk({
      accessToken: process.env.RSDK_PREMIUM_COMPANY_ACCESS_TOKEN,
      reactorUrl: process.env.RSDK_ADOBE_REACTOR_URL,
      orgId: process.env.RSDK_ADOBE_PREMIUM_COMPANY_ORG_ID
    });
  }

  /**
   * Generate a unique human-readable version string based on UTC timestamp
   * @returns {string} Human-readable version string
   */
  function generateVersion() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hour = String(now.getUTCHours()).padStart(2, '0');
    const minute = String(now.getUTCMinutes()).padStart(2, '0');
    const second = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}${minute}${second}`;
  }

  /**
   * Generate a unique property name with version
   * @param {string} libraryVariantName - Type of container being generated
   * @returns {string} Unique property name
   */
  function generatePropertyName({ libraryVariantName }) {
    const version = generateVersion();
    return `Test Turbine v${thisTurbineVersion} ${libraryVariantName} v${version}`;
  }

  /**
   * Create a property with standard configuration
   * @param {string} propertyName - Name for the property
   * @param {Object} options - Overrides for entries at the same level as 'attributes', etc.
   * @returns {Promise<Object>} Created property
   */
  async function createProperty({ propertyName, options = {} }) {
    try {
      return await Reactor.createProperty(companyId, {
        type: 'properties',
        attributes: {
          name: propertyName,
          domains: ['testing.reactor.turbine.adobe.com'],
          platform: 'web',
          development: false
        },
        undefined_vars_return_empty: false,
        rule_component_sequencing_enabled: false,
        ...options
      });
    } catch (error) {
      console.error('Threw error in createProperty:');
      throw error;
    }
  }

  /**
   * Create an Akamai host for a property
   * @param propertyId
   * @returns {Promise<Object>} Created host
   */
  async function createAkamaiHost({ propertyId }) {
    return await Reactor.createHost(propertyId, {
      attributes: {
        name: 'Development Akamai Host',
        type_of: 'akamai'
      },
      type: 'hosts'
    });
  }

  /**
   * Create a development environment for a property
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Created environment
   */
  async function createDevelopmentEnvironment({ propertyId }) {
    const akamaiHost = await createAkamaiHost({ propertyId });
    const environment = await Reactor.createEnvironment(propertyId, {
      type: 'environments',
      attributes: {
        name: 'Development Environment',
        stage: 'development'
      },
      relationships: {
        host: {
          data: { type: 'hosts', id: akamaiHost.data.id }
        }
      }
    });

    console.log('Created environment:', environment.data.id);
    return environment;
  }

  /**
   * Ensure an extension is installed on a property, installing it if necessary
   * @param propertyId
   * @param extensionPackageName
   * @param settings
   * @returns {Promise<{data: *}>}
   */
  async function ensureExtensionInstalled({
    propertyId,
    extensionPackageName,
    settings = {}
  }) {
    const extensions = await Reactor.listExtensionsForProperty(propertyId);
    let extension = extensions.data.find(
      (ext) => ext.attributes.name === extensionPackageName
    );

    if (!extension) {
      console.log(`⚠️ "${extensionPackageName}" Extension not in the property`);
      // If this extension is not installed, install it
      const {
        data: [extensionPackage]
      } = await Reactor.listExtensionPackages({
        'filter[name]': `EQ ${extensionPackageName}`,
        'filter[platform]': 'EQ web'
      });

      extension = await Reactor.createExtension(propertyId, {
        attributes: {
          delegate_descriptor_id: `${extensionPackageName}::extensionConfiguration::config`,
          settings
        },
        type: 'extensions',
        relationships: {
          extension_package: {
            data: {
              id: extensionPackage.id,
              type: 'extension_packages'
            }
          }
        }
      });

      console.log(
        `✅ "${extensionPackageName}" Extension created for property`
      );
    } else {
      console.log(`✅ "${extensionPackageName}" Extension was already there`);
      extension = { data: extension };
    }

    return extension;
  }

  /**
   * Install an extension with some default settings
   * @param extensionPackageName
   * @param propertyId
   * @returns {Promise<{data: *}>}
   */
  async function installExtension({ extensionPackageName, propertyId }) {
    if (!extensionPackageName) {
      throw new Error(
        'You tried to install an extension without a name provided'
      );
    }

    let settings;
    switch (extensionPackageName) {
      case 'launch-validation':
        settings = JSON.stringify({
          testCode: 'Action',
          creds: [
            {
              user: 'Jason'
            },
            {
              password: 'Jason'
            }
          ]
        });
        break;
      case 'core':
        settings = {};
        break;
      default:
        settings = {};
        break;
    }

    return await ensureExtensionInstalled({
      propertyId,
      extensionPackageName,
      settings
    });
  }

  /**
   * Create a library with specified components
   * @param name - The name of the library in the publishing flow
   * @param propertyId
   * @param environmentId
   * @param dataElementIds - Array of data element IDs for the build
   * @param extensionIdsUsed - Array of extension IDs for the build
   * @param ruleIds - Array of rule IDs for the build
   * @returns {Promise<Object>} The created Library
   */
  async function createLibrary({
    name,
    propertyId,
    environmentId,
    dataElementIds = [],
    extensionIdsUsed = [],
    ruleIds = []
  }) {
    const data = {
      attributes: {
        name
      },
      relationships: {
        environment: {
          data: {
            id: environmentId,
            type: 'environments'
          }
        }
      },
      type: 'libraries'
    };

    if (dataElementIds.length) {
      const dataElements = dataElementIds.map((id) => ({
        id,
        meta: { action: 'revise' },
        type: 'data_elements'
      }));

      data.relationships.data_elements = { data: dataElements };
    }
    if (extensionIdsUsed.length) {
      const extensions = extensionIdsUsed.map((id) => ({
        id,
        meta: { action: 'revise' },
        type: 'extensions'
      }));
      data.relationships.extensions = { data: extensions };
    }
    if (ruleIds.length) {
      const rules = ruleIds.map((id) => ({
        id,
        meta: { action: 'revise' },
        type: 'rules'
      }));
      data.relationships.rules = { data: rules };
    }

    return await Reactor.createLibrary(propertyId, data);
  }

  /**
   * Create a custom code data element.
   * @param propertyId
   * @param coreExtensionId
   * @param settings
   * @param restAttributes
   * @returns {Promise<*>}
   */
  async function createCustomCodeDataElement({
    propertyId,
    coreExtensionId,
    attributes: { settings = {}, ...restAttributes } = {}
  }) {
    const data = {
      attributes: {
        delegate_descriptor_id: 'core::dataElements::custom-code',
        force_lower_case: false,
        // name: attributes.name
        // storage_duration: attributes.storage_duration
        settings: JSON.stringify(settings || {}),
        ...restAttributes
      },
      type: 'data_elements',
      relationships: {
        extension: {
          data: {
            id: coreExtensionId,
            type: 'extensions'
          }
        }
      }
    };

    return await Reactor.createDataElement(propertyId, data);
  }

  /**
   * Create a rule
   * @param propertyId
   * @param ruleName
   * @returns {Promise<Object>} The created Rule
   */
  async function createRule({ propertyId, ruleName }) {
    const data = {
      attributes: { name: ruleName },
      type: 'rules'
    };

    return await Reactor.createRule(propertyId, data);
  }

  /**
   * Create a rule component
   * @param propertyId
   * @param extensionId
   * @param ruleId
   * @param settings - The settings a rule component requires (the returned object from ReactorBridge.getSettings())
   * @param delegateDescriptorId - ex: 'core::events::click'
   * @param ruleComponentName - The name to be used for the rule component
   * @param order
   * @param attributeOverrides
   * @returns {Promise<Object>} The created Rule Component
   */
  async function createRuleComponent({
    propertyId,
    extensionId,
    ruleId,
    settings,
    delegateDescriptorId,
    ruleComponentName,
    order = 0,
    attributeOverrides = {}
  }) {
    const data = {
      attributes: {
        name: ruleComponentName,
        settings: JSON.stringify(settings),
        delegate_descriptor_id: delegateDescriptorId,
        ...attributeOverrides
      },
      relationships: {
        extension: {
          data: {
            id: extensionId,
            type: 'extensions'
          }
        },
        rules: {
          data: [
            {
              id: ruleId,
              type: 'rules'
            }
          ]
        }
      },
      type: 'rule_components'
    };
    if (order != null) {
      data.attributes.order = order;
    }

    return await Reactor.createRuleComponent(propertyId, data);
  }

  /**
   * Create an action that respects promise chain resolves by setting delayNext to true and calls the
   * underlying createRuleComponent function.
   * @param propertyId
   * @param extensionId
   * @param ruleId
   * @param settings
   * @param delegateDescriptorId
   * @param ruleComponentName
   * @param order
   * @returns {Promise<Object>}
   */
  async function createActionThatRespectsPromiseChainResolves({
    propertyId,
    extensionId,
    ruleId,
    settings,
    delegateDescriptorId,
    ruleComponentName,
    order = 0
  }) {
    return await createRuleComponent({
      propertyId,
      extensionId,
      ruleId,
      settings,
      delegateDescriptorId,
      ruleComponentName,
      order,
      attributeOverrides: {
        delayNext: true
      }
    });
  }

  /**
   * Create a click event rule component
   * @param propertyId
   * @param coreExtensionId
   * @param ruleId
   * @param elementSelector - null for any element, or a CSS selector string
   * @returns {Promise<Object>} The created Rule Component
   */
  async function createClickEvent({
    propertyId,
    coreExtensionId,
    ruleId,
    elementSelector = null
  }) {
    const clickSettings = {
      bubbleFireIfChildFired: true,
      bubbleFireIfParent: true
    };
    if (elementSelector) {
      clickSettings.elementSelector = elementSelector;
    }

    return await createRuleComponent({
      propertyId,
      extensionId: coreExtensionId,
      ruleId,
      settings: clickSettings,
      delegateDescriptorId: 'core::events::click',
      ruleComponentName: 'click - event'
    });
  }

  /**
   * Create a browser condition rule component
   * @param propertyId
   * @param coreExtensionId
   * @param ruleId
   * @returns {Promise<Object>} The created Rule Component
   */
  async function createBrowserCondition({
    propertyId,
    coreExtensionId,
    ruleId
  }) {
    return await createRuleComponent({
      propertyId,
      extensionId: coreExtensionId,
      ruleId,
      settings: { browsers: ['Chrome'] },
      delegateDescriptorId: 'core::conditions::browser',
      ruleComponentName: 'browser - condition'
    });
  }

  async function sleepFor(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Build a library and wait for completion
   * @param libraryId
   * @returns {Promise<Object>} The completed build
   */
  async function buildLibrary({ libraryId }) {
    const buildResponse = await Reactor.createBuild(libraryId);
    const buildId = buildResponse.data.id;

    // wait for build to complete
    const totalWait = 300000; // in milliseconds
    const pollInterval = 1000; // in milliseconds
    let polledBuildResponse;
    for (let i = 0; i < totalWait; i += pollInterval) {
      await sleepFor(pollInterval);
      polledBuildResponse = await Reactor.getBuild(buildId);
      console.info(
        `after ${i + pollInterval} milliseconds, ${buildId} is ${
          polledBuildResponse.data.attributes.status
        }`
      );
      if (polledBuildResponse.data.attributes.status !== 'pending') break;
    }
    const status = polledBuildResponse.data.attributes.status;
    if ('succeeded' !== status) {
      throw new Error(`Build ${buildId} did not succeed, status is ${status}`);
    }

    return polledBuildResponse;
  }

  /**
   * Prepare a new property containing an environment, library, and a rule to place delegates in.
   * @param {boolean} ruleComponentSequencingEnabled
   * @param ruleName
   * @param libraryVariantName
   * @returns {Promise<{
   * propertyName: string,
   * propertyId: string,
   * propertyLink: string,
   * environmentId: string,
   * coreExtensionId: string,
   * libraryLink: string,
   * premiumCdnLink?: string,
   * }>}
   */
  async function prepareNewPropertyForDelegates({
    ruleComponentSequencingEnabled = false,
    undefinedVarsReturnsEmpty = false,
    libraryVariantName
  }) {
    const propertyName = generatePropertyName({ libraryVariantName });

    // 1. Create property
    const property = await createProperty({
      propertyName,
      attributes: {
        ruleComponentSequencingEnabled: Boolean(ruleComponentSequencingEnabled),
        undefinedVarsReturnsEmpty: Boolean(undefinedVarsReturnsEmpty)
      }
    });
    const propertyId = property.data.id;
    const propertyLink = `/${companyId}/properties/${propertyId}`;
    console.log(
      `✅ created property (${propertyId}) with name ${propertyName}`
    );

    // 2. Create development environment
    const environment = await createDevelopmentEnvironment({
      propertyId
    });
    const environmentId = environment.data.id;
    console.log('✅ created an akamai environment');

    const libraryLink = environment.data.meta.script_sources.reduce(
      (acc, src) => {
        return src.hosting_region === 'Standard' ? src.minified : acc;
      },
      null
    );
    if (libraryLink) {
      console.log('✅ found the .min.js link for the library');
    } else {
      throw new Error('❌ could not find .min.js link for the library');
    }
    const premiumCdnLink = environment.data.meta.script_sources.reduce(
      (acc, src) => {
        return src.hosting_region === 'China' ? src.debug : acc;
      },
      null
    );

    // 3. Ensure extensions available
    const coreExtension = await installExtension({
      extensionPackageName: 'core',
      propertyId
    });
    const coreExtensionId = coreExtension.data.id;
    console.log(`✅ checked the core extension (${coreExtensionId})`);
    const launchValidationExtension = await installExtension({
      extensionPackageName: 'launch-validation',
      propertyId
    });
    const launchValidationExtensionId = launchValidationExtension.data.id;
    console.log(
      `✅ checked the launch validation extension (${launchValidationExtensionId})`
    );

    let returnResult = {
      propertyName,
      propertyId,
      propertyLink,
      environmentId,
      coreExtensionId,
      launchValidationExtensionId,
      libraryLink
    };
    if (premiumCdnLink) {
      returnResult.premiumCdnLink = premiumCdnLink;
    }
    return returnResult;
  }

  return {
    generatePropertyName,
    createProperty,
    createDevelopmentEnvironment,
    installExtension,
    createLibrary,
    buildLibrary,
    createRule,
    createClickEvent,
    createBrowserCondition,
    prepareNewPropertyForDelegates,
    createRuleComponent,
    createCustomCodeDataElement,
    createActionThatRespectsPromiseChainResolves
  };
};
