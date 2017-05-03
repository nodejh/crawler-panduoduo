const config = {
  startPage: 1,
  endPage: 389683,
  urlPrefix: 'http://www.panduoduo.net',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
  mongodb: 'mongodb://localhost:27017/panduoduo',
  delayMax: 20000000, // 最大间隔时间 (约 20000000 / 2000 ms)
  mostPage: 2, // 抓取页的并发数
  moseContent: 5, // 抓取内容的并发数
  mysql: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'muzhiso_v2',
  },

  // 邮箱设置
  email: {
    to: '3478795306@qq.com',
    from: '"Hang Jiang 👻" <jianghangscu@163.com>',
    host: 'smtp.163.com',
    secure: true,
    username: 'jianghangscu@163.com',
    password: '131420ab',
  },
};


module.exports = config;
