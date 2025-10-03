# =========================================
# (c) 2025 Adobe. All rights reserved.
# This file is licensed to you under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License. You may obtain a copy
# of the License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under
# the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
# OF ANY KIND, either express or implied. See the License for the specific language
# governing permissions and limitations under the License.
# =========================================

#!/bin/bash

set -e

PATTERNS=("injectIndex" "REACTOR_KARMA_CI_UNIT_TEST_MODE")
FILES=("dist/engine.js" "dist/engine.min.js")

for FILE in "${FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "❌ $FILE is missing!"
    exit 1
  fi
  for PATTERN in "${PATTERNS[@]}"; do
    if grep -q "$PATTERN" "$FILE"; then
      echo "❌ Found '$PATTERN' in $FILE!"
      exit 1
    fi
  done
done

echo "✅ No test-only code found. dist/engine.js and dist/engine.min.js are ready for production."
