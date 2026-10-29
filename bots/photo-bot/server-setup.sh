#!/usr/bin/env bash
set -euo pipefail

[ "$(id -u)" = 0 ] || { echo "Запустите от root"; exit 1; }
TOKEN=${1:-}
[ -n "$TOKEN" ] || { echo "Использование: $0 <токен бота> [telegram id владельца]"; exit 1; }
OWNER=${2:-}

ENV=/etc/rangauto-photo-bot.env
DATA=/srv/rangauto/photo-bot-data
BOT=/srv/rangauto/current/photo-bot/bot.mjs

install -d -o rangauto -g rangauto "$DATA"
umask 077
cat > "$ENV" <<CONF
PHOTO_BOT_TOKEN=$TOKEN
PHOTO_BOT_ALLOWED_IDS=$OWNER
PHOTO_BOT_DATA=$DATA
CMS_URL=http://127.0.0.1:1337
CONF
umask 022

cat > /etc/systemd/system/rangauto-photo-bot.service <<UNIT
[Unit]
Description=Rang Auto photo bot (Telegram)
After=network-online.target rangauto.service
PartOf=rangauto.service
ConditionPathExists=$BOT

[Service]
User=rangauto
EnvironmentFile=$ENV
ExecStart=/usr/bin/node $BOT
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target rangauto.service
UNIT

systemctl daemon-reload
systemctl enable rangauto-photo-bot.service
if [ -e "$BOT" ]; then
  systemctl restart rangauto-photo-bot.service
  sleep 3
  journalctl -u rangauto-photo-bot -n 5 --no-pager
else
  echo "Бот появится на сервере после следующего деплоя сайта (ветка production) и запустится сам"
fi
