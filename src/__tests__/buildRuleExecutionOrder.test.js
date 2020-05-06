/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var buildRuleExecutionOrder = require('../buildRuleExecutionOrder');

describe('buildRuleExecutionOrder', function () {
  it('orders rules whose order is swapped in different events', function () {
    var ruleA = {
      events: [
        {
          modulePath: 'event1.js',
          ruleOrder: 100
        },
        {
          modulePath: 'event2.js',
          ruleOrder: 200
        }
      ]
    };

    var ruleB = {
      events: [
        {
          modulePath: 'event1.js',
          ruleOrder: 200
        },
        {
          modulePath: 'event2.js',
          ruleOrder: 100
        }
      ]
    };

    var executionOrder = buildRuleExecutionOrder([ruleA, ruleB]);

    expect(executionOrder).toEqual([
      {
        rule: ruleA,
        event: ruleA.events[0]
      },
      {
        rule: ruleB,
        event: ruleB.events[1]
      },
      {
        rule: ruleA,
        event: ruleA.events[1]
      },
      {
        rule: ruleB,
        event: ruleB.events[0]
      }
    ]);
  });

  it('maintains the natural order to no ruleOrder provided', function () {
    // Note that we don't provide a default ruleOrder value. This is because ruleOrder will
    // be required in the container schema. However, when users are testing things out in the
    // sandbox, it's nice to be able to leave off ruleOrder and have the rules still execute
    // in a reasonable order.
    var ruleA = {
      events: [
        {
          modulePath: 'event1.js'
        }
      ]
    };

    var ruleB = {
      events: [
        {
          modulePath: 'event1.js'
        }
      ]
    };

    var ruleC = {
      events: [
        {
          modulePath: 'event1.js'
        }
      ]
    };

    var exectionOrder = buildRuleExecutionOrder([ruleA, ruleB, ruleC]);

    expect(exectionOrder).toEqual([
      {
        rule: ruleA,
        event: ruleA.events[0]
      },
      {
        rule: ruleB,
        event: ruleB.events[0]
      },
      {
        rule: ruleC,
        event: ruleC.events[0]
      }
    ]);
  });

  it('handles rules with no events', function () {
    var ruleA = {
      events: []
    };

    var executionOrder = buildRuleExecutionOrder([ruleA]);

    expect(executionOrder).toEqual([]);
  });
});
