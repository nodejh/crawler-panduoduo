const superagent = require('superagent');
require('superagent-proxy')(superagent);
const cheerio = require('cheerio');
const { urlPrefix, userAgent } = require('./../../config/config');

/**
 * 获取某个 url 内的所有 href
 * @param  {string} url url
 * @return {array}     array of hrefs
 */
function getPageContent(url) {
  // const proxy = 'http://101.201.80.164:94';
  return new Promise((resolve, reject) => {
    superagent.get(url)
      .set('User-Agent', userAgent)
      // .proxy(proxy)
      .timeout({ response: 1000, deadline: 2000 })
      .end((err, sres) => {
        if (err) {
          // 代理不可用，删除代理并重新抓取
          return reject(err);
        }
        const $ = cheerio.load(sres.text);
        const items = [];
        $('.list-resource tr').each((idx, element) => {
          if (idx > 0) {
            const $element = $(element);
            const href = $element.find('.t1 a').attr('href');
            items.push(`${urlPrefix}${href}`);
          }
        });
        return resolve(items);
      });
  });
}


module.exports = getPageContent;
