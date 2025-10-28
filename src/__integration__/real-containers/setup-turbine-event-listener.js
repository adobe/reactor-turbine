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

// DEFAULT TIMEOUTS: 10s test overall, 5s waiting for expected actions to come through
module.exports = async function setupTurbineEventListener({
  page,
  expectedActionIds,
  unexpectedActionIds,
  extendTimeoutsByMs = 0
}) {
  if (!Array.isArray(expectedActionIds) || !expectedActionIds.length) {
    throw new Error('No expected action ids defined for test scenario');
  }
  if (
    unexpectedActionIds != null &&
    (!Array.isArray(unexpectedActionIds) || !unexpectedActionIds.length)
  ) {
    throw new Error(
      'Unexpected action ids must be a non-empty array, if defined'
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
          expectedIds,
          unexpectedIds,
          extendTimeoutsBy
        }) => {
          try {
            // stores calls to window.markTurbineTestExecuted into an array to return to playwright later
            const expectedActionsFound = [];
            const unexpectedActionsFound = [];
            // on timeout, log out what actions were received.
            const timeoutMessages = [];

            function rejectTestAndDebug(error) {
              timeoutMessages.unshift(
                '----- Test Time Out/Early Reject Condition. Showing All Messages Received During Test -----'
              );
              timeoutMessages.forEach((timeoutMessage) => {
                console.log(timeoutMessage);
              });

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
            window.markTurbineTestExecuted = function (actionId, timestamp) {
              if (!actionId?.length) {
                rejectTestAndDebug(
                  new Error(
                    'An actionId came through undefined or empty. There is a problem with the setup of a rule.'
                  )
                );
              }
              const messageDetails = { actionId, timestamp };
              // if a test times out, then we'll log every message received IN THE ORDER it was received.
              timeoutMessages.push(
                `called window.markTurbineTestExecuted with ${JSON.stringify(messageDetails)}`
              );
              if (expectedIds.includes(actionId)) {
                expectedActionsFound.push(messageDetails);
                // we think we should be done
                if (
                  expectedActionsFound.length === expectedIds.length &&
                  unexpectedActionsFound.length === 0
                ) {
                  const gracePeriodTimeout = !unexpectedIds?.length
                    ? 0 // there are no unexpectedIds to check, so we don't need a grace period
                    : 2000;
                  // grace period to see if unexpected actions end up flowing through
                  // after we think we're done
                  window.setTimeout(function () {
                    if (
                      expectedActionsFound.length === expectedIds.length &&
                      unexpectedActionsFound.length === 0
                    ) {
                      window[doneFuncName]({
                        expectedActionsFound,
                        // unexpectedActionsFound should always be empty. assert in test file.
                        unexpectedActionsFound
                      });
                    }
                  }, gracePeriodTimeout); // don't extend the check for extra actions to come in.
                }
              } else if (
                unexpectedIds != null && // unexpectedIds is optional
                unexpectedIds.includes(actionId)
              ) {
                // ❌ An unexpected action fired, capture it so our resolve condition fails
                // The timeout will print the order of all messages received.
                unexpectedActionsFound.push(messageDetails);
                timeoutMessages.push('^---- This action was NOT expected!');
              }
            };

            // ❌ Timed out after 5s while waiting for all actions received OR received an unexpected action
            window.setTimeout(
              rejectTestAndDebug.bind(
                this,
                new Error(
                  'Test timed out after 5s waiting for expected actions'
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
          expectedIds: expectedActionIds,
          unexpectedIds: unexpectedActionIds,
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
