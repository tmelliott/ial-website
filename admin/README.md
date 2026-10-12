# Strapi admin trial

Local trial of a Strapi 5 admin beside the live Payload app. The Astro site still reads Payload.

```bash
cd admin
docker compose up --build
```

- Admin: http://localhost:1337/admin
- Login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` (see `.env.example`)
- Postgres on the host: `localhost:5434`

The first boot creates a trial admin user and fills the content types with obvious mock entries when the database is empty. Copy `.env.example` to `.env` before the first run on a new machine. Replace those secrets before this app is deployed anywhere shared.
