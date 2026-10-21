import type { Core } from '@strapi/strapi';
import { importSeed } from './seed';

const PUBLIC_ACTIONS = ['find', 'findOne'];

async function allowPublicRead(strapi: Core.Strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!role) return;
  const uids = Object.keys(strapi.contentTypes).filter((uid) => uid.startsWith('api::'));
  for (const uid of uids) {
    for (const action of PUBLIC_ACTIONS) {
      const name = `${uid}.${action}`;
      const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({ where: { action: name, role: role.id } });
      if (!exists) {
        await strapi.db.query('plugin::users-permissions.permission').create({ data: { action: name, role: role.id } });
      }
    }
  }
}

async function ensureAdmin(strapi: Core.Strapi) {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) return;
  if (await strapi.service('admin::user').exists()) return;
  const role = await strapi.service('admin::role').getSuperAdmin();
  await strapi.service('admin::user').create({
    email,
    password,
    firstname: 'Администратор',
    lastname: 'Ранг Авто',
    isActive: true,
    roles: [role.id],
  });
  strapi.log.info(`Создан администратор ${email}`);
}

function notifySiteOnChanges(strapi: Core.Strapi) {
  const url = process.env.SITE_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return () => {};

  let timer: NodeJS.Timeout | undefined;
  const notify = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fetch(url, { method: 'POST', headers: { 'x-revalidate-secret': secret } }).catch((error) =>
        strapi.log.warn(`Не удалось обновить сайт: ${error}`),
      );
    }, 500);
  };

  strapi.db.lifecycles.subscribe((event) => {
    const uid = event.model.uid;
    const tracked = uid.startsWith('api::') || uid === 'plugin::upload.file';
    if (tracked && /^after(Create|Update|Delete)/.test(event.action)) notify();
  });

  return notify;
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureAdmin(strapi);
    await allowPublicRead(strapi);
    await importSeed(strapi);
    notifySiteOnChanges(strapi)();
  },
};
