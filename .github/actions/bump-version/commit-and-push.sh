#!/usr/bin/env bash
set -euo pipefail

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add package.json
git commit -m "ci: bump version to ${VERSION} [skip ci]"

remote="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git push "$remote" "HEAD:${REF}"

if [ "$SKIP_TAG" != "true" ]; then
  git tag "v${VERSION}"
  git push "$remote" "v${VERSION}"
fi
