'use strict';

// Engine tests
var testsContext = require.context('./src', true, /__tests__\/.*\.test\.jsx?$/);
testsContext.keys().forEach(testsContext);

// This is necessary for the coverage report to show all source files even when they're not
// included by tests. https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/15
var srcContext = require.context('./src', true, /^((?!__tests__).)*\.jsx?$/);
srcContext.keys().forEach(srcContext);

// Core module package tests
testsContext = require.context('./coreModulePackages', true, /^.\/[^\/]*\/test\.js/);
testsContext.keys().forEach(testsContext);

// This is necessary for the coverage report to show all source files even when they're not
// included by tests. https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/15
srcContext = require.context('./coreModulePackages', true, /^.\/[^\/]*\/index\.js/);
srcContext.keys().forEach(srcContext);
