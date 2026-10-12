import { crc32 } from 'node:zlib';
import { deflateSync } from 'node:zlib';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import type { Core } from '@strapi/strapi';

type Doc = { documentId: string };
type MediaFile = { id: number };

type DocumentsApi = {
  create: (args: {
    data: Record<string, unknown>;
    status?: 'published' | 'draft';
  }) => Promise<Doc>;
};

function documents(strapi: Core.Strapi, uid: string): DocumentsApi {
  return (strapi.documents as unknown as (uid: string) => DocumentsApi)(uid);
}

function paragraph(text: string) {
  return {
    type: 'paragraph',
    children: [{ type: 'text', text }],
  };
}

function blocks(heading: string, text: string) {
  return [
    {
      type: 'heading',
      level: 2,
      children: [{ type: 'text', text: heading }],
    },
    paragraph(text),
  ];
}

function note(text: string) {
  return [paragraph(text)];
}

function chunk(type: string, data: Buffer) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([length, typeBuf, data, crc]);
}

function solidPng(width: number, height: number, rgb: [number, number, number]) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const row = Buffer.alloc(1 + width * 3);
  for (let x = 0; x < width; x += 1) {
    row[1 + x * 3] = rgb[0];
    row[2 + x * 3] = rgb[1];
    row[3 + x * 3] = rgb[2];
  }
  const raw = Buffer.alloc(row.length * height);
  for (let y = 0; y < height; y += 1) {
    row.copy(raw, y * row.length);
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function uploadBuffer(
  strapi: Core.Strapi,
  body: Buffer,
  filename: string,
  mimetype: string,
  info: { alternativeText?: string; caption?: string },
): Promise<MediaFile> {
  const filepath = path.join(os.tmpdir(), filename);
  await fs.writeFile(filepath, body);
  const upload = strapi.plugin('upload').service('upload') as {
    upload: (args: {
      data: { fileInfo: typeof info };
      files: {
        filepath: string;
        originalFilename: string;
        mimetype: string;
        size: number;
      };
    }) => Promise<MediaFile[]>;
  };
  const uploaded = await upload.upload({
    data: { fileInfo: info },
    files: {
      filepath,
      originalFilename: filename,
      mimetype,
      size: body.length,
    },
  });
  await fs.rm(filepath, { force: true });
  return uploaded[0];
}

async function ensureAdmin(strapi: Core.Strapi) {
  const existing = await strapi.db.query('admin::user').count();
  if (existing > 0) return;

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'TrialAdmin123!';
  const userService = strapi.service('admin::user') as {
    createFirstAdmin: (user: Record<string, unknown>) => Promise<unknown>;
  };
  await userService.createFirstAdmin({
    email,
    password,
    firstname: 'Trial',
    lastname: 'Admin',
  });
  strapi.log.info(`Created trial admin ${email}`);
}

async function grantPublicRead(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) return;

  const actions = ['plugin::upload.content-api.find', 'plugin::upload.content-api.findOne'];
  for (const [uid, contentType] of Object.entries(strapi.contentTypes)) {
    if (!uid.startsWith('api::')) continue;
    actions.push(`${uid}.find`);
    if (contentType.kind === 'collectionType') {
      actions.push(`${uid}.findOne`);
    }
  }

  for (const action of actions) {
    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (existing) continue;
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: publicRole.id },
    });
  }
}

