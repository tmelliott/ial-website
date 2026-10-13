#!/bin/sh
set -e
cd /opt/app

# The process drops to the node user, whose config directory is not /root.
export HOME=/home/node

if [ ! -x node_modules/.bin/strapi ]; then
  npm ci
fi

if [ "$NODE_ENV" = "production" ]; then
  for name in APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET JWT_SECRET TRANSFER_TOKEN_SALT ENCRYPTION_KEY; do
    eval "value=\${$name:-}"
    if [ -z "$value" ] || [ "$value" = "build" ]; then
      echo "$name must be set to a real secret before Strapi starts" >&2
      exit 1
    fi
  done
fi

# A fresh named volume is root-owned. The process runs as the image's node
# user (uid 1000) so files written onto the bind mount stay editable on the host.
if [ "$(stat -c %u node_modules)" != "$(id -u node)" ]; then
  chown -R node:node node_modules
fi

exec setpriv --reuid=node --regid=node --init-groups -- "$@"
