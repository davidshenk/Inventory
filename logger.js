const winston = require('winston');

const logFilePath = './app.log';

const _logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: logFilePath })],
});

const formatRequest = (req) => ({
  method: req.method,
  endpoint: req.url,
  params: req.params,
  query: req.query,
  body: req.body,
});

const logger = function (req, res, next) {
  const logData = formatRequest(req);
  _logger.info(logData);
  next();
};

module.exports = { logger };
