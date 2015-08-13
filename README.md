## Development Setup
1. Install [node.js](https://nodejs.org/)
1. Install [gulp.js](http://gulpjs.com/) globally by running `npm install -g gulp`
1. Clone this repository.
1. After navigating into the project directory, install project dependencies by running `npm install`.
1. The following commands are available to run depending on what you want to do:
 * `gulp` Builds the engine and watches for file changes. When a file changes, it will re-build the engine.
 * `gulp test` Runs tests in Chrome and watches for file changes. As source files and test files are changed, it will re-run the tests.
 * `gulp testall` The same as `gulp test` but runs the tests in almost all target browsers. In order to use this feature you will need to use [ievms](https://github.com/xdissent/ievms) to set up local virtual machines with Internet Explorer. If you'd rather not go this route but would still like to test on browsers like Internet Explorer, run `gulp test`, open up your target browser, and navigate to the same testing URL that Chrome is using.
 * `gulp lint` Evaluates the codebase to ensure everything is following the project's coding standards.
