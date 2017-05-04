const fs = require('fs');
const readline = require('readline');

const getProxy = () => {
  return new Promise((resolve) => {
    const data = [];
    const rl = readline.createInterface({
      input: fs.createReadStream('./../../config/proxy.txt'),
    });
    rl.on('line', (line) => {
      data.push(`http://${line}`);
    });
    rl.on('close', () => {
      console.log('dd');
      resolve(data);
    });
  });
};

// const proxyArr = fs.readFileSync('./../../config/proxy.txt', 'utf8').split('\n');
// const proxy = proxyArr[Math.floor(Math.random() * ((proxyArr.length) + 1))];
// console.log('proxy: ', proxy);

module.exports = getProxy;

