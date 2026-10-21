#!/usr/bin/env bash
set -euo pipefail

[ "$(id -u)" = 0 ] || { echo "Запустите от root"; exit 1; }

CMS=/srv/rangauto/cms
CMS_ENV=/etc/rangauto-cms.env
SITE_ENV=/etc/rangauto.env
CADDYFILE=/etc/caddy/Caddyfile
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@rangauto.ru}

if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "Подкачка 2 ГБ включена"
fi

install -d -o rangauto -g rangauto "$CMS" "$CMS/releases" "$CMS/data" "$CMS/uploads"

secret() { openssl rand -base64 32 | tr -d '\n'; }

if [ ! -f "$CMS_ENV" ]; then
  ADMIN_PASSWORD="$(openssl rand -base64 18 | tr -d '/+=\n')A1!"
  REVALIDATE_SECRET="$(openssl rand -hex 32)"
  cat > "$CMS_ENV" <<EOF
NODE_ENV=production
HOST=127.0.0.1
PORT=1337
PUBLIC_URL=https://rangauto.ru/cms
IS_PROXIED=true
ADMIN_COOKIE_PATH=/cms/admin
APP_KEYS=$(secret),$(secret)
API_TOKEN_SALT=$(secret)
ADMIN_JWT_SECRET=$(secret)
JWT_SECRET=$(secret)
TRANSFER_TOKEN_SALT=$(secret)
ENCRYPTION_KEY=$(secret)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=$CMS/data/data.db
SITE_REVALIDATE_URL=http://127.0.0.1:3000/api/revalidate
REVALIDATE_SECRET=$REVALIDATE_SECRET
INITIAL_ADMIN_EMAIL=$ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD=$ADMIN_PASSWORD
EOF
  chmod 600 "$CMS_ENV"
  umask 077
  printf 'Админка: https://rangauto.ru/cms/admin\nЛогин: %s\nПароль: %s\n' "$ADMIN_EMAIL" "$ADMIN_PASSWORD" > /root/rangauto-cms-admin.txt
  echo "Создан $CMS_ENV, доступ в админку сохранён в /root/rangauto-cms-admin.txt"
fi

REVALIDATE_SECRET="$(grep '^REVALIDATE_SECRET=' "$CMS_ENV" | cut -d= -f2-)"
touch "$SITE_ENV"
set_site_env() {
  if grep -q "^$1=" "$SITE_ENV"; then
    sed -i "s|^$1=.*|$1=$2|" "$SITE_ENV"
  else
    echo "$1=$2" >> "$SITE_ENV"
  fi
}
set_site_env CMS_URL http://127.0.0.1:1337
set_site_env CMS_PUBLIC_URL https://rangauto.ru/cms
set_site_env REVALIDATE_SECRET "$REVALIDATE_SECRET"

cat > /etc/systemd/system/rangauto-cms.service <<EOF
[Unit]
Description=Rang Auto CMS (Strapi)
After=network.target
ConditionPathExists=$CMS/current

[Service]
User=rangauto
WorkingDirectory=$CMS/current
EnvironmentFile=$CMS_ENV
Environment=NODE_OPTIONS=--max-old-space-size=640
ExecStart=/usr/bin/node node_modules/@strapi/strapi/bin/strapi.js start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/rangauto-cms-restart.service <<EOF
[Unit]
Description=Restart Rang Auto CMS after deploy

[Service]
Type=oneshot
ExecStart=/usr/bin/systemctl restart rangauto-cms.service
EOF

cat > /etc/systemd/system/rangauto-cms-restart.path <<EOF
[Unit]
Description=Watch Rang Auto CMS deploy marker

[Path]
PathChanged=$CMS/deployed

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now rangauto-cms-restart.path
systemctl enable rangauto-cms.service
[ -e "$CMS/current" ] && systemctl restart rangauto-cms.service

if ! grep -q 'handle_path /cms/\*' "$CADDYFILE"; then
  BACKUP="$CADDYFILE.bak.$(date +%s)"
  cp "$CADDYFILE" "$BACKUP"
  python3 - "$CADDYFILE" <<'PY'
import sys
path = sys.argv[1]
s = open(path).read()
old = "rangauto.ru {\n\tencode zstd gzip\n\treverse_proxy 127.0.0.1:3000\n}"
new = """rangauto.ru {
\tencode zstd gzip
\tredir /cms /cms/admin
\thandle_path /cms/* {
\t\treverse_proxy 127.0.0.1:1337
\t}
\thandle {
\t\treverse_proxy 127.0.0.1:3000
\t}
}"""
if old not in s:
    sys.exit("Не нашёл блок rangauto.ru в Caddyfile — добавьте маршрут /cms вручную")
open(path, "w").write(s.replace(old, new))
PY
  if ! caddy validate --config "$CADDYFILE" --adapter caddyfile; then
    cp "$BACKUP" "$CADDYFILE"
    echo "Конфиг Caddy не прошёл проверку, вернул прежний"; exit 1
  fi
  systemctl reload caddy
  echo "Caddy: добавлен маршрут /cms"
fi

systemctl restart rangauto.service
echo "Готово. Запустите деплой CMS (workflow «Deploy CMS»), затем откройте https://rangauto.ru/cms/admin"
