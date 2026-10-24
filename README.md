# cars

Лендинг «Ранг Авто» — импорт автомобилей из Китая, Кореи и Японии.

```bash
npm install
npm run dev   # http://localhost:3000
```

Контент и заглушки — `src/data/content.ts`, контакты — `src/data/site.ts`.
Ветки и деплой:
- `main` — разработка.
- `production` — боевой сайт https://rangauto.ru (`.github/workflows/deploy.yml`):
  сборка standalone-сервера → rsync на сервер → переключение симлинка `current` → перезапуск systemd.
  Выкатить: `git push origin main:production` (или merge main → production).

Сервер: Ubuntu, Caddy (HTTPS, автосертификаты Let's Encrypt, www → без www) → Node на 127.0.0.1:3000,
сервис `rangauto`, релизы в `/srv/rangauto/releases`, логи заявок: `journalctl -u rangauto`.
