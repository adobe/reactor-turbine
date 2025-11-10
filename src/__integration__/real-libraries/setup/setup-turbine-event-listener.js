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

// DEFAULT TIMEOUTS: 10s test overall, 5s waiting for expected identifiers to come through
module.exports = async function setupTurbineEventListener({
  page,
  expectedTestIdentifiers,
  unexpectedTestIdentifiers,
  extendTimeoutsByMs = 0
}) {
  if (
    !Array.isArray(expectedTestIdentifiers) ||
    !expectedTestIdentifiers.length
  ) {
    throw new Error('No expected test identifiers defined for test scenario');
  }
  if (
    unexpectedTestIdentifiers != null &&
    (!Array.isArray(unexpectedTestIdentifiers) ||
      !unexpectedTestIdentifiers.length)
  ) {
    throw new Error(
      'Unexpected test identifiers must be a non-empty array, if defined'
    );
  }

  // capture browser console logs to node console
  page.on('console', (msg) => {
    console.log('Page Log:', msg.text());
  });

  // scope this function to this test to help ensure test sandboxing for results.
  const windowFuncDoneName = `notifyFinishedTestScenario_${Date.now()}`;
  const windowFuncRejectName = `notifyRejectTestScenario_${Date.now()}`;

  let resolvePromise;
  let rejectPromise;
  const testResultsPromise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  /** if the test takes 10 seconds, bail **/
  const testMasterTimeoutId = setTimeout(() => {
    delete window[windowFuncDoneName];
    console.log('Fallback Timeout:: Turbine test timed out after 10s');
    rejectPromise(new Error('Timeout waiting for test results'));
  }, 10000 + extendTimeoutsByMs);
  /** if the test takes 10 seconds, bail **/

  /*** resolve/reject promises for the test results ***/
  const exposeWindowFunctionsPromise = page
    .exposeFunction(windowFuncDoneName, (results) => {
      resolvePromise(results);
      clearTimeout(testMasterTimeoutId);
      delete window[windowFuncDoneName];
      delete window[windowFuncRejectName];
    })
    .then(() =>
      page.exposeFunction(windowFuncRejectName, (result) => {
        rejectPromise(result);
        clearTimeout(testMasterTimeoutId);
        delete window[windowFuncDoneName];
        delete window[windowFuncRejectName];
      })
    );
  /*** resolve/reject promises for the test results ***/

  /*** setup window.markTurbineTestExecuted, test results capture, call the "doneFunc" with results ***/
  const testSetupPromise = exposeWindowFunctionsPromise.then(() =>
    page
      .evaluate(
        ({
          doneFuncName,
          rejectFuncName,
          expectedIdentifiers,
          unexpectedIdentifiers,
          extendTimeoutsBy
        }) => {
          try {
            // stores calls to window.markTurbineTestExecuted into an array to return to playwright later
            const expectedTestIdentifiersFound = [];
            const unexpectedTestIdentifiersFound = [];
            // on timeout, log out what test identifiers were received.
            const timeoutMessages = [];

            function rejectTestAndDebug(error) {
              timeoutMessages.unshift(
                '----- Test Time Out/Early Reject Condition. Showing All Messages Received During Test -----'
              );
              timeoutMessages.forEach((timeoutMessage) => {
                console.log(timeoutMessage);
              });

              // debug if we have things coming through we didn't document as unexpected for the test
              if (
                expectedTestIdentifiersFound.length !==
                expectedIdentifiers.length
              ) {
                console.log(
                  'expectedIdentifiers.length:',
                  expectedIdentifiers.length
                );
                console.log(
                  'expectedTestIdentifiersFound.length:',
                  expectedTestIdentifiersFound.length
                );
              }

              if (!(error instanceof Error)) {
                window[rejectFuncName](
                  new Error(
                    `When attempting to rejectTestAndDebug,
                    the error provided was not an Error instance. Received: ${JSON.stringify(error)}`
                  )
                );
              } else {
                window[rejectFuncName](error);
              }
            }

            /** called from the Turbine runtime **/
            window.markTurbineTestExecuted = function (
              testIdentifier,
              timestamp
            ) {
              if (!testIdentifier?.length) {
                rejectTestAndDebug(
                  new Error(
                    'A test identifier came through undefined or empty. There is a problem with the setup of a rule.'
                  )
                );
              }
              const messageDetails = { testIdentifier, timestamp };
              // if a test times out, then we'll log every message received IN THE ORDER it was received.
              timeoutMessages.push(
                `called window.markTurbineTestExecuted with ${JSON.stringify(messageDetails)}`
              );
              if (expectedIdentifiers.includes(testIdentifier)) {
                expectedTestIdentifiersFound.push(messageDetails);
                // we think we should be done
                if (
                  expectedTestIdentifiersFound.length ===
                    expectedIdentifiers.length &&
                  unexpectedTestIdentifiersFound.length === 0
                ) {
                  const gracePeriodTimeout = !unexpectedIdentifiers?.length
                    ? 0 // there are no unexpectedIds to check, so we don't need a grace period
                    : 2000;
                  // grace period to see if unexpected test identifiers end up flowing through
                  // after we think we're done
                  window.setTimeout(function () {
                    if (
                      expectedTestIdentifiersFound.length ===
                        expectedIdentifiers.length &&
                      unexpectedTestIdentifiersFound.length === 0
                    ) {
                      window[doneFuncName]({
                        expectedTestIdentifiersFound,
                        // unexpectedTestIdentifiersFound should always be empty. assert in test file.
                        unexpectedTestIdentifiersFound
                      });
                    }
                  }, gracePeriodTimeout); // don't extend the check for extra test identifiers to come in.
                }
              } else if (
                unexpectedIdentifiers != null && // unexpectedIds is optional
                unexpectedIdentifiers.includes(testIdentifier)
              ) {
                // ❌ An unexpected identifier fired, capture it so our resolve condition fails
                // The timeout will print the order of all messages received.
                unexpectedTestIdentifiersFound.push(messageDetails);
                timeoutMessages.push(
                  '^---- This test identifier was NOT expected!'
                );
              } else {
                timeoutMessages.push(
                  "^---- This test identifier came through but wasn't documented as unexpected!"
                );
              }
            };

            // ❌ Timed out after 5s while waiting for all messages from turbine
            // received OR received an unexpected identifier
            window.setTimeout(
              rejectTestAndDebug.bind(
                this,
                new Error(
                  'Test timed out after 5s waiting for expected test identifiers'
                )
              ),
              5000 + extendTimeoutsBy
            );
          } catch (e) {
            console.log(e);
          }
        },
        {
          doneFuncName: windowFuncDoneName,
          rejectFuncName: windowFuncRejectName,
          expectedIdentifiers: expectedTestIdentifiers,
          unexpectedIdentifiers: unexpectedTestIdentifiers,
          extendTimeoutsBy: extendTimeoutsByMs
        }
      )
      .then(() => {
        return page.waitForFunction(
          () => typeof window.markTurbineTestExecuted === 'function'
        );
      })
  );
  /*** setup window.markTurbineTestExecuted, test results capture, call the "doneFunc" with results ***/

  // return the test setup promise. when that resolves, then hand over the test results promise.
  return testSetupPromise.then(() => testResultsPromise);
};
