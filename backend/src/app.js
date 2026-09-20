const express = require('express');
const { corsMiddleware } = require('./middleware/cors.middleware');
const { errorMiddleware } = require('./middleware/error.middleware');
const { loggerMiddleware } = require('./middleware/logger.middleware');
const { createRouter } = require('./routes');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(corsMiddleware);
  app.use(loggerMiddleware);

  const router = createRouter();
  app.use(router);

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };