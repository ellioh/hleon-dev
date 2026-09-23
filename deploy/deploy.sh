#!/usr/bin/env bash
# Actualiza hleon.dev en el VPS (ver deploy/README.md). Ejecutar desde el
# usuario dueño de /var/www/hleon.dev:  bash deploy/deploy.sh
set -euo pipefail

APP_DIR=/var/www/hleon.dev
cd "$APP_DIR"

echo "==> git pull"
git pull --ff-only origin main

echo "==> Laravel"
cd backend/laravel
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
# artisan corre como root; PHP-FPM (www-data) debe poder escribir aquí
chown -R www-data:www-data storage bootstrap/cache
cd "$APP_DIR"

echo "==> Dependencias Node"
npm ci

echo "==> Build panel (/panel)"
npm run build -w @hleon/admin

echo "==> Build sitio Next.js"
NODE_OPTIONS=--max-old-space-size=2048 npm run build

echo "==> Reiniciar Next.js"
pm2 reload deploy/ecosystem.config.cjs --update-env

echo "Listo."
