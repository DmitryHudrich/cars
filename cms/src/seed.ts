import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';

type Seed = Record<string, any>;

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

export async function importSeed(strapi: Core.Strapi) {
  const dir = path.resolve(process.cwd(), 'seed');
  const file = path.join(dir, 'data.json');
  if (!fs.existsSync(file)) return;

  const existing = await strapi.documents('api::site-setting.site-setting').findFirst();
  if (existing) return;

  strapi.log.info('Импорт стартового контента сайта…');
  const seed: Seed = JSON.parse(fs.readFileSync(file, 'utf8'));
  const uploaded = new Map<string, number>();

  const media = async (name: string) => {
    if (uploaded.has(name)) return uploaded.get(name);
    const filepath = path.join(dir, 'images', name);
    const [result] = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: { fileInfo: { name, alternativeText: '' } },
        files: {
          filepath,
          originalFilename: name,
          mimetype: MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream',
          size: fs.statSync(filepath).size,
        },
      });
    uploaded.set(name, result.id);
    return result.id as number;
  };

  const create = async (uid: string, data: Record<string, unknown>, publish = true) => {
    const doc = await strapi.documents(uid as any).create({ data: data as any });
    if (publish) await strapi.documents(uid as any).publish({ documentId: doc.documentId });
    return doc;
  };

  await create('api::site-setting.site-setting', seed.settings, false);

  for (const s of seed.workSteps) await create('api::work-step.work-step', s);
  for (const r of seed.reasons) await create('api::reason.reason', r);
  for (const p of seed.promos) await create('api::promo.promo', { ...p, image: await media(p.image) });
  for (const d of seed.directions) await create('api::direction.direction', { ...d, tabImage: await media(d.tabImage) });
  for (const r of seed.reviews) await create('api::review.review', { ...r, photo: await media(r.photo) });
  for (const p of seed.partners) await create('api::partner.partner', { ...p, logo: await media(p.logo) });
  for (const c of seed.cars) await create('api::car.car', { ...c, image: await media(c.image) });
  for (const a of seed.articles) await create('api::article.article', { ...a, cover: await media(a.cover) });

  const categories = new Map<string, string>();
  for (const c of seed.faqCategories) {
    const doc = await create('api::faq-category.faq-category', c, false);
    categories.set(c.key, doc.documentId);
  }
  for (const f of seed.faqItems) {
    await create('api::faq-item.faq-item', { ...f, category: categories.get(f.category) });
  }

  strapi.log.info('Стартовый контент импортирован');
}
