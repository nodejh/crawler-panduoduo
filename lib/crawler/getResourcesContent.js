const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
require('superagent-proxy')(superagent);
const asyncjs = require('async');
const logger = require('./../utils/winston');
const parseContent = require('./parseContent');
const config = require('./../../config/config');
// const getProxy = require('./../utils/getProxy');

/**
 * 根据 url 获取资源内容
 * @param  {array} urls             当前页面的所有子 url
 * @param  {string} urlCurrentPage  当前页面的 url
 * @return {object}                 抓取到的 resource
 */
function getResourcesContent(urls, urlCurrentPage) {
  // const proxy = 'socks5://127.0.0.1:1080';
  // const proxy = fs.readdirSync('');
  // Math.floor(Math.random() * ((y-x)+1) + x);
  const proxyArr = fs.readFileSync(path.join(__dirname, './../../config/proxy.txt'), 'utf8').split('\n');
  const proxy = `http://${proxyArr[Math.floor(Math.random() * ((proxyArr.length) + 1))]}`;
  console.log('proxy: ', proxy);
  const results = [];
  return new Promise((resolve) => {
    // 创建队列
    const queue = asyncjs.queue((url, callback) => {
      // 开始记录抓取某个资源的耗时
      console.time(`[resource] 抓取 ${url} 耗时`);
      superagent.get(url)
        .set('User-Agent', config.userAgent)
        .proxy(proxy)
        .timeout({ response: 1000, deadline: 2000 })
        .end((error, res) => {
          if (error) {
            // 抓取出错
            logger.error(`${new Date()} [抓取 ${url} 出错]: ${error.message}`);
            callback(error);
          }
          // 抓取成功，分析页面
          const resource = parseContent(res.text);
          resource.urlPanduoduo = url;
          resource.urlCurrentPage = urlCurrentPage;
          // console.log('resource: ', resource);
          callback(null, resource);
        });
    }, config.moseContent);

    // 循环 urls 中的所有 url
    urls.forEach((url) => {
      // console.log('url: ', url);
      queue.push(url, (error, res) => {
        console.timeEnd(`[resource] 抓取 ${url} 耗时`);
        if (error) {
          // console.log('error: ', error);
          // 抓取某条数据出错
          logger.error(`${new Date()} [error-resuorce]: ${url} ${error.message}`);
          // return reject(error);
          return false;
        }
        // console.log('res: ', res);
        results.push(res);
        // 抓取某条数据完毕
        logger.warn(`${new Date()} [finish-resuorce]: ${url}`);
      });
    });

    queue.drain = () => {
      resolve(results);
    };
  });
}


module.exports = getResourcesContent;
