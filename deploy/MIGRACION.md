# Plan de migración: WordPress → nuevo hleon.dev

Del WordPress actual (servidor A) al nuevo sitio en el VPS compartido (servidor B),
sin tocar la otra web que vive en B. Instalación técnica en B: [README.md](README.md).

**Principio:** el dominio sigue apuntando a A hasta que B esté completo y probado.
El corte es solo un cambio de DNS, y la vuelta atrás es revertirlo.

---

## Fase 0 — Preparación (2 días antes del corte)

- [ ] **Accesos:** SSH, cPanel o FTP al servidor A; SSH con sudo al servidor B; panel DNS
      (registrador, Cloudflare o el hosting de A).
- [ ] **Exportar la zona DNS completa** (captura o archivo). Anotar todos los registros
      además de los A: **MX, TXT (SPF/DKIM/DMARC), CNAME**. Si hay correo con el dominio,
      esos registros **no se tocan** en el corte.
- [ ] **Bajar el TTL** de los registros A/AAAA de `hleon.dev` y `www` a 300 s, **al menos
      24–48 h antes** del corte, para que el cambio y un posible rollback se propaguen en minutos.
- [ ] **Vercel:** el repo estaba conectado a Vercel. Revisar que el dominio `hleon.dev` no
      esté asignado allí y desconectar el auto-deploy si ya no se usará.
- [ ] **URLs del WordPress:** guardar el listado de URLs públicas (`/wp-sitemap.xml` o
      `/sitemap_index.xml`) para crear redirecciones 301 y no perder SEO (Fase 5).
- [ ] Revisar si el WordPress tiene **HSTS** activo (`curl -sI https://hleon.dev | grep -i strict`).
      Si lo tiene, el certificado de B debe existir *antes* del corte (ver Fase 3.4).

## Fase 1 — Backup completo del WordPress (servidor A → local)

### 1.1 Base de datos
Tomar nombre, usuario y contraseña de `wp-config.php` (`DB_NAME`, `DB_USER`, `DB_PASSWORD`).
```bash
mysqldump --single-transaction --default-character-set=utf8mb4 --routines --triggers \
  -u <DB_USER> -p <DB_NAME> | gzip > ~/wp-hleon-db-$(date +%F).sql.gz
```
Sin SSH: phpMyAdmin → Exportar → Personalizado → SQL, con compresión gzip.

### 1.2 Archivos
```bash
tar -czf ~/wp-hleon-files-$(date +%F).tar.gz -C /ruta/a public_html
```
Debe incluir `wp-content/` (uploads, temas, plugins), `wp-config.php` y `.htaccess`.
Con cPanel, "Copia de seguridad completa" genera todo en un solo archivo.

### 1.3 Descargar a local
```bash
scp usuario@servidorA:~/wp-hleon-*-$(date +%F).* ./backups/wordpress/
sha256sum backups/wordpress/*    # anotar las sumas y compararlas con las del servidor
```
Guardar `backups/` **fuera del repo**, o al menos no versionado: contiene credenciales.

### 1.4 Verificar que el backup sirve (no saltarse este paso)
- [ ] `gunzip -t wp-hleon-db-*.sql.gz` y `tar -tzf wp-hleon-files-*.tar.gz | head`
- [ ] Importar en un MySQL local y revisar que existan las tablas y los posts:
      `SELECT COUNT(*) FROM wp_posts WHERE post_status='publish';`
- [ ] Copia adicional en otro lugar (disco externo, Drive).
- [ ] Opcional: exportar el contenido en WXR (WP Admin → Herramientas → Exportar), que es portable.

## Fase 2 — Reconocimiento del servidor B (sin cambiar nada)

- [ ] **Snapshot del VPS** en el panel del proveedor antes de tocar nada.
- [ ] Respaldar configuraciones: `sudo tar -czf ~/pre-hleon-$(date +%F).tar.gz /etc/nginx /etc/php/8.3/fpm`
- [ ] Registrar el estado actual de la otra web (para comparar después):
```bash
ss -tlnp                       # puertos en uso (confirmar que 3001 está libre)
pm2 ls                         # procesos Node existentes y sus nombres
ls /etc/nginx/sites-enabled/   # server blocks existentes
ls /etc/php/8.3/fpm/pool.d/    # pools PHP-FPM
mysql -e "SHOW DATABASES;"     # confirmar que hleon_dev no choca
node -v; composer -V; mysql -V; nginx -v
free -h; df -h                 # el build de Next usa ~1–2 GB RAM; si falta, agregar swap
```
- [ ] Anotar la URL de la otra web y una prueba rápida de que responde, para repetirla
      después de cada cambio en nginx.

