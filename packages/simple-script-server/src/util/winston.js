import { createLogger, format, transports } from 'winston';

const {
  combine, timestamp, simple, json,
} = format;
const logger = createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: simple(),
    }),
    new transports.File({
      name: 'error-file',
      filename: '.logs/error.log',
      level: 'error',
      silent: process.env.NODE_ENV === 'test',
    }),
    new transports.File({
      name: 'info-file',
      filename: '.logs/info.log',
      level: 'info',
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
  exitOnError: false,
});

export default logger;
