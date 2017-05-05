const asyncjs = require('async');
const Resources = require('./lib/model/resources');
const getPageContent = require('./lib/crawler/getPageContent');
const getResourcesContent = require('./lib/crawler/getResourcesContent');
const logger = require('./lib/utils/winston');
const sendMail = require('./lib/utils/sendMail');
const { urlPrefix, mostPage } = require('./config/config');

// 开始计时（总时间）
console.time('抓取总耗时');
const startDate = new Date();

const argvStart = process.argv[2];
const argvEnd = process.argv[3];
const startNum = parseFloat(argvStart) * 10000;
const endNum = parseFloat(argvEnd) * 10000;
console.log('startNum: ', startNum);
console.log('endNum: ', endNum);


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
    const subject = ` 🙄 抓取第 ${startNum} 至  ${endNum} 页完毕`;
    const text = `抓取${startNum} 至 ${endNum} 完毕，总耗时 ${new Date() - startDate} ms`;
    const html = `<div>抓取第 <b style="color: red;">1</b> 至 <b style="color: red;"> ${endNum}</b> 页完毕，总耗时 <b style="color: red;">${new Date() - startDate}</b> ms</div>`;
    sendMail(subject, text, html);
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
  const subject = `😈 [ERROR]第 ${startNum} 至 ${endNum} 页， ${err.message}`;
  const text = `抓取 ${startNum} 至 ${endNum} 页出错，${err.stack}`;
  const html = `<div>抓取第 <b style="color: red;">${startNum}</b> 至 <b style="color: red;">${endNum}</b> 页出错， <br/><br/> <p>${err.stack}</p></div>`;
  sendMail(subject, text, html);
});


// main(1, 389683);
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
// console.log(a.aa);


if (startNum > -1 && endNum > -1) {
  console.log('startNum: ', startNum);
  console.log('endNum: ', endNum);
  main(startNum, endNum);
} else {
  console.log('参数错误');
}

