# Despliegue en VPS (sin Docker)

Instalación directa en un VPS que ya corre PHP 8.3, Node y nginx junto a otra
web. Decisión y alternativas descartadas: [ADR 0012](../docs/adr/0012-despliegue-vps-sin-docker-panel-en-ruta.md).

| URL | Qué | Cómo corre |
|---|---|---|
| `https://hleon.dev` | Sitio público (Next.js 16) | PM2 `hleon-web` en `127.0.0.1:3001`, nginx proxy |
| `https://hleon.dev/panel` | Panel admin (React + Vite) | Estático desde `apps/admin/dist` |
| `https://api.hleon.dev` | API Laravel 12 | PHP-FPM 8.3 |

Requisitos: PHP 8.3 (ext. `pdo_mysql`, `mbstring`, `xml`, `curl`, `zip`, `bcmath`),
Composer, **Node ≥ 20.9**, PM2, MySQL 8.0.16+ (o MariaDB 10.4+), nginx, certbot.

## Instalación inicial

### 1. DNS
Registros A de `hleon.dev`, `www.hleon.dev` y `api.hleon.dev` → IP del VPS.

### 2. Base de datos (en el MySQL existente, usuario propio)
```sql
CREATE DATABASE hleon_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hleon'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON hleon_dev.* TO 'hleon'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Código
```bash
sudo mkdir -p /var/www/hleon.dev && sudo chown $USER:www-data /var/www/hleon.dev
git clone https://github.com/ellioh/hleon-dev.git /var/www/hleon.dev
cd /var/www/hleon.dev
```

### 4. Variables de entorno
```bash
cp deploy/env.web.example   .env.production.local                 # editar
cp deploy/env.admin.example apps/admin/.env.production.local
cp backend/laravel/.env.example backend/laravel/.env              # aplicar deploy/env.laravel.example
```

### 5. Laravel
```bash
cd backend/laravel
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --seed --force      # --seed solo la primera vez
php artisan storage:link
sudo chown -R $USER:www-data storage bootstrap/cache
sudo chmod -R ug+rwX storage bootstrap/cache
cd ../..
```

### 6. Builds y proceso Node
```bash
npm ci
npm run build -w @hleon/admin
npm run build
pm2 start deploy/ecosystem.config.cjs
pm2 save        # y `pm2 startup` si PM2 aún no arranca con el sistema
```

### 7. nginx + SSL
```bash
sudo cp deploy/nginx/hleon.dev.conf /etc/nginx/sites-available/hleon.dev
sudo ln -s /etc/nginx/sites-available/hleon.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d hleon.dev -d www.hleon.dev -d api.hleon.dev
```

## Actualizaciones
```bash
cd /var/www/hleon.dev && bash deploy/deploy.sh
```

## Convivencia con la otra web del VPS
- **Puerto:** confirmar que 3001 está libre (`ss -tlnp | grep 3001`); si no, cambiarlo
  en `ecosystem.config.cjs` y en `proxy_pass`.
- **PHP-FPM:** se usa el pool `[www]` existente de php8.3-fpm (socket `php8.3-fpm.sock`).
  No se crea un pool ni se recarga PHP-FPM, para no afectar a la otra web.
- **No tocar** los proyectos de la otra web (`/var/www/compara2-*`) ni sus procesos o configs.
- **PM2:** los nombres de proceso no deben repetirse (`pm2 ls`).
- **nginx:** siempre `nginx -t` antes de `reload`; un error en este archivo tumbaría
  también la otra web.

## Ojo
- `data/posts.json` y `data/proyectos.json` están versionados y el admin legado
  `/admin` los puede reescribir en producción. Si eso pasa, `git pull --ff-only`
  falla: respaldar los cambios antes de actualizar.
- `VITE_API_URL` y `LARAVEL_API_URL` se leen al compilar: si cambian, re-ejecutar
  los builds.
