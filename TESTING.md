# Adobe Experience Platform Tags Turbine (Web) Testing Guide

When running the tests for this project, there are a few important details to keep in mind.

### Unit Tests (Fast Feedback)

`npm run test:unit`

This repository has an extensive suite of unit tests that verify your local code changes in-real-time. These do not
require a deployment of Turbine to npm and, subsequently, an image deployment of Forge for these to give feedback.

### Integration Tests

> [!IMPORTANT]
>
> The `npm run test:integration` command has some local "fake library" tests and tests with real libraries.

> [!IMPORTANT]
>
> Gotchas:
> 1. Changing the source code of Turbine itself without bumping the version inside `package.json`.
> 2. Rebasing your branch on top of any other branch that has changes to Turbine. This one is very dangerous because conceptually, you may not have a reason to bump the version even after a rebase.

**When you make a change to the Turbine engine, *you can't get a full picture on if the changes are working unless you
deploy a Forge image*.**

The `src/integration/faked-libraries` folder builds a fake Blacksmith container and slams the
`dist/engine.js` with it to fake a library. Running the integration test command should run the `npm run build:production`
command to ensure `dist/engine.js` is up to date.

However, the tests inside `src/integration/real-libraries` require the new Forge image after making a change to Turbine.

> [!IMPORTANT]
> 
> `npm run test:integration` will look like everything is passing when you don't really know if the new code is working
> correctly yet.

The reason this happens is due to how `npm run ensure-integration-test-libraries` works.

### Ensure Integration Test Libraries

The job of `npm run ensure-integration-test-libraries` is to keep the test feedback loop fast. When you've decided that
the changes to Turbine are in a testable state, you'll be making most of the changes in `ci-scripts/test-variant-generators`
(to define a library variant) and `src/integration/real-libraries` (to define the test cases).

When writing test cases, we don't want to be bogged down with re-building libraries that don't need to change. Here's the
conceptual overview of `npm run ensure-integration-test-libraries`:

1. Loop over the defined library variants
1. Decide if the variant is publicly accessible on akamai and if its Turbine version matches the version in `package.json`.
   1. If `npm run ensure-integration-test-libraries -- --force` is used, skip this check and rebuild the library no matter what.
   2. If you manually delete an entry within `ci-scripts/library-build-paths.json`, you can force the rebuild of only that entry when running `npm run ensure-integration-test-libraries` without the force flag.
1. If there's a mismatch on the Turbine versions, build the library using its generator function inside `ci-scripts/test-variant-generators`. If the new library still has a Turbine mismatch, then fail the entire script.
1. Write the updated entries to `ci-scripts/library-build-paths.json`.

> [!IMPORTANT]
> 
> As you can see, if you never change the deployed Turbine version, the `npm run ensure-integration-test-libraries` command
> has no way of knowing that you made a change to Turbine itself if you don't bump the version within `package.json`.

### Pull Requests Caveats

When opening a pull request, we have a special command for unit tests that runs in CI mode. The GitHub Actions environment will
manually install `karma-sauce-launcher`. This is delegated to only the testing environment on pull request due to its outdated
codebase. You can view it like this:

1. `npm run test:unit` contains Karma testing with coverage reporting
1. `npm run test:unit:ci:pull:request` still contains coverage reporting but uses Sauce Labs for browser testing in the CI environment.
1. `npm run test:unit:ci:npm:publish` does a quick run of the Karma unit tests with no coverage and no checks in Sauce Labs.

Integration testing for pull requests uses `npm run ensure-integration-test-libraries`, which uses your defined files
within `ci-scripts/test-variant-generators` unless it detects a mismatch in Turbine versions.

> [!IMPORTANT]
> 
> It is possible for a pull request run to build a new library variant for the run in the CI environment without it being
> checked back into the repository.

This is acceptable behavior. The library build references themselves aren't special, the template layouts for building the
libraries in `ci-scripts/test-variant-generators` are the source of truth for what a library should look like.

### Publishing

The `.github/workflows/npm-publish.yaml` workflow uses the following special commands:
1. `npm run test:unit:ci:npm:publish`
   1. Runs Karma headless with no coverage reporting. Coverage checks should have happened during pull requests.
1. `npm run test:integration:ci:npm:publish`
   1. Ensures a production build and runs `npm run ensure-integration-test-libraries -- --force` to ensure fresh libraries are built to run tests on publish.
