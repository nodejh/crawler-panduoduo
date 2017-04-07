const mongoose = require('mongoose');
const logger = require('./../utils/winston');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/panduoduo-test');
mongoose.connection.on('error', logger.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  logger.info('连接数据库成功');
});

module.exports = mongoose;
