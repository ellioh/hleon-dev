// PM2: sitio público Next.js de hleon.dev (ver deploy/README.md).
// Uso: pm2 start deploy/ecosystem.config.cjs && pm2 save
// Next lee las variables de /var/www/hleon.dev/.env.production.local al arrancar.
module.exports = {
  apps: [
    {
      name: "hleon-web",
      cwd: "/var/www/hleon.dev",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001 -H 127.0.0.1",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "512M",
    },
  ],
};
