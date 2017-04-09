const Resources = require('./lib/model/resources');
const getPageContent = require('./lib/crawler/getPageContent');
const getResourcesContent = require('./lib/crawler/getResourcesContent');
const logger = require('./lib/utils/winston');
const { urlPrefix } = require('./config/config');
const asyncjs = require('async');

// 开始时间
console.time('crawler');

/**
 * 抓取流程控制
 * @param  {string} url 需要抓取的包含具体页面的 URL
 * @return {null}       null
 */
// async function crawler(url) {
//   try {
//     const urls = await getPageContent(url);
//     const result = await getResourcesContent(urls);
//     // const res = await Resources.insertMany(result);
//     await Resources.insertMany(result);
//     logger.warn(`[finish]: ${url}`);
//   } catch (e) {
//     console.log('e: ', e);
//     logger.error(`${new Date()} 抓取 ${url} (或存储其数据)出错, ${JSON.stringify(e)}`);
//   }
// }


/**
 * 主函数
 * @param  {number} start 开始页数
 * @param  {number} end   结束页数
 * @return {null}       null
 */
function main(start, end) {
  const urls = []; // 所有需要抓取的 url
  const most = 12; // 并发数
  for (let i = start; i <= end; i++) {
    urls.push(`${urlPrefix}/bd/${i}`);
  }
  console.log(`总页数 ${urls.length}`);
  const queue = asyncjs.queue((url, callback) => {
    console.time(url);
    getPageContent(url)
      .then((urlsCurrentPage) => {
        // console.log('urlsCurrentPage: ', urlsCurrentPage);
        return getResourcesContent(urlsCurrentPage);
      })
      .then((datas) => {
        return Resources.insertMany(datas);
      })
      .then(() => {
        // console.log('result: ', result);
        callback(null, url);
      })
      .catch((exception) => {
        logger.error(`${new Date()} [exception]: ${exception.message}`);
        callback(exception);
      });
  }, most);

  queue.drain = () => {
    console.timeEnd('crawler');
  };

  urls.forEach((url, index) => {
    logger.verbose(`${new Date()} index: ${index}`);
    queue.push(url, (error, res) => {
      console.timeEnd(url);
      if (error) {
        logger.error(`${new Date()} [抓取 ${url} 出错]: ${error.message}`);
        return false;
      }
      logger.warn(`${new Date()} [finish]: ${start}-${end}-${res}`);
    });
  });
}


// main(1, 389683);
main(1, 500);
