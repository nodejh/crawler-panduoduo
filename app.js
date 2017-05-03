const asyncjs = require('async');
const Resources = require('./lib/model/resources');
const getPageContent = require('./lib/crawler/getPageContent');
const getResourcesContent = require('./lib/crawler/getResourcesContent');
const logger = require('./lib/utils/winston');
const { urlPrefix, mostPage } = require('./config/config');

// 开始计时（总时间）
console.time('抓取总耗时');
const startDate = new Date();

/**
 * 主函数
 * @param  {number} start 开始页数
 * @param  {number} end   结束页数
 * @return {null}       null
 */
function main(start, end) {
  const urls = []; // 所有需要抓取的 url
  for (let i = start; i <= end; i++) {
    urls.push(`${urlPrefix}/bd/${i}`);
  }
  logger.silly(`总页数 ${urls.length}`);
  const queue = asyncjs.queue((url, callback) => {
    // 开始记录抓取某个 URL 的时间
    console.time(`[page] 抓取 ${url} 耗时`);
    getPageContent(url)
      .then((urlsCurrentPage) => {
        // console.log('urlsCurrentPage: ', urlsCurrentPage.length);
        // console.log('urlsCurrentPage[0]: ', urlsCurrentPage[0]);
        return getResourcesContent(urlsCurrentPage, url);
      })
      .then((datas) => {
        // console.log('datas: ', datas.length);
        return Resources.insertMany(datas);
      })
      .then(() => {
        // console.log('result: ', result.length);
        callback(null);
      })
      .catch((exception) => {
        // logger.error(`${new Date()} [error]: ${exception.message}`);
        callback(exception);
      });
  }, mostPage);

  queue.drain = () => {
    logger.error(`👻 抓取总耗时: ${new Date() - startDate}`);
    console.timeEnd('抓取总耗时');
  };

  urls.forEach((url, index) => {
    logger.silly(`${new Date()} index: ${index}`);
    queue.push(url, (error) => {
      console.timeEnd(`[page] 抓取 ${url} 耗时`);
      if (error) {
        // 抓取异常
        // 抓取某页以及存储数据库的错误最终都会流向这里
        logger.error(`${new Date()} [error]: ${url} ${error.message} ${error.stack}`);
        return false;
      }
      // 抓取某页数据完毕（抓取完毕某一个 URL）
      logger.warn(`${new Date()} [finish]: ${url}`);
    });
  });
}


// 监听未捕获的异常，并将错误写入文件
process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException: \n ${err.stack}`);
});


// main(1, 389683);
main(1, 2);
// try {
//   console.log('a : ', a.toString());
// } catch (err) {
//   console.log('e: ', err);
//   // const mailOptions = {
//   //   subject: `uncaughtException: ${err.message}`, // Subject line
//   //   text: err.stack, // plain text body
//   //   html: err.stack, // html body
//   // };
//   // sendMail(mailOptions);
//   logger.error(`${new Date()} \n ${err.stack}`);
// }
