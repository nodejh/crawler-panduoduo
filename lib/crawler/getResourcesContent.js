const urlParse = require('url').parse;
const superagent = require('superagent');
const Eventproxy = require('eventproxy');
const cheerio = require('cheerio');
const delayMax = require('./../../config/config').delayMax;
const logger = require('./../utils/winston');


const ep = new Eventproxy();

/**
 * 根据 url 获取资源内容
 * @param  {array} urls urls
 * @return {object}     resource
 */
function getResourcesContent(urls) {
  return new Promise((resolve) => {
    // 命令 ep 重复监听 urls.length 次（在这里也就是 60 次） `fetch` 事件再行动
    ep.after('fetch', urls.length, (contents) => {
      // datas 是个数组，包含了 60 次 ep.emit('fetch', pair) 中的那 60 个 pair
      const res = contents.map((content) => {
        // 判断抓取是否出错
        if (content.error) {
          const data = {
            urlPanduoduo: content.url,
            date: new Date(),
            error: content.error,
          };
          return data;
        }
        // 抓取没有错误 分析页面
        const $ = cheerio.load(content.text);
        const $container = $('.col-a');
        const $content = $container.find('.sep dd');
        const title = $container.find('h1').text().replace(/\s+/g, ''); // 标题
        const categry = $content.eq(1).find('a').text().replace(/\s+/g, ''); // 类别
        const size = $content.eq(2).find('b').text().replace(/\s+/g, ''); // 大小
        let publishDate = $content.eq(5).text().replace(/\s+/g, ''); // 发布日期
        publishDate = publishDate && publishDate.split('：')[1];
        const urlPanbaidu = $container.find('center a').attr('href');
        const data = {
          urlPanduoduo: content.url,
          title,
          size,
          categry,
          date: new Date(),
          publishDate: new Date(`${publishDate.substring(0, 10)} ${publishDate.substring(10)}`),
          urlPanbaidu: decodeURIComponent(urlParse(urlPanbaidu).query.split('=')[1]),
        };
        return data;
      });
      resolve(res);
    });

    // 循环 urls 数组中的所有 url
    // 发送 HTTP 请求，并创建 fetch 事件
    urls.forEach((url, index) => {
      // 创建闭包，立即执行函数
      // 以实现间隔 delay 毫秒抓取数据
      ((function immediate(fetchUrl) {
        const delay = parseInt((Math.random() * delayMax) % 2000, 10);
        logger.info(`现在正在抓取的是 ${fetchUrl}， 延时 ${delay} 毫秒`);
        setTimeout(() => {
          superagent.get(fetchUrl)
          .end((error, res) => {
            if (error) {
              logger.error(`抓取  ${fetchUrl} 出错：${JSON.stringify(error)}`);
              return ep.emit('fetch', { url: fetchUrl, error });
            }
            ep.emit('fetch', { url: fetchUrl, text: res.text });
          });
        }, delay * index);
      })(url));
    });
  });
}


module.exports = getResourcesContent;
