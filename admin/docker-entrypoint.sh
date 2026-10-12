#!/bin/sh
set -e
cd /opt/app

# The process drops to the node user, whose config directory is not /root.
export HOME=/home/node

if [ ! -x node_modules/.bin/strapi ]; then
  npm ci
fi

# A fresh named volume is root-owned. The process runs as the image's node
# user (uid 1000) so files written onto the bind mount stay editable on the host.
if [ "$(stat -c %u node_modules)" != "$(id -u node)" ]; then
  chown -R node:node node_modules
fi

exec setpriv --reuid=node --regid=node --init-groups -- "$@"