## Fase 3 — Instalar el nuevo sitio en B (dominio todavía en A)

### 3.1 Instalación
Seguir [README.md](README.md) pasos 2 a 6: base de datos con usuario propio, clonar en
`/var/www/hleon.dev`, archivos `.env`, Laravel, builds y PM2. Recomendado: pool PHP-FPM propio.

### 3.2 nginx
Paso 7 del README **sin certbot todavía**. Después de cada cambio:
`sudo nginx -t && sudo systemctl reload nginx` y verificar que **la otra web sigue respondiendo**.

### 3.3 Probar sin tocar el DNS
Hacer que solo tu PC resuelva el dominio hacia B:
- Windows: agregar a `C:\Windows\System32\drivers\etc\hosts` (como administrador):
  ```
  <IP_B>  hleon.dev www.hleon.dev api.hleon.dev
  ```
- O con curl: `curl -H "Host: hleon.dev" http://<IP_B>/`

Revisar: home, blog, portafolio, servicios, trayectoria, /hire-me, formulario de contacto,
`api.hleon.dev/api/perfil`, y el login y la edición en `/panel`. Por ahora todo por HTTP.
**Quitar la línea de `hosts` al terminar.**

### 3.4 Certificado SSL
- **Opción A (recomendada si hay HSTS, o para no tener ningún minuto sin HTTPS):**
  emitir el certificado antes del corte con el desafío DNS:
  `sudo certbot certonly --manual --preferred-challenges dns -d hleon.dev -d www.hleon.dev -d api.hleon.dev`
  y crear los TXT `_acme-challenge` que pida. La renovación manual no es automática: después
  del corte, volver a emitir con `certbot --nginx` para dejar la renovación automática.
- **Opción B:** ejecutar `certbot --nginx ...` inmediatamente después del corte (Fase 4).
  Habrá unos minutos solo con HTTP.

### 3.5 Contenido
- [ ] Revisar que los seeders cargaron perfil, posts, proyectos y servicios; completar lo
      que falte desde `/panel`.
- [ ] **Decidir** si algún post del WordPress se migra al nuevo blog (a mano desde `/panel`,
      tomando el contenido del backup).

## Fase 4 — Corte a producción

Elegir un horario de poco tráfico. Duración estimada: 30–60 min.

1. [ ] Backup final del WordPress (repetir 1.1–1.3), por si hubo cambios desde la Fase 1.
2. [ ] En el DNS cambiar **solo** los registros A de `hleon.dev` y `www` a `<IP_B>` y crear
       `A api → <IP_B>`. Eliminar AAAA viejos si apuntaban a A. **No tocar MX/TXT.**
3. [ ] Verificar la propagación: `nslookup hleon.dev 8.8.8.8` y `nslookup hleon.dev 1.1.1.1`.
4. [ ] SSL: `sudo certbot --nginx -d hleon.dev -d www.hleon.dev -d api.hleon.dev`
       (redirigir HTTP a HTTPS: sí). Probar la renovación con `sudo certbot renew --dry-run`.
5. [ ] Pruebas en producción por HTTPS: la lista de 3.3, más `http://` → `https://`,
       `www` → dominio sin www y el candado válido.
6. [ ] **Verificar que la otra web del servidor B sigue funcionando.**
7. [ ] Revisar logs:
       `pm2 logs hleon-web --lines 50`, `tail backend/laravel/storage/logs/laravel.log`,
       `sudo tail /var/log/nginx/error.log`.

### Rollback
Si algo grave falla: volver a poner los registros A con la IP del servidor A. Con TTL 300
se revierte en minutos, porque el WordPress sigue intacto en A.

## Fase 5 — Después del corte

- [ ] **Redirecciones 301** de las URLs viejas del WordPress (lista de la Fase 0) a sus
      equivalentes nuevas, con bloques `location` en nginx o `redirects()` en `next.config.ts`.
- [ ] Google Search Console: verificar la propiedad y enviar `https://hleon.dev/sitemap.xml`.
- [ ] Volver a subir el TTL del DNS (3600 o más) cuando todo esté estable.
- [ ] Backups automáticos en B: `mysqldump` diario de `hleon_dev` (cron) y copia de
      `backend/laravel/storage/app` (imágenes subidas).
- [ ] Mantener el servidor A **1–2 semanas** como respaldo y cancelarlo solo cuando el
      backup local esté verificado (Fase 1.4) y no haya problemas.
- [ ] Actualizar `CLAUDE.md` (hoy dice "Deploy: Vercel").
