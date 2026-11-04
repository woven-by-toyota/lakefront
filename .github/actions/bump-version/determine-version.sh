#!/usr/bin/env bash
set -euo pipefail

if [[ "$COMMIT_RANGE" == *".."* ]]; then
  messages="$(git log --format=%B "$COMMIT_RANGE")"
else
  messages="$(git log -1 --format=%B "$COMMIT_RANGE")"
fi

matches_any_word() {
  local wording="$1"
  local word
  IFS=',' read -ra words <<< "$wording"
  for word in "${words[@]}"; do
    word="$(echo "$word" | xargs)"
    [ -z "$word" ] && continue
    if grep -qiE "\\b${word//[^a-zA-Z0-9]/\\&}\\b" <<< "$messages"; then
      echo "$word"
      return 0
    fi
  done
  return 1
}

bump_type="$DEFAULT_BUMP"
preid=""

if matched="$(matches_any_word "$MAJOR_WORDING")"; then
  bump_type="major"
elif matched="$(matches_any_word "$MINOR_WORDING")"; then
  bump_type="minor"
elif matched="$(matches_any_word "$RC_WORDING")"; then
  bump_type="prerelease"
  preid="$(echo "$matched" | tr '[:upper:]' '[:lower:]')"
elif matched="$(matches_any_word "$PATCH_WORDING")"; then
  bump_type="patch"
fi

if [ "$bump_type" = "prerelease" ]; then
  new_version="$(npm version prerelease --preid="$preid" --no-git-tag-version)"
else
  new_version="$(npm version "$bump_type" --no-git-tag-version)"
fi

echo "version=${new_version#v}" >> "$GITHUB_OUTPUT"
echo "Bumped version to $new_version ($bump_type)"
