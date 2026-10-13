FROM node:22-bookworm-slim

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm ci

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY . .

# Build-only values. They are not ENV, so they are not the runtime defaults.
# Compose and the cluster must set the real secrets. The entrypoint refuses
# to start in production when any of them is missing or still "build".
ARG APP_KEYS=build
ARG API_TOKEN_SALT=build
ARG ADMIN_JWT_SECRET=build
ARG JWT_SECRET=build
ARG TRANSFER_TOKEN_SALT=build
ARG ENCRYPTION_KEY=build
RUN APP_KEYS="$APP_KEYS" \
    API_TOKEN_SALT="$API_TOKEN_SALT" \
    ADMIN_JWT_SECRET="$ADMIN_JWT_SECRET" \
    JWT_SECRET="$JWT_SECRET" \
    TRANSFER_TOKEN_SALT="$TRANSFER_TOKEN_SALT" \
    ENCRYPTION_KEY="$ENCRYPTION_KEY" \
    DATABASE_CLIENT=sqlite \
    npm run build

EXPOSE 1337
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
