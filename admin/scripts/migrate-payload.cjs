/**
 * Copy the Payload Postgres database into this local Strapi app.
 * Run inside the Strapi container:
 *   PAYLOAD_DATABASE_URI=... node scripts/migrate-payload.mjs
 *
 * Media bytes are downloaded from the public Payload file API, because the
 * database stores filenames and the files themselves live on that server.
 */
const { compileStrapi, createStrapi } = require('@strapi/strapi');
const { randomBytes } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const pg = require('pg');
const sharp = require('sharp');

const FILE_ORIGIN = 'https://admin.inzight.co.nz';
const UPLOAD_ROOT = '/opt/app/public';

const CROPS = {
  thumbnail: { width: 400, height: 300 },
  card: { width: 768, height: 1024 },
  square: { width: 1024, height: 1024 },
  tablet: { width: 1024, height: null },
};

function day(value) {
  if (!value) return null;
  const iso = value instanceof Date ? value.toISOString() : String(value);
  return iso.slice(0, 10);
}

function textNode(node) {
  const format = Number(node?.format) || 0;
  const text = { type: 'text', text: node?.text ?? '' };
  if (format & 1) text.bold = true;
  if (format & 2) text.italic = true;
  if (format & 4) text.strikethrough = true;
  if (format & 8) text.underline = true;
  if (format & 16) text.code = true;
  return text;
}

function linkUrl(node, slugs) {
  const fields = node.fields ?? {};
  if (fields.linkType === 'internal' && fields.doc) {
    const raw = fields.doc.value;
    const id = typeof raw === 'object' && raw ? raw.id : raw;
    const slug = slugs[fields.doc.relationTo]?.get(Number(id));
    if (slug) {
      switch (fields.doc.relationTo) {
        case 'projects':
          return `/projects/${slug}`;
        case 'news':
          return `/news/${slug}`;
        case 'team':
          return `/team/${slug}`;
        case 'keywords':
          return slug === 'horizon-europe' ? '/horizon-europe' : `/keywords/${slug}`;
        case 'apps':
          return `/apps#${slug}`;
        default:
          break;
      }
    }
  }
  return fields.url || null;
}

function inlineChildren(children, slugs) {
  const out = [];
  for (const child of children ?? []) {
    if (!child || typeof child !== 'object') continue;
    if (child.type === 'linebreak') {
      out.push({ type: 'text', text: '\n' });
      continue;
    }
    if (child.type === 'link' || child.type === 'autolink') {
      const url = linkUrl(child, slugs);
      const nested = (child.children ?? []).filter((item) => item?.type === 'text').map(textNode);
      if (!url) {
        out.push(...(nested.length ? nested : [{ type: 'text', text: '' }]));
        continue;
      }
      out.push({
        type: 'link',
        url,
        children: nested.length ? nested : [{ type: 'text', text: url }],
      });
      continue;
    }
    if (child.type === 'text') out.push(textNode(child));
  }
  if (out.length === 0) out.push({ type: 'text', text: '' });
  return out;
}

function asRichText(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
}

function lexicalToBlocks(data, slugs) {
  const doc = asRichText(data);
  const children = doc?.root?.children;
  if (!Array.isArray(children) || children.length === 0) {
    return [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }];
  }
  const blocks = [];
  for (const node of children) {
    if (!node || typeof node !== 'object') continue;
    if (node.type === 'paragraph') {
      blocks.push({ type: 'paragraph', children: inlineChildren(node.children, slugs) });
    } else if (node.type === 'heading') {
      const level = Number(String(node.tag || 'h2').replace(/\D/g, '')) || 2;
      blocks.push({
        type: 'heading',
        level: Math.min(6, Math.max(1, level)),
        children: inlineChildren(node.children, slugs),
      });
    } else if (node.type === 'horizontalrule') {
      blocks.push({ type: 'code', language: 'hr', children: [{ type: 'text', text: '' }] });
    } else if (node.type === 'quote') {
      blocks.push({ type: 'quote', children: inlineChildren(node.children, slugs) });
    } else if (node.type === 'list') {
      const items = (node.children ?? []).filter((item) => item?.type === 'listitem' || item?.type === 'list-item');
      if (items.length === 0) continue;
      blocks.push({
        type: 'list',
        format: node.listType === 'number' ? 'ordered' : 'unordered',
        children: items.map((item) => ({
          type: 'list-item',
          children: inlineChildren(item.children, slugs),
        })),
      });
    }
  }
  if (blocks.length === 0) {
    blocks.push({ type: 'paragraph', children: [{ type: 'text', text: '' }] });
  }
  return blocks;
}

