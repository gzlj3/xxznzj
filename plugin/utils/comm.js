const utils = require('utils.js');
const CONSTS = require('constants.js');
const moment = require('moment.min.js');
const app = require('../app1.js');

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

/**
 * 解析星期时间字符串（格式： 星期 hh:mm)
 * 返回当前星期的时间对象(moment)
 */
const parseWeektimeToMoment = (weektime) => {
  if (utils.isEmpty(weektime)) return null;
  const wtArr = weektime.split(' ');
  if (wtArr.length < 2) return null;
  const w = parseWeek(wtArr[0]);
  return moment(`${w} ${wtArr[1]}`, 'e HH:mm');
}
exports.parseWeektimeToMoment = parseWeektimeToMoment;

/**
 * 判断当前时间是否在指定的时间前后1小时内
 * weektime格式： 星期 hh:mm
 * 返回：true或false
 */
const inWeektime = (weektime) => {
  const time = parseWeektimeToMoment(weektime);
  if(!time) return false;
  const timeStart = time.clone().subtract(1,'hours');
  const timeEnd = time.clone().add(1, 'hours');
  const current = moment();
  if(current>=timeStart && current<=timeEnd) return true;
  return false;
}
exports.inWeektime = inWeektime;


const isUserType1 = () => {
  return app.getGlobalData().user.userType === CONSTS.USERTYPE_FD;
}
exports.isUserType1 = isUserType1;

const isUserType2 = () => {
  return app.getGlobalData().user.userType === CONSTS.USERTYPE_ZK;
}
exports.isUserType2 = isUserType2;
const isUserType3 = () => { 
  return app.getGlobalData().user.userType === CONSTS.USERTYPE3;
}
exports.isUserType3 = isUserType3;

/**
 * 检查权限
 * right：指定的权限字串，如'101'
 */
const checkRights = (right) => {
  if (!isUserType1() && !isUserType2() && !isUserType3()) {
    //用户未注册或用户数据异常，回到主页面
    return false;
  }
  if(utils.isEmpty(right)) return true;
  //userType1为机构管理员，全权
  if(isUserType1()) return true;

  if (right==='104') return true;   // 授权管理，暂不检查权限

  const user = app.getGlobalData().user;
  const {granted} = user;
  let haveRight = false;
  // console.log('checkright:',granted,right,yzhid);
  if(granted && granted.length>0){
    for(let i=0;i<granted.length;i++){
      const { rights } = granted[i];
      if (rights.includes(right)){
        haveRight = true;
        break;
      }
    };
  }
  // if (showts && !haveRight ) utils.showToast('你无权操作此功能！');
  return haveRight;
}
exports.checkRights = checkRights;

