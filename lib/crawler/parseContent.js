const urlParse = require('url').parse;
const cheerio = require('cheerio');

/**
 * 解析内容页面 获取百度云链接等数据
 * @param  {string} text 抓取到的html文本
 * @return {object}      百度云的数据
 */
function parseContent(text) {
  // 抓取没有错误 分析页面
  const $ = cheerio.load(text);
  const $container = $('.col-a');
  const $content = $container.find('.sep dd');
  const title = $container.find('h1').text().replace(/\s+/g, ''); // 标题
  const categry = $content.eq(1).find('a').text().replace(/\s+/g, ''); // 类别
  const size = $content.eq(2).find('b').text().replace(/\s+/g, ''); // 大小
  let publishDate = $content.eq(5).text().replace(/\s+/g, ''); // 发布日期
  publishDate = publishDate && publishDate.split('：')[1];
  const urlPanbaidu = $container.find('center a').attr('href') || '';
  // console.log('urlPanbaidu: ', urlPanbaidu);
  const data = {
    title,
    size,
    categry,
    date: new Date(),
    publishDate: new Date(`${publishDate.substring(0, 10)} ${publishDate.substring(10)}`),
    urlPanbaidu: decodeURIComponent(urlParse(urlPanbaidu).query.split('=')[1]),
  };
  return data;
}


module.exports = parseContent;
