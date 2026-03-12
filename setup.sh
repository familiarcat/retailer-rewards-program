#!/bin/bash
# setup.sh — Install project dependencies

set -e

echo "Installing dependencies..."
npm install
echo "Done. Run './start.sh' to launch or './test.sh' to run tests."
