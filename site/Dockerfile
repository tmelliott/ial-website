FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY . .
# The animated background lives in the repo-root public folder, outside this
# context. The named context `assets` is that folder. Replace the dev symlink
# with the real file so the built image does not keep a dangling link.
COPY --from=assets meshblock-bg.webp /tmp/meshblock-bg.webp
COPY --from=assets news-placeholder.jpg /tmp/news-placeholder.jpg
RUN rm -f public/meshblock-bg.webp public/news-placeholder.jpg \
  && mv /tmp/meshblock-bg.webp public/meshblock-bg.webp \
  && mv /tmp/news-placeholder.jpg public/news-placeholder.jpg
# Astro inlines these public server env vars at build time. Override with
# --build-arg. A runtime change does not retarget Strapi.
ARG STRAPI_URL=https://site-admin.inzight.co.nz
ARG STRAPI_INTERNAL_URL=http://strapi:1337
ENV STRAPI_URL=$STRAPI_URL \
    STRAPI_INTERNAL_URL=$STRAPI_INTERNAL_URL
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "./dist/server/entry.mjs"]
