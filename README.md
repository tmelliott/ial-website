# iNZight Analytics website

Public site (Astro) and CMS (Strapi 5). Live hosts are `inzight.co.nz` and `admin.inzight.co.nz`.

| Path | Role |
| ---- | ---- |
| [`site/`](site/) | Astro public site |
| [`admin/`](admin/) | Strapi editor and API |
| [`public/`](public/) | Static assets copied into the site image at build |
| [`design-system/`](design-system/) | Brand tokens and component notes |

## Local stack

```bash
cp admin/.env.example admin/.env
# set SEED_ADMIN_PASSWORD (and other secrets) in admin/.env

docker compose -f compose.stack.yml --profile dev up
```

- Site: http://localhost:4321  
- Strapi: http://localhost:1337/admin  

Built images (no bind mounts):

```bash
docker compose -f compose.stack.yml --profile built up --build
```

See [`admin/README.md`](admin/README.md) for Strapi details.

## Deploy

Images build from this repo (branch `dev` / `strapi-admin-trial`) and digests are pinned in [inzight-analytics/ial-server](https://github.com/inzight-analytics/ial-server) under `k8s/services/ial-website`.
