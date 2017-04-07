const Resources = require('./lib/model/resources');
const getPageContent = require('./lib/crawler/getPageContent');
const getResourcesContent = require('./lib/crawler/getResourcesContent');
const logger = require('./lib/utils/winston');
const { urlPrefix, delayMax } = require('./config/config');


/**
 * 抓取流程控制
 * @param  {string} url 需要抓取的包含具体页面的 URL
 * @return {null}       null
 */
async function crawler(url) {
  try {
    const urls = await getPageContent(url);
    const result = await getResourcesContent(urls);
    const res = await Resources.insertMany(result);
    console.log('res: ', res);
  } catch (e) {
    logger.error(`抓取 ${url} (或存储其数据)出错, ${JSON.stringify(e)}`);
  }
}


/**
 * 主函数
 * @param  {number} start 开始页数
 * @param  {number} end   结束页数
 * @return {null}       null
 */
function main(start, end) {
  // 循环所有 URL
  for (let i = start; i <= end; i++) {
    // 创建闭包，立即执行函数
    // 以实现间隔 delay 毫秒抓取数据
    ((function immediate(j) {
      const url = `${urlPrefix}/bd/${j}`;
      const delay = parseInt((Math.random() * delayMax) % 2000, 10);
      logger.info(`现在正在抓取的是 ${url}， 延时 ${delay} 毫秒`);
      setTimeout(() => {
        crawler(url);
      }, delay);
    })(i));
  }
}


main(1, 10);
