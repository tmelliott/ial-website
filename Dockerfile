FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json scripts/prepare-docker-package.mjs ./
# Install the declared versions. package.json uses ^ ranges, and a fresh
# resolve currently jumps Payload from 3.50 to 3.90.
RUN node prepare-docker-package.mjs && pnpm install

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_STANDALONE=1
ENV NEXT_TELEMETRY_DISABLED=1
# Middleware inlines these at build time. Real secrets stay in the mounted
# .env and are not copied into the runtime image. Existing env wins over .env.
ARG NEXT_PUBLIC_URL=https://inzight.co.nz
ENV ADMIN_ONLY=true
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
RUN --mount=type=secret,id=dotenv,target=/app/.env ./node_modules/.bin/next build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Next standalone reads HOSTNAME. Kubernetes sets HOSTNAME to the pod name,
# so the Deployment must also set HOSTNAME=0.0.0.0.
ENV HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
