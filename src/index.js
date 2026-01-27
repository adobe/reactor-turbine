var validateInjectedParams = require('./helpers/validate-injected-params');

function indexDependencyInjector({
  logger,
  document,
  objectAssign,
  createDynamicHostResolver,
  buildRuleExecutionOrder,
  createDebugController,
  createExecuteDelegateModule,
  createGetDataElementValue,
  createGetVar,
  createIsVar,
  createModuleProvider,
  createNotifyMonitors,
  createReplaceTokens,
  createSetCustomVar,
  createAddActionToQueue,
  createAddConditionToQueue,
  createAddRuleToQueue,
  createEvaluateConditions,
  createExecuteRule,
  createGetModuleDisplayNameByRuleComponent,
  createGetSyntheticEventMeta,
  createInitEventModule,
  createLogActionError,
  createLogConditionError,
  createLogConditionNotMet,
  createLogRuleCompleted,
  createRunActions,
  createTriggerRule,
  getRuleComponentErrorMessage,
  isConditionMet,
  initRules,
  normalizeRuleComponentError,
  normalizeSyntheticEvent,
  getNamespacedStorage,
  hydrateModuleProvider,
  hydrateSatelliteObject,
  createSettingsFileTransformer
}) {
  // this satellite variable needs to be a reference to the window._satellite object.
  // we will modify it in place.
  return function decorateSatellite(satellite) {
    if (satellite && !window.__satelliteLoaded) {
      // If a consumer loads the library multiple times, make sure only the first time is effective.
      window.__satelliteLoaded = true;

      var container = satellite.container;

      // Remove container in public scope ASAP so it can't be manipulated by extension or user code.
      delete satellite.container;

      /*
        get rid of container.buildInfo decoration once deprecation is finished of
        buildInfo.environment string
       */
      var buildInfo = objectAssign({}, container.buildInfo);
      Object.defineProperty(buildInfo, 'environment', {
        get: function () {
          logger.deprecation(
            'container.buildInfo.environment is deprecated.' +
              'Please use `container.environment.stage` instead'
          );
          return container.environment.stage;
        }
      });
      container.buildInfo = buildInfo;

      var localStorage = getNamespacedStorage('localStorage');
      var debugController = createDebugController(localStorage, logger);

      var currentScriptSource = '';
      if (
        document.currentScript &&
        document.currentScript.getAttribute('src')
      ) {
        currentScriptSource = document.currentScript.getAttribute('src');
      }
      var dynamicHostResolver;
      try {
        dynamicHostResolver = createDynamicHostResolver(
          currentScriptSource,
          Boolean(container.company.dynamicCdnEnabled),
          container.company.cdnAllowList,
          debugController
        );
      } catch (e) {
        logger.warn('Please review the following error:');
        throw e; // We don't want to continue allowing Turbine to start up if we detect an error in here
      }

      var settingsFileTransformer = createSettingsFileTransformer(
        dynamicHostResolver.isDynamicEnforced,
        dynamicHostResolver.decorateWithDynamicHost
      );

      var moduleProvider = createModuleProvider();

      var replaceTokens;

      var undefinedVarsReturnEmpty =
        container.property.settings.undefinedVarsReturnEmpty;
      var ruleComponentSequencingEnabled =
        container.property.settings.ruleComponentSequencingEnabled;

      var dataElements = container.dataElements || {};

      var getDataElementDefinition = function (name) {
        return dataElements[name];
      };

      // We support data elements referencing other data elements. In order to be able to retrieve a
      // data element value, we need to be able to replace data element tokens inside its settings
      // object (which is what replaceTokens is for). In order to be able to replace data element
      // tokens inside a settings object, we need to be able to retrieve data element
      // values (which is what getDataElementValue is for). This proxy replaceTokens function solves the
      // chicken-or-the-egg problem by allowing us to provide a replaceTokens function to
      // getDataElementValue that will stand in place of the real replaceTokens function until it
      // can be created. This also means that createDataElementValue should not call the proxy
      // replaceTokens function until after the real replaceTokens has been created.
      var proxyReplaceTokens = function () {
        return replaceTokens.apply(null, arguments);
      };

      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        proxyReplaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformer
      );

      var customVars = {};
      var setCustomVar = createSetCustomVar(customVars);

      var isVar = createIsVar(customVars, getDataElementDefinition);

      var getVar = createGetVar(
        customVars,
        getDataElementDefinition,
        getDataElementValue
      );

      replaceTokens = createReplaceTokens(
        isVar,
        getVar,
        undefinedVarsReturnEmpty
      );

      // Important to hydrate satellite object before we hydrate the module provider or init rules.
      // When we hydrate module provider, we also execute extension code which may be
      // accessing _satellite.
      hydrateSatelliteObject(
        satellite,
        container,
        debugController.setDebugEnabled,
        getVar,
        setCustomVar
      );

      hydrateModuleProvider(
        container,
        moduleProvider,
        debugController,
        replaceTokens,
        getDataElementValue,
        settingsFileTransformer,
        dynamicHostResolver.decorateWithDynamicHost
      );

      var notifyMonitors = createNotifyMonitors(satellite);
      var executeDelegateModule = createExecuteDelegateModule(
        moduleProvider,
        replaceTokens,
        settingsFileTransformer
      );

      var getModuleDisplayNameByRuleComponent =
        createGetModuleDisplayNameByRuleComponent(moduleProvider);
      var logConditionNotMet = createLogConditionNotMet(
        getModuleDisplayNameByRuleComponent,
        logger,
        notifyMonitors
      );
      var logConditionError = createLogConditionError(
        getRuleComponentErrorMessage,
        getModuleDisplayNameByRuleComponent,
        logger,
        notifyMonitors
      );
      var logActionError = createLogActionError(
        getRuleComponentErrorMessage,
        getModuleDisplayNameByRuleComponent,
        logger,
        notifyMonitors
      );
      var logRuleCompleted = createLogRuleCompleted(logger, notifyMonitors);

      var evaluateConditions = createEvaluateConditions(
        executeDelegateModule,
        isConditionMet,
        logConditionNotMet,
        logConditionError
      );
      var runActions = createRunActions(
        executeDelegateModule,
        logActionError,
        logRuleCompleted
      );
      var executeRule = createExecuteRule(evaluateConditions, runActions);

      var addConditionToQueue = createAddConditionToQueue(
        executeDelegateModule,
        normalizeRuleComponentError,
        isConditionMet,
        logConditionError,
        logConditionNotMet
      );
      var addActionToQueue = createAddActionToQueue(
        executeDelegateModule,
        normalizeRuleComponentError,
        logActionError
      );
      var addRuleToQueue = createAddRuleToQueue(
        addConditionToQueue,
        addActionToQueue,
        logRuleCompleted
      );

      var triggerRule = createTriggerRule(
        ruleComponentSequencingEnabled,
        executeRule,
        addRuleToQueue,
        notifyMonitors
      );

      var getSyntheticEventMeta = createGetSyntheticEventMeta(moduleProvider);

      var initEventModule = createInitEventModule(
        triggerRule,
        executeDelegateModule,
        normalizeSyntheticEvent,
        getRuleComponentErrorMessage,
        getSyntheticEventMeta,
        logger
      );

      initRules(
        buildRuleExecutionOrder,
        container.rules || [],
        initEventModule
      );
    }
  };
}

