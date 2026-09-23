# Plan de migración: WordPress → nuevo hleon.dev

Del WordPress actual (servidor A) al nuevo sitio en el VPS compartido (servidor B).
El sitio no tiene visitas, así que **se acepta que quede caído durante el cambio**: no hace
falta corte en caliente, TTL bajo ni certificado previo. Lo único que no se negocia es:
**backup verificado**, **no afectar la otra web de B** y **no romper el correo del dominio**
(si existe). Instalación técnica en B: [README.md](README.md).

---

## 1. Backup del WordPress (servidor A → local)

- [ ] **Exportar la zona DNS** (captura o archivo) y anotar los registros **MX/TXT**. Si hay
      correo con el dominio, esos registros no se tocan.
- [ ] **Base de datos** (credenciales en `wp-config.php`):
  ```bash
  mysqldump --single-transaction --default-character-set=utf8mb4 --routines --triggers \
    -u <DB_USER> -p <DB_NAME> | gzip > ~/wp-hleon-db-$(date +%F).sql.gz
  ```
  Sin SSH: phpMyAdmin → Exportar → SQL, con compresión gzip.
- [ ] **Archivos:** `tar -czf ~/wp-hleon-files-$(date +%F).tar.gz -C /ruta/a public_html`
      (o "Copia de seguridad completa" en cPanel).
- [ ] **Descargar** a `backups/wordpress/` (ignorado por git) y comparar `sha256sum` local
      y remoto.
- [ ] **Verificar que sirve:** `gunzip -t` del dump, `tar -tzf` del archivo, e importar el
      dump en un MySQL local:
      `SELECT COUNT(*) FROM wp_posts WHERE post_status='publish';`
- [ ] Copia adicional fuera de la PC (disco externo, Drive).

## 2. Preparar el servidor B sin afectar la otra web

- [ ] Snapshot del VPS en el panel del proveedor.
- [ ] `sudo tar -czf ~/pre-hleon-$(date +%F).tar.gz /etc/nginx /etc/php/8.3/fpm`
- [ ] Anotar el estado actual:
  ```bash
  ss -tlnp; pm2 ls; ls /etc/nginx/sites-enabled/; ls /etc/php/8.3/fpm/pool.d/
  mysql -e "SHOW DATABASES;"; node -v; composer -V; mysql -V; free -h; df -h
  ```
  Confirmar que el puerto 3001 y la base `hleon_dev` están libres, y que Node es ≥ 20.9.
  Si hay poca RAM (menos de 2 GB libres), agregar swap para el build de Next.

## 3. Instalar el sitio en B

- [ ] [README.md](README.md) pasos 2 a 6: base de datos, clonar, `.env`, Laravel, builds y PM2.
- [ ] Paso 7 del README: copiar el conf de nginx y ejecutar
      `sudo nginx -t && sudo systemctl reload nginx` **sin certbot aún**.
- [ ] Revisar que **la otra web sigue respondiendo**.

## 4. Cambio de DNS y puesta en producción

- [ ] En el DNS cambiar los registros A de `hleon.dev` y `www` a `<IP_B>` y crear
      `A api → <IP_B>`. Eliminar AAAA viejos. **No tocar MX/TXT.**
- [ ] Esperar la propagación: `nslookup hleon.dev 8.8.8.8` debe devolver `<IP_B>`.
- [ ] `sudo certbot --nginx -d hleon.dev -d www.hleon.dev -d api.hleon.dev`
      (redirigir HTTP a HTTPS: sí), y luego `sudo certbot renew --dry-run`.
- [ ] Probar: home, blog, portafolio, servicios, trayectoria, /hire-me, formulario de
      contacto, `https://api.hleon.dev/api/perfil`, y login y edición en `/panel`.
- [ ] **Volver a comprobar la otra web.**
- [ ] Logs: `pm2 logs hleon-web --lines 50`, `backend/laravel/storage/logs/laravel.log`,
      `/var/log/nginx/error.log`.

## 5. Después

- [ ] Google Search Console: enviar `https://hleon.dev/sitemap.xml`.
- [ ] Backup diario de `hleon_dev` (cron con `mysqldump`) y de `backend/laravel/storage/app`.
- [ ] Cancelar el hosting del WordPress cuando el backup del paso 1 esté verificado.
- [ ] Actualizar `CLAUDE.md` (hoy dice "Deploy: Vercel") y quitar el dominio de Vercel si
      estaba asignado.
