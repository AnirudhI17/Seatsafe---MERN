const { createApp } = require('./app');
const { config } = require('./config/env');
const { pingDb, pool } = require('./database/db');

async function main() {
  console.log(`[INFO] Config loaded for environment: ${config.app.env}`);

  const isConnected = await pingDb();
  if (!isConnected) {
    console.warn('[WARN] Initial database ping failed, continuing startup...');
  } else {
    console.log('[INFO] Database connection established');
  }

  const app = createApp();

  const server = app.listen(config.server.port, config.server.host, () => {
    console.log(`[INFO] Server listening on ${config.server.host}:${config.server.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`[INFO] Received ${signal}, shutting down server...`);
    server.close(async () => {
      console.log('[INFO] HTTP server closed');
      await pool.end();
      console.log('[INFO] Database pool closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('[FATAL] Failed to start server:', err);
  process.exit(1);
});