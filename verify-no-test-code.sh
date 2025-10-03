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
