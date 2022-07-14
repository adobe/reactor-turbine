# Adobe Experience Platform Tags Turbine (Web)

[![Build Status](https://img.shields.io/github/workflow/status/adobe/reactor-turbine/ci?style=flat)](https://github.com/adobe/reactor-turbine/actions)
[![Coverage Status](https://coveralls.io/repos/github/adobe/reactor-turbine/badge.svg)](https://coveralls.io/github/adobe/reactor-turbine)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@adobe/reactor-turbine.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-turbine)

Adobe Experience Platform Tags is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Tags, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

Turbine is the orchestrator within a Tags JavaScript runtime library (the library deployed on a client website) which processes previously configured rules and delegates logic to extensions.

This project is not intended to be used directly by consumers; it is used by the Platform Tags build system and incorporated into emitted runtime libraries.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
3. Clone the repository.
4. After navigating into the project directory, install project dependencies by running `npm install`.

### Scripts

To run tests a single time, run the following command:

`npm run test`

To run tests continually while developing, run the following command:

`npm run test:watch`

To ensure your code meets our linting standards, run the following command:

`npm run lint`

To create a build, run the following command:

`npm run build`

## Browser Support

Turbine supports the following browsers:

* Chrome (latest)
* Safari (latest)
* Firefox (latest)
* Internet Explorer (10 and above)
* iOS Safari (latest)

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
