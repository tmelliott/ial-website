# Strapi admin

Local Strapi 5 admin. The Astro site reads this API at `http://localhost:1337`.

```bash
cd admin
docker compose up --build
```

- Admin: http://localhost:1337/admin
- Login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` (see `.env.example`)
- Postgres on the host: `localhost:5434`

The first boot creates a trial admin user when none exists. Mock entries are only inserted when `SEED_MOCK=true` and the database has no projects. Copy `.env.example` to `.env` before the first run on a new machine. Replace those secrets before this app is deployed anywhere shared.