async function seedContent(strapi: Core.Strapi) {
  const projectCount = await strapi.db.query('api::project.project').count();
  if (projectCount > 0) return;

  const banner = await uploadBuffer(
    strapi,
    solidPng(1400, 900, [32, 96, 168]),
    'mock-banner.png',
    'image/png',
    { alternativeText: 'MOCK banner', caption: 'Temporary placeholder image' },
  );
  const logo = await uploadBuffer(
    strapi,
    solidPng(800, 800, [20, 120, 110]),
    'mock-logo.png',
    'image/png',
    { alternativeText: 'MOCK logo', caption: 'Temporary placeholder logo' },
  );
  const portrait = await uploadBuffer(
    strapi,
    solidPng(800, 1000, [90, 70, 140]),
    'mock-portrait.png',
    'image/png',
    { alternativeText: 'MOCK portrait', caption: 'Temporary placeholder portrait' },
  );
  const social = await uploadBuffer(
    strapi,
    solidPng(1200, 630, [180, 90, 40]),
    'mock-social.png',
    'image/png',
    { alternativeText: 'MOCK social image', caption: 'Temporary Open Graph image' },
  );
  const mark = await uploadBuffer(
    strapi,
    solidPng(600, 400, [40, 70, 90]),
    'mock-mark.png',
    'image/png',
    { alternativeText: 'MOCK collaborator mark', caption: 'Temporary collaborator image' },
  );
  const appLogo = await uploadBuffer(
    strapi,
    solidPng(512, 512, [200, 80, 90]),
    'mock-app-logo.png',
    'image/png',
    { alternativeText: 'MOCK app logo', caption: 'Temporary app logo' },
  );
  const notes = await uploadBuffer(
    strapi,
    Buffer.from('MOCK file. This is temporary trial content, not a real document.\n'),
    'mock-notes.txt',
    'text/plain',
    { alternativeText: 'MOCK notes', caption: 'Temporary text file' },
  );

  const visualisation = await documents(strapi, 'api::keyword.keyword').create({
    data: {
      title: 'MOCK: Visualisation',
      slug: 'mock-visualisation',
      heading: 'MOCK everything tagged visualisation',
      description: note('Temporary keyword used to try the admin. Not real site content.'),
      linkGroups: [
        {
          label: 'MOCK resources',
          featured: true,
          groupLinks: [{ link: 'https://example.com/mock-visualisation', description: 'MOCK link' }],
        },
      ],
    },
  });
  const sovereignty = await documents(strapi, 'api::keyword.keyword').create({
    data: {
      title: 'MOCK: Data sovereignty',
      slug: 'mock-data-sovereignty',
      description: note('Temporary keyword. Replace this when real content is imported.'),
    },
  });

  const aroha = await documents(strapi, 'api::team-member.team-member').create({
    data: {
      fullname: 'MOCK Aroha Bennett',
      name: { title: 'Dr', first: 'MOCK Aroha', last: 'Bennett' },
      order: 1,
      slug: 'mock-aroha-bennett',
      role: 'MOCK analyst',
      email: 'aroha.mock@example.com',
      iwi: 'MOCK iwi',
      bio: blocks('MOCK biography', 'Aroha is placeholder team copy for the Strapi trial.'),
      photo: portrait.id,
      socialMedia: [{ url: 'https://example.com/mock-aroha', name: 'mock-aroha' }],
      keywords: { connect: [visualisation.documentId] },
    },
  });
  const sam = await documents(strapi, 'api::team-member.team-member').create({
    data: {
      fullname: 'MOCK Sam Chen',
      name: { first: 'MOCK Sam', last: 'Chen' },
      order: 2,
      slug: 'mock-sam-chen',
      role: 'MOCK designer',
      email: 'sam.mock@example.com',
      bio: blocks('MOCK biography', 'Sam is placeholder team copy for the Strapi trial.'),
      photo: portrait.id,
      keywords: { connect: [sovereignty.documentId] },
    },
  });

  const tide = await documents(strapi, 'api::app.app').create({
    data: {
      title: 'MOCK Tide Chart',
      slug: 'mock-tide-chart',
      content: blocks('MOCK Tide Chart', 'A fake app entry so the apps admin can be clicked through.'),
      banner: banner.id,
      logo: appLogo.id,
      link: 'https://example.com/mock-tide-chart',
      keywords: { connect: [visualisation.documentId] },
    },
  });

  const harbour = await documents(strapi, 'api::project.project').create({
    data: {
      title: 'MOCK Harbour light',
      slug: 'mock-harbour-light',
      startDate: '2024-02-01',
      endDate: '2025-11-30',
      content: blocks(
        'MOCK Harbour light',
        'Placeholder project. The blocks below are Strapi rich text, not Payload Lexical.',
      ),
      priority: 2,
      banner: banner.id,
      linkGroups: [
        {
          label: 'MOCK outputs',
          featured: false,
          groupLinks: [
            { link: 'https://example.com/mock-harbour', description: 'MOCK project site' },
          ],
        },
      ],
      files: [notes.id],
      keywords: { connect: [visualisation.documentId, sovereignty.documentId] },
      team: { connect: [aroha.documentId] },
      team2: [
        {
          contributorType: 'teamMember',
          teamMember: { connect: [aroha.documentId] },
          role: 'MOCK lead',
        },
        {
          contributorType: 'nameAndUrl',
          name: 'MOCK External Person',
          url: 'https://example.com/mock-person',
          role: 'MOCK advisor',
        },
      ],
    },
  });
  const survey = await documents(strapi, 'api::project.project').create({
    data: {
      title: 'MOCK School survey',
      slug: 'mock-school-survey',
      startDate: '2023-06-01',
      content: blocks('MOCK School survey', 'A second placeholder project with a lower priority.'),
      priority: 1,
      banner: banner.id,
      keywords: { connect: [sovereignty.documentId] },
      team: { connect: [sam.documentId, aroha.documentId] },
    },
  });

  await documents(strapi, 'api::news-item.news-item').create({
    status: 'published',
    data: {
      title: 'MOCK Workshop notes',
      slug: 'mock-workshop-notes',
      date: '2026-03-12',
      content: blocks('MOCK Workshop notes', 'Published placeholder news item for the trial.'),
      link: { label: 'MOCK external write-up', url: 'https://example.com/mock-workshop' },
      newstype: 'Publication',
      keywords: { connect: [visualisation.documentId] },
      team: { connect: [aroha.documentId] },
      gallery: [banner.id, social.id],
    },
  });
  await documents(strapi, 'api::news-item.news-item').create({
    status: 'draft',
    data: {
      title: 'MOCK Data week',
      slug: 'mock-data-week',
      date: '2026-04-02',
      content: blocks('MOCK Data week', 'This item is a draft, so the public API should hide it.'),
      newstype: 'Event',
      keywords: { connect: [sovereignty.documentId] },
      team: { connect: [sam.documentId] },
    },
  });

  const meta = {
    title: 'MOCK iNZight Analytics',
    description: 'Temporary metadata for the Strapi trial.',
    image: social.id,
  };

  await documents(strapi, 'api::general.general').create({
    data: {
      logo: logo.id,
      mainMenu: [
        {
          label: 'About',
          location: '/about',
          tereo: 'Mō mātou',
          submenu: [{ label: 'Team', location: '/about#team' }],
        },
        { label: 'Projects', location: '/projects' },
        { label: 'News', location: '/news' },
      ],
      footerMenu: [{ label: 'Contact', location: '/contact' }],
      socialLinks: [{ url: 'https://example.com/mock-social' }],
      metadata: meta,
    },
  });

  const heroItem = (label: string) => note(`MOCK ${label}. Placeholder hero copy.`);
  await documents(strapi, 'api::home-hero.home-hero').create({
    data: {
      titleGroup: { title: 'MOCK analytics that make a difference' },
      heroGroup: {
        heroTitle: 'MOCK we help people tell stories with data',
        heroDescription: note('Temporary hero description for the Strapi trial.'),
        heroItems: {
          heroDataVisualisation: heroItem('data visualisation'),
          heroDataDesign: heroItem('data design'),
          heroDataCollection: heroItem('data collection'),
          heroDataAnalysis: heroItem('data analysis'),
          heroTraining: heroItem('training'),
          heroDataSovereignty: heroItem('data sovereignty'),
        },
      },
      metaTitle: 'MOCK iNZight Analytics Ltd',
      metaDescription: 'Temporary homepage description. Not the live site.',
    },
  });

  await documents(strapi, 'api::home-projects.home-projects').create({
    data: {
      projectsTitle: 'MOCK we do data differently',
      projectsDescription: note('Temporary homepage projects introduction.'),
      featuredApps: { connect: [tide.documentId] },
      featuredProjects: { connect: [harbour.documentId, survey.documentId] },
      cards: [
        { label: 'MOCK case study', linkText: 'Read the mock', linkUrl: '/projects/mock-harbour-light' },
        { label: 'MOCK survey', linkText: 'See the mock', linkUrl: '/projects/mock-school-survey' },
      ],
    },
  });

  await documents(strapi, 'api::home-team.home-team').create({
    data: {
      teamTitle: 'MOCK our team',
      teamDescription: note('Temporary team introduction.'),
      buttonText: 'Meet the mock team',
      image: portrait.id,
    },
  });

  await documents(strapi, 'api::home-collaborators.home-collaborators').create({
    data: {
      title: "MOCK we've worked with ...",
      description: note('Temporary collaborators introduction.'),
      feature: {
        title: 'MOCK Horizon Europe',
        description: note('Placeholder featured collaboration.'),
        buttonText: 'MOCK details',
        buttonURL: '/horizon-europe',
      },
      collaborators: [
        {
          name: 'MOCK Aotearoa Partner',
          url: 'https://example.com/mock-aotearoa',
          type: 'Aotearoa',
          image: mark.id,
        },
        {
          name: 'MOCK International Partner',
          url: 'https://example.com/mock-international',
          type: 'International',
          image: mark.id,
        },
      ],
    },
  });

  await documents(strapi, 'api::home-apps.home-apps').create({
    data: {
      apps: [
        {
          title: 'MOCK Tide Chart',
          url: 'https://example.com/mock-tide-chart',
          logo: appLogo.id,
        },
      ],
    },
  });

  await documents(strapi, 'api::home-news.home-news').create({
    data: {
      teamTitle: 'MOCK latest news',
      card: {
        label: 'MOCK newsletter',
        linkText: 'Read the mock',
        linkUrl: '/news/mock-workshop-notes',
      },
    },
  });

  await documents(strapi, 'api::about.about').create({
    data: {
      heading: blocks('MOCK about', 'Temporary about-page heading.'),
      purpose: {
        heading: 'MOCK purpose',
        description: note('Temporary purpose copy.'),
      },
      pillars: [
        {
          heading: 'MOCK visualisation',
          description: note('Temporary pillar.'),
          image: banner.id,
          url: '/keywords/mock-visualisation',
        },
      ],
      team: {
        heading: 'MOCK team',
        description: note('Temporary about-page team copy.'),
      },
      metadata: meta,
    },
  });

  await documents(strapi, 'api::projects-page.projects-page').create({
    data: {
      heading: blocks('MOCK projects', 'Temporary projects-page heading.'),
      metadata: meta,
      workstreams: { connect: [visualisation.documentId, sovereignty.documentId] },
    },
  });

  await documents(strapi, 'api::news-page.news-page').create({
    data: {
      heading: blocks('MOCK news', 'Temporary news-page heading.'),
      metadata: meta,
    },
  });

  await documents(strapi, 'api::apps-page.apps-page').create({
    data: {
      heading: 'MOCK apps',
      description: note('Temporary apps-page description.'),
      metadata: meta,
    },
  });

  strapi.log.info('Seeded mock Strapi content.');
}

export async function bootstrapTrial(strapi: Core.Strapi) {
  await ensureAdmin(strapi);
  await grantPublicRead(strapi);
  await seedContent(strapi);
}
