/**
 * 生成介于某个区间内的随机数
 * @param  {number} min 区间开始
 * @param  {number} max 区间
 * @return {number}       随机数
 */
function randomRange(min, max) {
  const number = Math.floor(Math.floor(Math.random() * ((min - max) + 1)) + max);
  return number;
}


module.exports = {
  randomRange,
};
