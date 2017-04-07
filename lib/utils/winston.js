const winston = require('winston');


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
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error',
    }),
  ],
});


module.exports = logger;
