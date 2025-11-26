#!/bin/sh

echo "Running database seed..."
node seed.js || echo "Seed failed (possibly already seeded). Continuing..."

echo "Starting API..."
node index.js
