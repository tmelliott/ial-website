#!/bin/sh
# Create the ial-admin secret from the local .env file.
# SERVER_URL must be the public admin origin (same host as the Ingress).
#
#   SERVER_URL=https://admin.inzight.co.nz \
#   NEXT_PUBLIC_URL=https://inzight.co.nz \
#   ./k8s/admin/create-secret.sh
set -eu

namespace="${NAMESPACE:-ial}"
env_file="${ENV_FILE:-.env}"

if [ -z "${SERVER_URL:-}" ]; then
  echo "Set SERVER_URL to the admin origin, e.g. https://admin.inzight.co.nz" >&2
  exit 1
fi

if [ ! -f "$env_file" ]; then
  echo "Missing $env_file" >&2
  exit 1
fi

lookup() {
  key="$1"
  value="$(grep -E "^${key}=" "$env_file" | head -n 1 | cut -d= -f2- || true)"
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  printf '%s' "$value"
}

database_uri="$(lookup DATABASE_URI)"
payload_secret="$(lookup PAYLOAD_SECRET)"
blob_token="$(lookup BLOB_READ_WRITE_TOKEN)"
build_hook="$(lookup VERCEL_BUILD_HOOK_URL)"
public_url="${NEXT_PUBLIC_URL:-$(lookup NEXT_PUBLIC_URL)}"

for pair in \
  "DATABASE_URI:$database_uri" \
  "PAYLOAD_SECRET:$payload_secret" \
  "BLOB_READ_WRITE_TOKEN:$blob_token" \
  "VERCEL_BUILD_HOOK_URL:$build_hook" \
  "NEXT_PUBLIC_URL:$public_url"
do
  key="${pair%%:*}"
  value="${pair#*:}"
  if [ -z "$value" ]; then
    echo "Missing $key" >&2
    exit 1
  fi
done

kubectl create namespace "$namespace" --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic ial-admin \
  --namespace "$namespace" \
  --from-literal=DATABASE_URI="$database_uri" \
  --from-literal=PAYLOAD_SECRET="$payload_secret" \
  --from-literal=BLOB_READ_WRITE_TOKEN="$blob_token" \
  --from-literal=VERCEL_BUILD_HOOK_URL="$build_hook" \
  --from-literal=NEXT_PUBLIC_URL="$public_url" \
  --from-literal=SERVER_URL="$SERVER_URL" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Updated secret ial-admin in namespace $namespace"
