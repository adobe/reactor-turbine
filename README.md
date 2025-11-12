# Adobe Experience Platform Tags Turbine (Web)

[![Build Status](https://img.shields.io/github/actions/workflow/status/adobe/reactor-turbine/dev.yaml?style=flat)](https://github.com/adobe/reactor-turbine/actions)
[![Coverage Status](https://coveralls.io/repos/github/adobe/reactor-turbine/badge.svg)](https://coveralls.io/github/adobe/reactor-turbine)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@adobe/reactor-turbine.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-turbine)

Adobe Experience Platform Tags is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Tags, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

Turbine is the orchestrator within a Tags JavaScript runtime library (the library deployed on a client website) which processes previously configured rules and delegates logic to extensions.

This project is not intended to be used directly by consumers; it is used by the Platform Tags build system and incorporated into emitted runtime libraries.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
1. Clone the repository.
1. After navigating into the project directory, install project dependencies by running `npm install`.
1. `cp .env-example .env` and modify the environment variables as needed.

### Scripts

To run tests a single time, run the following command:

`npm run test`

To ensure your code meets our linting standards, run the following command:

`npm run lint`

To create a build, run the following command:

`npm run build`

To create a production build, run the following command:

`npm run build:production`

For integration tests, you can run the following commands:
* To check if the real integration libraries are ready for testing: `npm run ensure-integration-test-libraries`
* To force a rebuild of all the real libraries for testing: `npm run ensure-integration-test-libraries -- --force`
* `npm run test:integration`
* **NOTE**: This project relies on the [launch-validation-extension-package](https://github.com/oneAdobe/reactor-launch-validation-extension) to be publicly available on npm to run the integration tests.


### Pull Request & Deployment Process

When you bump package.json and open a pull request, the `dev.yaml` GitHub Action workflow will verify that the Turbine
version deployed to the `next` tag on npm matches the version in package.json. **If it does not match**, the workflow
will perform the following steps:

1. run a production build.
1. push to the npm `next` tag using the current version in `package.json`.
1. Exit with `failure code 78`.

In the event that the deployment exits with `failure code 78`, the Reactor team will need to deploy the new version to
an image. After the deployment is complete, re-run the failed workflow job. It will:

1. verify that the Turbine version deployed to the `next` tag on npm matches the version in package.json.
1. Run the unit tests
1. Run Coveralls
1. Run the integration tests, building new test scenario libraries if necessary.

If you push a new commit to an open PR without bumping package.json, the versions should match and the tests should run
uninterrupted.

## Browser Support

Turbine supports the following browsers:

* Chrome (latest)
* Safari (latest)
* Firefox (latest)
* Edge (latest)
* iOS Safari (latest)

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
