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

# Restore Higgsfield auth from the HIGGSFIELD_CREDENTIALS_JSON environment
# secret (set in the Claude Code environment config) if no newer local
# credentials exist — the CLI rewrites this file when it refreshes tokens.
if [ -n "${HIGGSFIELD_CREDENTIALS_JSON:-}" ] && [ ! -f "$HOME/.config/higgsfield/credentials.json" ]; then
  mkdir -p "$HOME/.config/higgsfield"
  printf '%s' "$HIGGSFIELD_CREDENTIALS_JSON" > "$HOME/.config/higgsfield/credentials.json"
  chmod 600 "$HOME/.config/higgsfield/credentials.json"
fi
