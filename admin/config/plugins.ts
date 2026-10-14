import type { Core } from '@strapi/strapi';

import { uploadBreakpoints } from '../src/lib/imageVariants';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
  'application/json',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
];

const deniedTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

function authentikOidc(env: Core.Config.Shared.ConfigParams['env']) {
  const issuer = env('OIDC_ISSUER', '');
  const clientId = env('OIDC_CLIENT_ID', '');
  const clientSecret = env('OIDC_CLIENT_SECRET', '');
  const publicUrl = env('OIDC_PUBLIC_URL', '');
  // Absent credentials leave the admin on email/password. The plugin refuses
  // to boot a sign-in when any of these is missing, so keep it unloaded.
  const configured = issuer !== '' && clientId !== '' && clientSecret !== '' && publicUrl !== '';
  const production = env('NODE_ENV') === 'production';

  return {
    enabled: configured,
    config: {
      OIDC_ISSUER: issuer,
      OIDC_CLIENT_ID: clientId,
      OIDC_CLIENT_SECRET: clientSecret,
      OIDC_PUBLIC_URL: publicUrl,
      OIDC_SCOPE: env('OIDC_SCOPE', 'openid profile email'),
      OIDC_SSO_BUTTON_TEXT: env('OIDC_SSO_BUTTON_TEXT', 'Sign in with Authentik'),
      OIDC_FORCE_SECURE_COOKIES: env.bool('OIDC_FORCE_SECURE_COOKIES', production),
      OIDC_TRUSTED_IP_HEADER: env('OIDC_TRUSTED_IP_HEADER', production ? 'x-real-ip' : ''),
    },
  };
}

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'strapi-plugin-oidc': authentikOidc(env),
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      breakpoints: uploadBreakpoints,
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
