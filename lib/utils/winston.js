const winston = require('winston');

const argvStart = process.argv[2];
const argvEnd = process.argv[3];


const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true, // 控制台日志输出带颜色
      level: 'debug', // { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: `${argvStart}-${argvEnd}-filelog-info.log`,
      level: 'info',
    }),
    new (winston.transports.File)({
      name: 'warn-file',
      filename: `${argvStart}-${argvEnd}-filelog-warn.log`,
      level: 'warn',
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: `${argvStart}-${argvEnd}-filelog-error.log`,
      level: 'error',
    }),
  ],
});


module.exports = logger;
