#!/usr/bin/env bash
set -euo pipefail

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add package.json package-lock.json
# [bump] rather than [skip ci]: versionBumpCheck.yml keys its re-entry guard on this marker, and
# GitHub treats [skip ci] as an instruction to run nothing, which left every pull request with no
# checks at all on its head commit
git commit -m "ci: bump version to ${VERSION} [bump]"

remote="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git push "$remote" "HEAD:${REF}"

if [ "$SKIP_TAG" != "true" ]; then
  git tag "v${VERSION}"
  git push "$remote" "v${VERSION}"
fi
