import type { Core } from '@strapi/strapi';

function previewPath(uid: string, document: { slug?: string | null } | null): string | null {
  const slug = document?.slug;
  switch (uid) {
    case 'api::news-item.news-item':
      return slug ? `/news/${slug}` : '/news';
    case 'api::project.project':
      return slug ? `/projects/${slug}` : '/projects';
    case 'api::team-member.team-member':
      return slug ? `/team/${slug}` : '/about#team';
    case 'api::keyword.keyword':
      if (!slug) return null;
      return slug === 'horizon-europe' ? '/horizon-europe' : `/keywords/${slug}`;
    case 'api::app.app':
      return slug ? `/apps#${slug}` : '/apps';
    case 'api::about.about':
      return '/about';
    case 'api::projects-page.projects-page':
      return '/projects';
    case 'api::news-page.news-page':
      return '/news';
    case 'api::apps-page.apps-page':
      return '/apps';
    case 'api::general.general':
    case 'api::home-hero.home-hero':
    case 'api::home-projects.home-projects':
    case 'api::home-team.home-team':
    case 'api::home-collaborators.home-collaborators':
    case 'api::home-apps.home-apps':
    case 'api::home-news.home-news':
      return '/';
    default:
      return null;
  }
}

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:4321')],
      async handler(uid, { documentId, status }) {
        const clientUrl = env('CLIENT_URL', 'http://localhost:4321');
        const secret = env('PREVIEW_SECRET');
        const cms = (
          globalThis as {
            strapi: {
              documents: (name: string) => {
                findOne: (args: { documentId: string; status?: string }) => Promise<{ slug?: string | null } | null>;
              };
            };
          }
        ).strapi;
        const document = await cms.documents(uid).findOne({
          documentId,
          status: status === 'published' ? 'published' : 'draft',
        });
        const pathname = previewPath(uid, document as { slug?: string | null } | null);
        if (!pathname || !secret) return null;
        const url = new URL(pathname, clientUrl);
        url.searchParams.set('preview', secret);
        if (status) url.searchParams.set('status', status);
        return url.toString();
      },
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});

export default config;