var decorateSatellite = validateInjectedParams(
  indexDependencyInjector({
    logger: require('./logger'),
    document: require('@adobe/reactor-document'),
    objectAssign: require('@adobe/reactor-object-assign'),
    createDynamicHostResolver: require('./createDynamicHostResolver'),
    buildRuleExecutionOrder: require('./buildRuleExecutionOrder'),
    createDebugController: require('./createDebugController'),
    createExecuteDelegateModule: require('./createExecuteDelegateModule'),
    createGetDataElementValue: require('./createGetDataElementValue'),
    createGetVar: require('./createGetVar'),
    createIsVar: require('./createIsVar'),
    createModuleProvider: require('./createModuleProvider'),
    createNotifyMonitors: require('./createNotifyMonitors'),
    createReplaceTokens: require('./createReplaceTokens'),
    createSetCustomVar: require('./createSetCustomVar'),
    createAddActionToQueue: require('./rules/createAddActionToQueue'),
    createAddConditionToQueue: require('./rules/createAddConditionToQueue'),
    createAddRuleToQueue: require('./rules/createAddRuleToQueue'),
    createEvaluateConditions: require('./rules/createEvaluateConditions'),
    createExecuteRule: require('./rules/createExecuteRule'),
    createGetModuleDisplayNameByRuleComponent: require('./rules/createGetModuleDisplayNameByRuleComponent'),
    createGetSyntheticEventMeta: require('./rules/createGetSyntheticEventMeta'),
    createInitEventModule: require('./rules/createInitEventModule'),
    createLogActionError: require('./rules/createLogActionError'),
    createLogConditionError: require('./rules/createLogConditionError'),
    createLogConditionNotMet: require('./rules/createLogConditionNotMet'),
    createLogRuleCompleted: require('./rules/createLogRuleCompleted'),
    createRunActions: require('./rules/createRunActions'),
    createTriggerRule: require('./rules/createTriggerRule'),
    getRuleComponentErrorMessage: require('./rules/getRuleComponentErrorMessage'),
    isConditionMet: require('./rules/isConditionMet'),
    initRules: require('./rules/initRules'),
    normalizeRuleComponentError: require('./rules/normalizeRuleComponentError'),
    normalizeSyntheticEvent: require('./rules/normalizeSyntheticEvent'),
    getNamespacedStorage: require('./getNamespacedStorage'),
    hydrateModuleProvider: require('./hydrateModuleProvider'),
    hydrateSatelliteObject: require('./hydrateSatelliteObject'),
    createSettingsFileTransformer: require('./createSettingsFileTransformer')
  })
);

if (REACTOR_KARMA_CI_UNIT_TEST_MODE) {
  /* START.TESTS_ONLY */
  module.exports.injectIndex = validateInjectedParams(indexDependencyInjector);
  /* END.TESTS_ONLY */
} else {
  // Forge is outputting an IIFE that defines window._satellite
  var _satellite = window._satellite;
  decorateSatellite(_satellite);
  module.exports = _satellite;
}
