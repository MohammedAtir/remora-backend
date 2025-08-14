// middlewares/errorHandler.js
const pino = require('pino');
const logger = pino();

module.exports = (err, req, res, next) => {
  logger.error({ err, url: req.originalUrl, body: req.body }, 'Unhandled error');
  const status = err.status || 500;
  const payload = {
    error: err.message || 'Internal Server Error'
  };
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  res.status(status).json(payload);
};