function blocksOrNull(data, slugs) {
  if (!data) return null;
  return lexicalToBlocks(data, slugs);
}

function connect(ids, lookup) {
  const documentIds = ids.map((id) => lookup.get(Number(id))).filter(Boolean);
  if (documentIds.length === 0) return undefined;
  return { connect: documentIds };
}

function fileCandidates(collection, row) {
  const canonical = `${FILE_ORIGIN}/api/${collection}/file/${encodeURIComponent(row.filename)}`;
  const stored = typeof row.url === 'string' && row.url.startsWith('https://') ? row.url : null;
  return [...new Set([canonical, stored].filter(Boolean))];
}

async function download(urls) {
  let last = 'no url';
  for (const url of urls) {
    const response = await fetch(url);
    if (!response.ok) {
      last = `${response.status} ${url}`;
      continue;
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get('content-type')?.split(';')[0] || 'application/octet-stream';
    return { bytes, type };
  }
  throw new Error(`Download failed (${last})`);
}

async function uploadFile(strapi, row, collection) {
  const { bytes, type } = await download(fileCandidates(collection, row));
  const filename = row.filename || `file-${row.id}`;
  const filepath = path.join('/tmp', `${row.id}-${filename}`.replaceAll('/', '-'));
  await fs.writeFile(filepath, bytes);
  const upload = strapi.plugin('upload').service('upload');
  const mime = row.mime_type || type;
  const uploaded = await upload.upload({
    data: {
      fileInfo: {
        name: filename,
        alternativeText: row.alt || row.title || undefined,
        caption: row.description || undefined,
        focalPoint:
          row.focal_x != null && row.focal_y != null
            ? { x: Number(row.focal_x), y: Number(row.focal_y) }
            : undefined,
      },
    },
    files: {
      filepath,
      originalFilename: filename,
      mimetype: mime,
      size: bytes.length,
    },
  });
  await fs.rm(filepath, { force: true });
  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  if (mime.startsWith('image/') && mime !== 'image/svg+xml') {
    await recrop(strapi, file);
  }
  return file;
}

async function recrop(strapi, file) {
  if (!file?.url || !file.formats) return;
  const source = path.join(UPLOAD_ROOT, file.url);
  let meta;
  try {
    meta = await sharp(source).metadata();
  } catch {
    return;
  }
  const formats = { ...file.formats };
  for (const [name, spec] of Object.entries(CROPS)) {
    const format = formats[name];
    if (!format?.url) continue;
    const tooSmall = spec.height
      ? (meta.width ?? 0) <= spec.width && (meta.height ?? 0) <= spec.height
      : (meta.width ?? 0) <= spec.width;
    if (tooSmall) continue;
    const destination = path.join(UPLOAD_ROOT, format.url);
    const pipeline = sharp(source).resize(
      spec.height
        ? { width: spec.width, height: spec.height, fit: 'cover', position: 'centre' }
        : { width: spec.width },
    );
    const info = await pipeline.toFile(`${destination}.crop`);
    await fs.rename(`${destination}.crop`, destination);
    formats[name] = {
      ...format,
      width: info.width,
      height: info.height,
      size: Number((info.size / 1000).toFixed(2)),
      sizeInBytes: info.size,
    };
  }
  await strapi.db.query('plugin::upload.file').update({
    where: { id: file.id },
    data: { formats },
  });
}

async function wipe(strapi) {
  const uids = [
    'api::news-item.news-item',
    'api::project.project',
    'api::app.app',
    'api::team-member.team-member',
    'api::keyword.keyword',
    'api::general.general',
    'api::home-hero.home-hero',
    'api::home-projects.home-projects',
    'api::home-team.home-team',
    'api::home-collaborators.home-collaborators',
    'api::home-apps.home-apps',
    'api::home-news.home-news',
    'api::about.about',
    'api::projects-page.projects-page',
    'api::news-page.news-page',
    'api::apps-page.apps-page',
  ];
  for (const uid of uids) {
    const seen = new Set();
    for (const status of ['draft', 'published']) {
      const docs = await strapi.documents(uid).findMany({ status, limit: 200 });
      for (const doc of docs) {
        if (seen.has(doc.documentId)) continue;
        seen.add(doc.documentId);
        await strapi.documents(uid).delete({ documentId: doc.documentId });
      }
    }
  }
  const files = await strapi.db.query('plugin::upload.file').findMany({ limit: 500 });
  const upload = strapi.plugin('upload').service('upload');
  for (const file of files) {
    await upload.remove(file);
  }
  console.log(`Removed existing content and ${files.length} files`);
}

function groupBy(rows, key) {
  const map = new Map();
  for (const row of rows) {
    const id = row[key];
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(row);
  }
  return map;
}

function relIds(map, parentId, pathName) {
  return (map.get(`${parentId}:${pathName}`) ?? []).map(Number);
}

async function loadRels(payload, table, column) {
  const { rows } = await payload.query(
    `SELECT parent_id, path, ${column} AS ref FROM ${table} WHERE ${column} IS NOT NULL ORDER BY parent_id, "order"`,
  );
  const map = new Map();
  for (const row of rows) {
    const key = `${row.parent_id}:${row.path}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row.ref);
  }
  return map;
}

function linkGroups(groups, links) {
  return groups.map((group) => ({
    label: group.label || undefined,
    featured: Boolean(group.featured),
    groupLinks: (links.get(group.id) ?? []).map((link) => ({
      link: link.link,
      description: link.description || undefined,
    })),
  })).filter((group) => group.groupLinks.length > 0);
}

async function createDoc(strapi, uid, data, status) {
  try {
    return await strapi.documents(uid).create({
      data,
      ...(status ? { status } : {}),
    });
  } catch (error) {
    const detail = error?.details?.errors ?? error?.message ?? error;
    throw new Error(`${uid} ${data.slug || data.title || ''}: ${JSON.stringify(detail)}`);
  }
}

async function ensureToken(strapi) {
  const name = 'Local site';
  const existing = await strapi.db.query('admin::api-token').findMany({ where: { name } });
  for (const token of existing) {
    await strapi.db.query('admin::api-token').delete({ where: { id: token.id } });
  }
  const created = await strapi.service('admin::api-token').create({
    name,
    description: 'Local Astro reads, including draft preview',
    type: 'full-access',
    lifespan: null,
  });
  return created.accessKey;
}

async function writeEnv(key, value) {
  const file = '/opt/app/.env';
  const current = await fs.readFile(file, 'utf8');
  const lines = current
    .split('\n')
    .filter((line) => line && !line.startsWith(`${key}=`));
  lines.push(`${key}=${value}`);
  await fs.writeFile(file, `${lines.join('\n')}\n`);
}

async function updateSlug(strapi, uid, slug, data, statuses) {
  const doc = await strapi.documents(uid).findFirst({ filters: { slug } });
  if (!doc) throw new Error(`Missing ${uid} ${slug}`);
  const targets = statuses ?? [undefined];
  for (const status of targets) {
    await strapi.documents(uid).update({
      documentId: doc.documentId,
      data,
      ...(status ? { status } : {}),
    });
  }
}

async function updateSingle(strapi, uid, data) {
  const doc = await strapi.documents(uid).findFirst();
  if (!doc) throw new Error(`Missing ${uid}`);
  await strapi.documents(uid).update({ documentId: doc.documentId, data });
}

async function repairText(strapi, payload) {
  const slugs = { projects: new Map(), news: new Map(), team: new Map(), keywords: new Map(), apps: new Map() };
  for (const [key, table] of [
    ['projects', 'projects'],
    ['news', 'news'],
    ['team', 'team'],
    ['keywords', 'keywords'],
    ['apps', 'apps'],
  ]) {
    const { rows } = await payload.query(`SELECT id, slug FROM ${table}`);
    for (const row of rows) slugs[key].set(Number(row.id), row.slug);
  }

  const { rows: keywordRows } = await payload.query('SELECT id, slug, description FROM keywords');
  for (const row of keywordRows) {
    await updateSlug(strapi, 'api::keyword.keyword', row.slug, {
      description: blocksOrNull(row.description, slugs) || undefined,
    });
  }
  const { rows: teamRows } = await payload.query('SELECT slug, bio FROM team');
  for (const row of teamRows) {
    await updateSlug(strapi, 'api::team-member.team-member', row.slug, {
      bio: lexicalToBlocks(row.bio, slugs),
    });
  }
  const { rows: appRows } = await payload.query('SELECT slug, content FROM apps');
  for (const row of appRows) {
    await updateSlug(strapi, 'api::app.app', row.slug, {
      content: lexicalToBlocks(row.content, slugs),
    });
  }
  const { rows: projectRows } = await payload.query('SELECT slug, content FROM projects');
  for (const row of projectRows) {
    await updateSlug(strapi, 'api::project.project', row.slug, {
      content: lexicalToBlocks(row.content, slugs),
    });
  }
  const { rows: newsRows } = await payload.query(`SELECT slug, content FROM news WHERE _status = 'published'`);
  for (const row of newsRows) {
    await updateSlug(
      strapi,
      'api::news-item.news-item',
      row.slug,
      { content: lexicalToBlocks(row.content, slugs) },
      ['draft', 'published'],
    );
  }

  const { rows: heroRows } = await payload.query('SELECT * FROM home_hero');
  const hero = heroRows[0];
  await updateSingle(strapi, 'api::home-hero.home-hero', {
    heroGroup: {
      heroTitle: hero.hero_group_hero_title,
      heroDescription: lexicalToBlocks(hero.hero_group_hero_description, slugs),
      heroItems: {
        heroDataDesign: lexicalToBlocks(hero.hero_group_hero_items_hero_data_design, slugs),
        heroDataCollection: lexicalToBlocks(hero.hero_group_hero_items_hero_data_collection, slugs),
        heroDataAnalysis: lexicalToBlocks(hero.hero_group_hero_items_hero_data_analysis, slugs),
        heroDataVisualisation: lexicalToBlocks(hero.hero_group_hero_items_hero_data_visualisation, slugs),
        heroTraining: lexicalToBlocks(hero.hero_group_hero_items_hero_training, slugs),
        heroDataSovereignty: lexicalToBlocks(hero.hero_group_hero_items_hero_data_sovereignty, slugs),
      },
    },
  });

  const { rows: homeProjectRows } = await payload.query('SELECT * FROM home_projects');
  await updateSingle(strapi, 'api::home-projects.home-projects', {
    projectsDescription: blocksOrNull(homeProjectRows[0].projects_description, slugs) || undefined,
  });
  const { rows: homeTeamRows } = await payload.query('SELECT * FROM home_team');
  await updateSingle(strapi, 'api::home-team.home-team', {
    teamDescription: lexicalToBlocks(homeTeamRows[0].team_description, slugs),
  });
  const { rows: collabRows } = await payload.query('SELECT * FROM home_collaborators');
  const collab = collabRows[0];
  await updateSingle(strapi, 'api::home-collaborators.home-collaborators', {
    description: lexicalToBlocks(collab.description, slugs),
    feature: {
      title: collab.feature_title || undefined,
      description: blocksOrNull(collab.feature_description, slugs) || undefined,
      buttonText: collab.feature_button_text || undefined,
      buttonURL: collab.feature_button_u_r_l || undefined,
    },
  });

  const { rows: pillarRows } = await payload.query('SELECT * FROM about_pillars ORDER BY _order');
  const { rows: aboutRows } = await payload.query('SELECT * FROM about');
  const about = aboutRows[0];
  const aboutDoc = await strapi.documents('api::about.about').findFirst({
    populate: { pillars: { populate: { image: true } } },
  });
  await updateSingle(strapi, 'api::about.about', {
    heading: lexicalToBlocks(about.heading, slugs),
    purpose: {
      heading: about.purpose_heading,
      description: lexicalToBlocks(about.purpose_description, slugs),
    },
    pillars: pillarRows.map((pillar, index) => ({
      heading: pillar.heading,
      description: lexicalToBlocks(pillar.description, slugs),
      image: aboutDoc?.pillars?.[index]?.image?.id,
      url: pillar.url,
    })),
    team: {
      heading: about.team_heading,
      description: lexicalToBlocks(about.team_description, slugs),
    },
  });

  const { rows: projectsPageRows } = await payload.query('SELECT * FROM projects_page');
  await updateSingle(strapi, 'api::projects-page.projects-page', {
    heading: lexicalToBlocks(projectsPageRows[0].heading, slugs),
  });
  const { rows: appsPageRows } = await payload.query('SELECT * FROM apps_page');
  await updateSingle(strapi, 'api::apps-page.apps-page', {
    description: lexicalToBlocks(appsPageRows[0].description, slugs),
  });
  console.log('Updated rich text on collections and pages');
}

async function main() {
  const connectionString = process.env.PAYLOAD_DATABASE_URI;
  if (!connectionString) throw new Error('PAYLOAD_DATABASE_URI is required');

  const payload = new pg.Client({ connectionString });
  await payload.connect();
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  try {
    if (process.env.REPAIR_TEXT === '1') {
      await repairText(strapi, payload);
      console.log('Rich text repaired');
      return;
    }
    await wipe(strapi);

    const slugs = {
      projects: new Map(),
      news: new Map(),
      team: new Map(),
      keywords: new Map(),
      apps: new Map(),
    };
    for (const [key, table] of [
      ['projects', 'projects'],
      ['news', 'news'],
      ['team', 'team'],
      ['keywords', 'keywords'],
      ['apps', 'apps'],
    ]) {
      const { rows } = await payload.query(`SELECT id, slug FROM ${table}`);
      for (const row of rows) slugs[key].set(Number(row.id), row.slug);
    }

    const images = new Map();
    const { rows: imageRows } = await payload.query('SELECT * FROM images ORDER BY id');
    for (const row of imageRows) {
      const file = await uploadFile(strapi, row, 'images');
      images.set(Number(row.id), file.id);
      console.log(`image ${row.id} ${row.filename}`);
    }
    const documents = new Map();
    const { rows: documentRows } = await payload.query('SELECT * FROM documents ORDER BY id');
    for (const row of documentRows) {
      const file = await uploadFile(strapi, row, 'documents');
      documents.set(Number(row.id), file.id);
      console.log(`document ${row.id} ${row.filename}`);
    }

    const media = (id) => (id == null ? undefined : images.get(Number(id)));

    const keywordRels = await loadRels(payload, 'team_rels', 'keywords_id');
    const appRels = await loadRels(payload, 'apps_rels', 'keywords_id');
    const projectKeywordRels = await loadRels(payload, 'projects_rels', 'keywords_id');
    const projectTeamRels = await loadRels(payload, 'projects_rels', 'team_id');
    const projectFileRels = await loadRels(payload, 'projects_rels', 'documents_id');
    const newsKeywordRels = await loadRels(payload, 'news_rels', 'keywords_id');
    const newsTeamRels = await loadRels(payload, 'news_rels', 'team_id');
    const newsGalleryRels = await loadRels(payload, 'news_rels', 'images_id');
    const homeProjectRels = await loadRels(payload, 'home_projects_rels', 'projects_id');
    const homeAppRels = await loadRels(payload, 'home_projects_rels', 'apps_id');
    const workstreamRels = await loadRels(payload, 'projects_page_rels', 'keywords_id');

    const keywords = new Map();
    const { rows: keywordRows } = await payload.query('SELECT * FROM keywords ORDER BY id');
    const { rows: keywordGroupRows } = await payload.query(
      'SELECT * FROM keywords_link_groups ORDER BY _parent_id, _order',
    );
    const { rows: keywordLinkRows } = await payload.query(
      'SELECT * FROM keywords_link_groups_group_links ORDER BY _parent_id, _order',
    );
    const keywordLinks = groupBy(keywordLinkRows, '_parent_id');
    const keywordGroups = groupBy(keywordGroupRows, '_parent_id');
    for (const row of keywordRows) {
      const doc = await createDoc(strapi, 'api::keyword.keyword', {
        title: row.title,
        slug: row.slug,
        heading: row.heading || undefined,
        description: blocksOrNull(row.description, slugs) || undefined,
        linkGroups: linkGroups(keywordGroups.get(row.id) ?? [], keywordLinks),
      });
      keywords.set(Number(row.id), doc.documentId);
    }
    console.log(`keywords ${keywords.size}`);

    const { rows: socialRows } = await payload.query(
      'SELECT * FROM team_social_media ORDER BY _parent_id, _order',
    );
    const socials = groupBy(socialRows, '_parent_id');
    const team = new Map();
    const { rows: teamRows } = await payload.query('SELECT * FROM team ORDER BY id');
    for (const row of teamRows) {
      const doc = await createDoc(strapi, 'api::team-member.team-member', {
        fullname: row.fullname,
        name: {
          title: row.name_title || undefined,
          first: row.name_first,
          last: row.name_last,
        },
        order: Number(row.order ?? 10),
        slug: row.slug,
        role: row.role,
        email: row.email || undefined,
        iwi: row.iwi || undefined,
        bio: lexicalToBlocks(row.bio, slugs),
        photo: media(row.photo_id),
        socialMedia: (socials.get(row.id) ?? [])
          .filter((item) => item.url || item.name)
          .map((item) => ({ url: item.url || undefined, name: item.name || undefined })),
        keywords: connect(relIds(keywordRels, row.id, 'keywords'), keywords),
      });
      team.set(Number(row.id), doc.documentId);
    }
    console.log(`team ${team.size}`);

    const apps = new Map();
    const { rows: appRows } = await payload.query('SELECT * FROM apps ORDER BY id');
    for (const row of appRows) {
      const doc = await createDoc(strapi, 'api::app.app', {
        title: row.title,
        slug: row.slug,
        content: lexicalToBlocks(row.content, slugs),
        banner: media(row.banner_id),
        logo: media(row.logo_id),
        link: row.link,
        keywords: connect(relIds(appRels, row.id, 'keywords'), keywords),
      });
      apps.set(Number(row.id), doc.documentId);
    }
    console.log(`apps ${apps.size}`);

    const { rows: contributorRows } = await payload.query(
      'SELECT * FROM projects_blocks_contributor ORDER BY _parent_id, _order',
    );
    const contributors = groupBy(contributorRows, '_parent_id');
    const { rows: projectGroupRows } = await payload.query(
      'SELECT * FROM projects_link_groups ORDER BY _parent_id, _order',
    );
    const { rows: projectLinkRows } = await payload.query(
      'SELECT * FROM projects_link_groups_group_links ORDER BY _parent_id, _order',
    );
    const projectLinks = groupBy(projectLinkRows, '_parent_id');
    const projectGroups = groupBy(projectGroupRows, '_parent_id');
    const projects = new Map();
    const { rows: projectRows } = await payload.query('SELECT * FROM projects ORDER BY id');
    for (const row of projectRows) {
      const files = relIds(projectFileRels, row.id, 'files')
        .map((id) => documents.get(id))
        .filter(Boolean);
      const doc = await createDoc(strapi, 'api::project.project', {
        title: row.title,
        slug: row.slug,
        startDate: day(row.start_date) || undefined,
        endDate: day(row.end_date) || undefined,
        content: lexicalToBlocks(row.content, slugs),
        priority: Number(row.priority ?? 0),
        banner: media(row.banner_id),
        linkGroups: linkGroups(projectGroups.get(row.id) ?? [], projectLinks),
        files: files.length ? files : undefined,
        keywords: connect(relIds(projectKeywordRels, row.id, 'keywords'), keywords),
        team: connect(relIds(projectTeamRels, row.id, 'team'), team),
        team2: (contributors.get(row.id) ?? []).map((block) => ({
          contributorType: block.contributor_type,
          teamMember:
            block.contributor_type === 'teamMember'
              ? connect([block.team_member_id], team)
              : undefined,
          name: block.contributor_type === 'nameAndUrl' ? block.name : undefined,
          url: block.contributor_type === 'nameAndUrl' ? block.url : undefined,
          role: block.role,
        })),
      });
      projects.set(Number(row.id), doc.documentId);
    }
    console.log(`projects ${projects.size}`);

    const { rows: newsLinkRows } = await payload.query(
      'SELECT * FROM news_link ORDER BY _parent_id, _order',
    );
    const newsLinks = groupBy(newsLinkRows, '_parent_id');
    const { rows: newsRows } = await payload.query(
      `SELECT * FROM news WHERE _status = 'published' ORDER BY id`,
    );
    for (const row of newsRows) {
      const gallery = relIds(newsGalleryRels, row.id, 'gallery')
        .map((id) => images.get(id))
        .filter(Boolean);
      const link = (newsLinks.get(row.id) ?? []).find((item) => item.label && item.url);
      const data = {
        title: row.title,
        slug: row.slug,
        date: day(row.date),
        content: lexicalToBlocks(row.content, slugs),
        newstype: row.newstype || 'Publication',
        keywords: connect(relIds(newsKeywordRels, row.id, 'keywords'), keywords),
        team: connect(relIds(newsTeamRels, row.id, 'team'), team),
      };
      if (link) data.link = { label: link.label, url: link.url };
      if (gallery.length) data.gallery = gallery;
      await createDoc(strapi, 'api::news-item.news-item', data, 'published');
    }
    console.log(`news ${newsRows.length}`);

    const { rows: menuRows } = await payload.query(
      'SELECT * FROM general_main_menu ORDER BY _order',
    );
    const { rows: submenuRows } = await payload.query(
      'SELECT * FROM general_main_menu_submenu ORDER BY _parent_id, _order',
    );
    const submenus = groupBy(submenuRows, '_parent_id');
    const { rows: footerRows } = await payload.query(
      'SELECT * FROM general_footer_menu ORDER BY _order',
    );
    const { rows: socialLinkRows } = await payload.query(
      'SELECT * FROM general_social_links ORDER BY _order',
    );
    const { rows: generalRows } = await payload.query('SELECT * FROM general');
    const general = generalRows[0];
    await createDoc(strapi, 'api::general.general', {
      logo: media(general.logo_id),
      mainMenu: menuRows.map((item) => ({
        label: item.label,
        location: item.location,
        tereo: item.tereo || undefined,
        submenu: (submenus.get(item.id) ?? []).map((sub) => ({
          label: sub.label,
          location: sub.location,
        })),
      })),
      footerMenu: footerRows.map((item) => ({ label: item.label, location: item.location })),
      socialLinks: socialLinkRows.map((item) => ({ url: item.url })),
      metadata: {
        title: general.metadata_title || undefined,
        description: general.metadata_description || undefined,
        image: media(general.metadata_image_id),
      },
    });

    const { rows: heroRows } = await payload.query('SELECT * FROM home_hero');
    const hero = heroRows[0];
    const heroItem = (value) => lexicalToBlocks(value, slugs);
    await createDoc(strapi, 'api::home-hero.home-hero', {
      titleGroup: { title: hero.title_group_title },
      heroGroup: {
        heroTitle: hero.hero_group_hero_title,
        heroDescription: lexicalToBlocks(hero.hero_group_hero_description, slugs),
        heroItems: {
          heroDataDesign: heroItem(hero.hero_group_hero_items_hero_data_design),
          heroDataCollection: heroItem(hero.hero_group_hero_items_hero_data_collection),
          heroDataAnalysis: heroItem(hero.hero_group_hero_items_hero_data_analysis),
          heroDataVisualisation: heroItem(hero.hero_group_hero_items_hero_data_visualisation),
          heroTraining: heroItem(hero.hero_group_hero_items_hero_training),
          heroDataSovereignty: heroItem(hero.hero_group_hero_items_hero_data_sovereignty),
        },
      },
      metaTitle: hero.meta_title,
      metaDescription: hero.meta_description,
    });

    const { rows: cardRows } = await payload.query(
      'SELECT * FROM home_projects_cards ORDER BY _order',
    );
    const { rows: homeProjectRows } = await payload.query('SELECT * FROM home_projects');
    const homeProjects = homeProjectRows[0];
    await createDoc(strapi, 'api::home-projects.home-projects', {
      projectsTitle: homeProjects.projects_title || undefined,
      projectsDescription: blocksOrNull(homeProjects.projects_description, slugs) || undefined,
      featuredApps: connect(relIds(homeAppRels, homeProjects.id, 'featuredApps'), apps),
      featuredProjects: connect(relIds(homeProjectRels, homeProjects.id, 'featuredProjects'), projects),
      cards: cardRows.map((card) => ({
        label: card.label || undefined,
        linkText: card.link_text || undefined,
        linkUrl: card.link_url || undefined,
      })),
    });

    const { rows: homeTeamRows } = await payload.query('SELECT * FROM home_team');
    const homeTeam = homeTeamRows[0];
    await createDoc(strapi, 'api::home-team.home-team', {
      teamTitle: homeTeam.team_title,
      teamDescription: lexicalToBlocks(homeTeam.team_description, slugs),
      buttonText: homeTeam.button_text,
      image: media(homeTeam.image_id),
    });

    const { rows: collabRows } = await payload.query(
      'SELECT * FROM home_collaborators_collaborators ORDER BY _order',
    );
    const { rows: collabPageRows } = await payload.query('SELECT * FROM home_collaborators');
    const collab = collabPageRows[0];
    await createDoc(strapi, 'api::home-collaborators.home-collaborators', {
      title: collab.title,
      description: lexicalToBlocks(collab.description, slugs),
      feature: {
        title: collab.feature_title || undefined,
        description: blocksOrNull(collab.feature_description, slugs) || undefined,
        buttonText: collab.feature_button_text || undefined,
        buttonURL: collab.feature_button_u_r_l || undefined,
      },
      collaborators: collabRows.map((item) => ({
        name: item.name,
        url: item.url || undefined,
        type: item.type,
        image: media(item.image_id),
      })),
    });

    const { rows: homeAppRows } = await payload.query(
      'SELECT * FROM home_apps_apps ORDER BY _order',
    );
    await createDoc(strapi, 'api::home-apps.home-apps', {
      apps: homeAppRows.map((item) => ({
        title: item.title,
        url: item.url,
        logo: media(item.logo_id),
      })),
    });

    const { rows: homeNewsRows } = await payload.query('SELECT * FROM home_news');
    const homeNews = homeNewsRows[0];
    await createDoc(strapi, 'api::home-news.home-news', {
      teamTitle: homeNews.team_title,
      card: {
        label: homeNews.card_label || undefined,
        linkText: homeNews.card_link_text || undefined,
        linkUrl: homeNews.card_link_url || undefined,
      },
    });

    const { rows: pillarRows } = await payload.query(
      'SELECT * FROM about_pillars ORDER BY _order',
    );
    const { rows: aboutRows } = await payload.query('SELECT * FROM about');
    const about = aboutRows[0];
    await createDoc(strapi, 'api::about.about', {
      heading: lexicalToBlocks(about.heading, slugs),
      purpose: {
        heading: about.purpose_heading,
        description: lexicalToBlocks(about.purpose_description, slugs),
      },
      pillars: pillarRows.map((pillar) => ({
        heading: pillar.heading,
        description: lexicalToBlocks(pillar.description, slugs),
        image: media(pillar.image_id),
        url: pillar.url,
      })),
      team: {
        heading: about.team_heading,
        description: lexicalToBlocks(about.team_description, slugs),
      },
      metadata: {
        title: about.metadata_title || undefined,
        description: about.metadata_description || undefined,
        image: media(about.metadata_image_id),
      },
    });

    const { rows: projectsPageRows } = await payload.query('SELECT * FROM projects_page');
    const projectsPage = projectsPageRows[0];
    await createDoc(strapi, 'api::projects-page.projects-page', {
      heading: lexicalToBlocks(projectsPage.heading, slugs),
      metadata: {
        title: projectsPage.metadata_title || undefined,
        description: projectsPage.metadata_description || undefined,
        image: media(projectsPage.metadata_image_id),
      },
      workstreams: connect(relIds(workstreamRels, projectsPage.id, 'workstreams'), keywords),
    });

    const { rows: newsPageRows } = await payload.query('SELECT * FROM news_page');
    const newsPage = newsPageRows[0];
    if (newsPage) {
      await createDoc(strapi, 'api::news-page.news-page', {
        heading: newsPage.heading ? lexicalToBlocks(newsPage.heading, slugs) : undefined,
        metadata: {
          title: newsPage.metadata_title || undefined,
          description: newsPage.metadata_description || undefined,
          image: media(newsPage.metadata_image_id),
        },
      });
    } else {
      await createDoc(strapi, 'api::news-page.news-page', {
        heading: [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }],
      });
    }

    const { rows: appsPageRows } = await payload.query('SELECT * FROM apps_page');
    const appsPage = appsPageRows[0];
    await createDoc(strapi, 'api::apps-page.apps-page', {
      heading: appsPage.heading,
      description: lexicalToBlocks(appsPage.description, slugs),
      metadata: {
        title: appsPage.metadata_title || undefined,
        description: appsPage.metadata_description || undefined,
        image: media(appsPage.metadata_image_id),
      },
    });

    const accessKey = await ensureToken(strapi);
    const previewSecret = randomBytes(24).toString('hex');
    await writeEnv('CLIENT_URL', 'http://localhost:4321');
    await writeEnv('PREVIEW_SECRET', previewSecret);
    await writeEnv('STRAPI_API_TOKEN', accessKey);
    console.log('Migration finished');
  } finally {
    await payload.end();
    await strapi.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
