#!/bin/bash
# Pin site and/or Strapi digests on inzight-analytics/ial-server in one commit.
# Git push: this PAT can push git, and GitHub returns 401 for repository_dispatch.
set -euo pipefail

: "${TOKEN:?}" "${GIT_SHA:?}"
SITE_DIGEST="${SITE_DIGEST:-}"
STRAPI_DIGEST="${STRAPI_DIGEST:-}"

if [[ -z "$SITE_DIGEST" && -z "$STRAPI_DIGEST" ]]; then
  echo "no digests to pin" >&2
  exit 1
fi
if ! [[ "$GIT_SHA" =~ ^[a-f0-9]{40}$ ]]; then
  echo "unexpected git sha" >&2
  exit 1
fi
for digest in "$SITE_DIGEST" "$STRAPI_DIGEST"; do
  [[ -z "$digest" ]] && continue
  if ! [[ "$digest" =~ ^sha256:[a-f0-9]{64}$ ]]; then
    echo "unexpected digest" >&2
    exit 1
  fi
done

auth=$(printf 'x-access-token:%s' "$TOKEN" | base64 -w0)
gitconfig=(
  -c "http.extraheader=AUTHORIZATION: basic ${auth}"
  -c user.name="github-actions[bot]"
  -c user.email="41898282+github-actions[bot]@users.noreply.github.com"
)

workdir=$(mktemp -d)
git "${gitconfig[@]}" clone --depth=1 https://github.com/inzight-analytics/ial-server.git "$workdir"
cd "$workdir"

SITE_DIGEST="$SITE_DIGEST" STRAPI_DIGEST="$STRAPI_DIGEST" GIT_SHA="$GIT_SHA" python3 - <<'PY'
import os, re, sys
from pathlib import Path

git_sha = os.environ["GIT_SHA"]
pairs = [
    ("ial-website-site", os.environ.get("SITE_DIGEST", "")),
    ("ial-website-strapi", os.environ.get("STRAPI_DIGEST", "")),
]
doc = Path("docs/migrations/ial-website.md")
doc_body = doc.read_text() if doc.exists() else None

for app, digest in pairs:
    if not digest:
        continue
    name = app.removeprefix("ial-website-")
    path = Path(f"k8s/services/ial-website/deployment-{name}.yaml")
    image = f"ghcr.io/inzight-analytics/{app}"
    text = path.read_text()
    text, n = re.subn(
        rf"image: {re.escape(image)}@sha256:[a-f0-9]{{64}}",
        f"image: {image}@{digest}",
        text,
        count=1,
    )
    if n != 1:
        sys.exit(f"image line not found in {path}")
    text, n = re.subn(
        r'ial\.nz/git-commit: ".*"',
        f'ial.nz/git-commit: "{git_sha}"',
        text,
        count=1,
    )
    if n != 1:
        sys.exit(f"git-commit annotation not found in {path}")
    path.write_text(text)
    if doc_body is not None:
        doc_body, n = re.subn(
            rf"{re.escape(image)}@sha256:[a-f0-9]{{64}}",
            f"{image}@{digest}",
            doc_body,
        )

if doc_body is not None:
    doc.write_text(doc_body)
PY

if [[ -n "$SITE_DIGEST" && -n "$STRAPI_DIGEST" ]]; then
  subject="Deploy ial-website @ ${GIT_SHA:0:7}"
elif [[ -n "$SITE_DIGEST" ]]; then
  subject="Deploy ial-website-site @ ${GIT_SHA:0:7}"
else
  subject="Deploy ial-website-strapi @ ${GIT_SHA:0:7}"
fi

git add k8s/services/ial-website docs/migrations/ial-website.md
if git diff --staged --quiet; then
  echo "Digests already pinned."
  exit 0
fi
git "${gitconfig[@]}" commit -m "$subject"
for _ in 1 2 3; do
  git "${gitconfig[@]}" pull --rebase origin main
  if git "${gitconfig[@]}" push origin HEAD:main; then
    echo "Pinned: $subject"
    exit 0
  fi
  sleep 5
done
echo "push to ial-server failed" >&2
exit 1
