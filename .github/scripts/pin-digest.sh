#!/bin/bash
# Pin an image digest on inzight-analytics/ial-server main.
# Uses git push. The dispatch API returns 401 for this PAT; git push is the
# path the Kaniko bot already uses.
set -euo pipefail

: "${TOKEN:?}" "${DIGEST:?}" "${GIT_SHA:?}" "${APP:?}"

case "$APP" in
  ial-website-site | ial-website-strapi) ;;
  *)
    echo "unexpected app: $APP" >&2
    exit 1
    ;;
esac
if ! [[ "$DIGEST" =~ ^sha256:[a-f0-9]{64}$ ]]; then
  echo "unexpected digest" >&2
  exit 1
fi
if ! [[ "$GIT_SHA" =~ ^[a-f0-9]{40}$ ]]; then
  echo "unexpected git sha" >&2
  exit 1
fi

auth=$(printf 'x-access-token:%s' "$TOKEN" | base64 -w0)
gitconfig=(
  -c "http.extraheader=AUTHORIZATION: basic ${auth}"
  -c user.name="github-actions[bot]"
  -c user.email="41898282+github-actions[bot]@users.noreply.github.com"
)

workdir=$(mktemp -d)
git "${gitconfig[@]}" clone --depth=1 https://github.com/inzight-analytics/ial-server.git "$workdir"
cd "$workdir"

APP="$APP" DIGEST="$DIGEST" GIT_SHA="$GIT_SHA" python3 - <<'PY'
import os, re, sys
from pathlib import Path

app = os.environ["APP"]
digest = os.environ["DIGEST"]
git_sha = os.environ["GIT_SHA"]
path = Path(f"k8s/services/ial-website/deployment-{app.removeprefix('ial-website-')}.yaml")
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

doc = Path("docs/migrations/ial-website.md")
if doc.exists():
    body, n = re.subn(
        rf"{re.escape(image)}@sha256:[a-f0-9]{{64}}",
        f"{image}@{digest}",
        doc.read_text(),
    )
    if n:
        doc.write_text(body)
PY

git add k8s/services/ial-website docs/migrations/ial-website.md
if git diff --staged --quiet; then
  echo "Digest already pinned."
  exit 0
fi
git "${gitconfig[@]}" commit -m "Deploy ${APP} @ ${GIT_SHA:0:7}"
for _ in 1 2 3; do
  git "${gitconfig[@]}" pull --rebase origin main
  if git "${gitconfig[@]}" push origin HEAD:main; then
    echo "Pinned ${APP} @ ${GIT_SHA:0:7}"
    exit 0
  fi
  sleep 5
done
echo "push to ial-server failed" >&2
exit 1
