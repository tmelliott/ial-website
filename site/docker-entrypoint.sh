#!/bin/sh
set -e
cd /app

export HOME="${HOME:-/home/node}"

if [ ! -x node_modules/.bin/astro ]; then
  npm ci
fi

if [ "$(stat -c %u node_modules)" != "$(id -u node)" ]; then
  chown -R node:node node_modules
fi

exec setpriv --reuid=node --regid=node --init-groups -- "$@"
