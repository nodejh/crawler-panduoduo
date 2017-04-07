const superagent = require('superagent');
const cheerio = require('cheerio');
const { urlPrefix } = require('./../../config/config');


/**
 * 获取某个 url 内的所有 href
 * @param  {string} url url
 * @return {array}     array of hrefs
 */
function getPageContent(url) {
  return new Promise((resolve, reject) => {
    superagent.get(url)
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
