#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web — remote containers start fresh
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Project dependencies (vite, eslint, etc.)
npm install --no-audit --no-fund

# Higgsfield CLI for image/video generation (used by .agents/skills/higgsfield-*)
if ! command -v higgsfield >/dev/null 2>&1; then
  npm install -g @higgsfield/cli --no-audit --no-fund
fi
