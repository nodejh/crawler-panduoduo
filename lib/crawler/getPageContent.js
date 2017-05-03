const superagent = require('superagent');
const cheerio = require('cheerio');
const { urlPrefix, userAgent } = require('./../../config/config');
const { randomRange } = require('./../../lib/utils/random');
const agents = require('./../../lib/utils/agents');

/**
 * 获取某个 url 内的所有 href
 * @param  {string} url url
 * @return {array}     array of hrefs
 */
function getPageContent(url) {
  return new Promise((resolve, reject) => {
    // 0.0.0.0-127.255.255.255
    // eslint-disable-next-line
    // const ip = `${randomRange(115, 121)}.${randomRange(42, 159)}.${randomRange(0, 255)}.${randomRange(0, 255)}`;
    // const userAgent = agents[randomRange(0, agents.length)];
    superagent.get(url)
      .set('User-Agent', userAgent)
      // .set('X-Forwarded-For', ip)
      .end((err, sres) => {
        if (err) {
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
