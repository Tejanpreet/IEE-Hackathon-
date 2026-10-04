#!/usr/bin/env bash
# Runs a TypeScript typecheck after Claude edits a .ts/.tsx file in frontend/.
# Exit code 2 feeds the errors back to Claude so it fixes them right away.
input=$(cat)
file=$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)
case "$file" in
  *frontend/*.ts|*frontend/*.tsx) ;;
  *) exit 0 ;;
esac
cd "$CLAUDE_PROJECT_DIR/frontend" 2>/dev/null || exit 0
[ -d node_modules ] || exit 0
out=$(npx tsc --noEmit -p . 2>&1)
if [ $? -ne 0 ]; then
  echo "TypeScript errors after editing $file:" >&2
  echo "$out" | head -n 30 >&2
  exit 2
fi
exit 0
