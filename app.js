const Resources = require('./lib/model/resources');
const getPageContent = require('./lib/crawler/getPageContent');
const getResourcesContent = require('./lib/crawler/getResourcesContent');
const { query } = require('./lib/db/mysql');
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
    // const res = await Resources.insertMany(result);
    // console.log('result: ', result);
    await Resources.insertMany(result);
    const values = result.map((item) => {
      // return [item.urlPanduoduo, item.title, item.size,
      //   item.categry, item.date, item.publishDate, item.urlPanbaidu];
      return [item.title, `${item.title} ${item.urlPanbaidu}`, item.urlPanbaidu, 1, item.date,
        item.categry, item.size, item.publishDate];
    });
    // const sql = 'insert into panduoduo(url_panduoduo,
    // title, size, categry, date, publish_date, url_panbaidu) values ?';
    const sql = 'insert into content(title, content, url, userid, date, tags, size, publish_date) values ?';
    await query(sql, [values]);
    logger.warn(`[finish]: ${url}`);
  } catch (e) {
    console.log('e: ', e);
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
    // 以实现间隔 delay 毫秒抓取数据
    const delay = parseInt((Math.random() * delayMax) % 2000, 10);
    setTimeout(() => {
      const url = `${urlPrefix}/bd/${i}`;
      logger.info(`现在正在抓取的是 ${url}， 延时 ${delay} 毫秒`);
      crawler(url);
    }, delay * (i + 1));
  }
}


// main2(1, 389683);
main(1, 100);
