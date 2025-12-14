# Cache Revalidation Setup

This project uses Next.js `revalidateTag` to ensure statically-rendered pages are updated whenever content changes in Payload CMS.

## How It Works

1. **Cache Tags**: Content is tagged with cache tags (e.g., `projects`, `project-{slug}`, `news`, etc.)
2. **Payload Hooks**: Collection and global hooks call `revalidateTag` directly when content changes
3. **Revalidation API**: An optional API route at `/api/revalidate` for external webhooks
4. **Cached Queries**: Pages use cached queries with tags (optional but recommended for optimal performance)

## Cache Tags

Cache tags are defined in `src/lib/payload-cache.ts`:

- **Collections**: `projects`, `news`, `team`, `apps`, `keywords`
- **Individual items**: `project-{slug}`, `news-{slug}`, `team-{slug}`, etc.
- **Globals**: `global-general`, `global-homeHero`, `global-projectsPage`, etc.
- **Home page**: `home`

## Revalidation API (Optional)

The revalidation API at `/api/revalidate` is available for external webhooks if needed. Payload hooks call `revalidateTag` directly, so this is only needed for external integrations.

```bash
# POST with JSON body
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"tags": ["projects", "news"]}'

# GET with query params
curl "http://localhost:3000/api/revalidate?tag=projects&tag=news" \
  -H "Authorization: Bearer YOUR_SECRET"
```

### Security

Set `REVALIDATE_SECRET` environment variable to require authentication:

```env
REVALIDATE_SECRET=your-secret-key-here
```

## Payload Hooks

All collection and global hooks automatically call `revalidateTag` directly (no HTTP calls needed):

- **Projects**: Revalidates project pages, keyword pages, and home page
- **News**: Revalidates news pages, keyword pages, and home page (only when published)
- **Team**: Revalidates team member pages, keyword pages, and home page
- **Apps**: Revalidates app pages, keyword pages, and home page
- **Keywords**: Revalidates keyword pages
- **Globals**: Revalidate their respective pages

Hooks use simple helper functions from `src/lib/revalidate.ts` that call `revalidateTag` directly.

## Using Cached Queries in Pages

For optimal performance, use cached queries from `src/lib/payload-queries.ts`:

```typescript
import { getCachedProjectBySlug, getCachedGlobal } from "@/lib/payload-queries";

export default async function Page({ params }: { params: { slug: string } }) {
  const project = await getCachedProjectBySlug(params.slug);
  const global = await getCachedGlobal("general");
  // ...
}
```

Or wrap your own queries with `unstable_cache`:

```typescript
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/payload-cache";

const getProject = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config });
    return payload.find({
      collection: "projects",
      where: { slug: { equals: slug } },
    });
  },
  ["project", slug],
  {
    tags: [CACHE_TAGS.projects, CACHE_TAGS.project(slug)],
  }
);
```

## Environment Variables

Add to your `.env`:

```env
# Required: Secret for revalidation API authentication
REVALIDATE_SECRET=your-secret-key-here

# Optional: Server URL (defaults to http://localhost:3000)
SERVER_URL=https://your-production-domain.com
```

## Testing

Test revalidation locally:

```bash
# Revalidate all projects
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"tags": ["projects"]}'

# Revalidate a specific project
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"tags": ["project-my-project-slug"]}'
```

## Production Deployment

1. (Optional) Set `REVALIDATE_SECRET` if you need the external API endpoint
2. Content updates in Payload will automatically trigger revalidation via hooks
3. Pages will be regenerated on the next request

## Notes

- Hooks call `revalidateTag` directly - no HTTP overhead
- Simple, synchronous revalidation - no async complexity
- Pages are regenerated on the next request after content changes
