const mongoose = require('mongoose');
const logger = require('./../utils/winston');
const config = require('./../../config/config');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);
mongoose.connection.on('error', logger.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  logger.verbose('连接数据库成功');
});

module.exports = mongoose;
