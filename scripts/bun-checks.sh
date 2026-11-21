#!/usr/bin/bash
set -euo pipefail

bun run format
bun run lint
bun run typecheck
bun run test
bun run build