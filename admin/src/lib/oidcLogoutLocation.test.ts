import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { locationWithoutOversizedIdToken } from './oidcLogoutLocation';

const END_SESSION = 'https://auth.inzight.co.nz/application/o/site-admin/end-session/';
const RETURN_TO = 'https://admin.inzight.co.nz/admin/auth/login';

function logoutLocation(idToken: string): string {
  const url = new URL(END_SESSION);
  url.searchParams.set('client_id', 'site-admin');
  url.searchParams.set('post_logout_redirect_uri', RETURN_TO);
  url.searchParams.set('id_token_hint', idToken);
  return url.toString();
}

describe('locationWithoutOversizedIdToken', () => {
  it('leaves a short login redirect alone', () => {
    const location = RETURN_TO;
    assert.equal(locationWithoutOversizedIdToken(location), location);
  });

  it('drops the ID token and keeps the post-logout redirect', () => {
    const location = logoutLocation('a'.repeat(1800));
    const trimmed = new URL(locationWithoutOversizedIdToken(location));

    assert.equal(trimmed.searchParams.has('id_token_hint'), false);
    assert.equal(trimmed.searchParams.get('post_logout_redirect_uri'), RETURN_TO);
    assert.equal(trimmed.searchParams.get('client_id'), 'site-admin');
    assert.equal(trimmed.origin, 'https://auth.inzight.co.nz');
    assert.equal(trimmed.pathname, '/application/o/site-admin/end-session/');
  });

  it('leaves a long redirect that has no ID token alone', () => {
    const url = new URL(END_SESSION);
    url.searchParams.set('post_logout_redirect_uri', `${RETURN_TO}?${'x'.repeat(800)}`);
    const location = url.toString();
    assert.equal(locationWithoutOversizedIdToken(location), location);
  });

  it('leaves an unparseable value alone', () => {
    const location = `not a url ${'a'.repeat(800)}`;
    assert.equal(locationWithoutOversizedIdToken(location), location);
  });
});
