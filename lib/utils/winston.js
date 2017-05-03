const winston = require('winston');
const Mail = require('winston-mail').Mail;
const config = require('./../../config/config');

const configEmail = config.email;


const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true, // 控制台日志输出带颜色
      level: 'debug', // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info',
    }),
    new (winston.transports.File)({
      name: 'warn-file',
      filename: 'filelog-warn.log',
      level: 'warn',
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error',
    }),
    new (Mail)({
      to: configEmail.to,
      from: configEmail.from,
      host: configEmail.host,
      secure: configEmail.secure,
      username: configEmail.username,
      password: configEmail.password,
      level: 'error',
    }),
  ],
});


module.exports = logger;
