#!/usr/bin/env bash
set -euo pipefail

cd noisy/$(grep -E '^[^ ]+:$' noisy/versions.yaml | tail -n 1 | tr -d :)
echo Serving $PWD
npx serve
