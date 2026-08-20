#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=================================================="
echo "      RUNNING MOMENTUM TEST SUITE                 "
echo "=================================================="

echo ""
echo ">>> [1/3] Running Backend Unit Tests..."
cd "$DIR/backend"
./mvnw test

echo ""
echo ">>> [2/3] Running Frontend Unit Tests..."
cd "$DIR/frontend"
npm test

echo ""
echo ">>> [3/3] Running Backend REST Integration Tests..."
cd "$DIR"
if [ -f "venv/bin/python" ]; then
    ./venv/bin/python tests/integration/test_crud.py
elif command -v python3 &>/dev/null; then
    python3 tests/integration/test_crud.py
else
    echo "Python not found, skipping integration test script."
fi

echo ""
echo "=================================================="
echo "      ALL TESTS COMPLETED SUCCESSFULLY            "
echo "=================================================="
