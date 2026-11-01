import { locationWithoutOversizedIdToken } from '../lib/oidcLogoutLocation';

const LOGOUT_PATH = '/strapi-plugin-oidc/logout';

type Next = () => Promise<void>;

type Context = {
  path: string;
  response: { get(field: string): string };
  set(field: string, value: string): void;
};

export default function oidcLogoutRedirect() {
  return async (ctx: Context, next: Next): Promise<void> => {
    await next();
    if (ctx.path !== LOGOUT_PATH) return;

    const location = ctx.response.get('Location');
    if (!location) return;

    const trimmed = locationWithoutOversizedIdToken(location);
    if (trimmed === location) return;
    ctx.set('Location', trimmed);
  };
}
