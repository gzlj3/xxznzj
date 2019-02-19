const utils = require('utils.js');
exports.getFmMeta = (fmMetas,name) => {
  fmMetas.map(meta => {
    if (meta.name===name) {
      return meta;
    }
  });
  return null;
}

/**
 * 解析时间字符串（格式hh:mm)
 * 返回数字型数组[hh,mm]，解析异常返回[0,0]
 */
const parseTime = (time) => {
  let h=0,m=0;
  if (!utils.isEmpty(time)) {
    let hmArr = time.split(':');
    if (hmArr.length > 1) {
      h = utils.getInteger(hmArr[0]);
      m = utils.getInteger(hmArr[1]);
    }
  }
  h = h < 0 ? 0 : (h > 23 ? 23 : h);
  m = m < 0 ? 0 : (m > 59 ? 59 : m);
  return [h,m];
}
exports.parseTime = parseTime;

/**
 * 解析星期字符串（格式周日，周一，周二...)
 * 返回数字分别对应0，1，2....
 */
const parseWeek = (week) => {
  const weekArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  for(let i=0;i<weekArray.length;i++){
    if(week === weekArray[i]) return i;
  }
  return 0;
}
exports.parseWeek = parseWeek;

/**
 * 解析星期时间字符串（格式： 星期 hh:mm)
 * 返回数字型数组[week,hh,mm]，解析异常返回null
 */
const parseWeektime = (weektime) => {
  if(utils.isEmpty(weektime)) return null;
  const wtArr = weektime.split(' ');
  if(wtArr.length<2) return null;
  const w = parseWeek(wtArr[0]);
  const hmArr = parseTime(wtArr[1]);
  return [w,...hmArr];
}
exports.parseWeektime = parseWeektime;

